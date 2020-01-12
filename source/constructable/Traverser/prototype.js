import promiseProperRace from '@dependency/promiseProperRace'
import { proxifyMethodDecorator } from '../../utility/proxifyMethodDecorator.js'
import { removeUndefinedFromObject } from '../../utility/removeUndefinedFromObject.js'
import * as Context from '../Context.class.js'
import { TraverserPosition } from './TraverserPosition.class.js'

// Each exported property ends up as the prototype property of the class.
export * from './method/stageNode.js'
export * from './method/rerouteNode.js'
export * from './method/forkEdge.js'
export * from './method/executeEdge.js'
export * as traverserInstruction from './method/traverserInstruction'

/** Graph traversal integration layer (core) - Controls the traversing the nodes in the graph. Which includes processing of data items and aggregation of results.
 * Dynamic implementation - not restricted to specific initialization algorithm, rather choosen from setting of each node in the traversed graph.
 * Edge functions are part of the integration layer where node implementations are called.
 */
// Note: wrapping in object allows the usage of decorators as they couldn't be used on separate functions.
export const { traverse } = {
  // Initiate traversal or an existing traversal sequence.
  /** The `traverse` method is used to traverse entrypoint nodes only (Stage & Reroute/SubgraphTemplate). */
  @proxifyMethodDecorator(async (target, thisArg, argumentsList, targetClass, methodName) => {
    // create node instance, in case string key is passed as parameter.
    let { nodeInstance /* type Node */, nodeKey, nodeID, traverserPosition } = argumentsList[0]
    if (!nodeInstance) {
      if (nodeKey) nodeInstance = await thisArg.graph.database::thisArg.graph.database.implementation.getNodeByKey({ key: nodeKey })
      // retrieve node data on-demand
      else if (nodeID) nodeInstance = await thisArg.graph.database::thisArg.graph.database.implementation.getNodeByID({ id: nodeID })
      // in case an already initiated traverser instance is passed.
      else if (traverserPosition) nodeInstance = traverserPosition.node
      // retrieve node data on-demand
      else throw new Error('• node identifier or object must be passed in.')
      ;['nodeKey', 'nodeID'].forEach(property => delete argumentsList[0][property]) // remove node related identifiers.
    }
    // Verify entrypoint, and mark the label being used as entrypoint node type (as multiple entrypoint node types could be registered on the same node)
    nodeInstance.entrypointNodeType = TraverserPosition.getEntrypointNodeType({ node: nodeInstance })

    argumentsList[0].nodeInstance ||= nodeInstance // set node data
    return Reflect.apply(target, thisArg, argumentsList)
  })
  async traverse(
    {
      nodeInstance,
      implementationKey,
      evaluation,
      additionalChildNode,
      // current node related parameters
      traverserPosition,
    },
    { parentTraverserPosition, traverseCallContext } = {},
  ) {
    this.traversedNodeList.push(nodeInstance)

    {
      // each call creates new traverser with calculation of traversal implementation hierarchy  and position evaluation for the current node
      traverserPosition ||= new TraverserPosition({
        traverser: this,
        node: nodeInstance,
        parentTraverserPosition,
      })

      if (implementationKey) {
        traverserPosition.setImplementationHierarchy('parameter', implementationKey |> removeUndefinedFromObject)
        // TODO: Add if statement to check for configuration depth value, where it controls the effect of the configuratiopn option on the next nested nodes in the graph. i.e. Passing the parent argument or removing it.
        /* for now, pass argument to all nested nodes by default (by not removing the argument)
           delete arguments[0].implementationKey */
      }

      // remove undefined values because native Object.assign doesn't override keys with `undefined` values
      if (evaluation) {
        traverserPosition.setEvaluationHierarchy('parameter', evaluation)
        // TODO: Add if statement to check for configuration depth value, where it controls the effect of the configuratiopn option on the next nested nodes in the graph. i.e. Passing the parent argument or removing it.
        delete arguments[0].evaluation
      }

      // Evaluation that affects the traverser itself - get configuration of type 'evaluation' & 'implementation'
      let { implementationConfiguration, evaluationConfiguration } = await this::this.traverserInstruction.configurationEvaluation.resolveEvaluationConfiguration({
        targetNode: traverserPosition.node,
      })
      traverserPosition.setImplementationHierarchy('configuration', implementationConfiguration)
      traverserPosition.setEvaluationHierarchy('configuration', evaluationConfiguration)

      // set aggregator using own calculated implementation
      traverserPosition.initialize()
    }

    let implementation = traverserPosition.getEntrypointNodeImplementation()
    return await this::implementation({ traverserPosition, additionalChildNode }, { traverseCallContext })
  },
}

/** next iterator returns entrypoint nodes (Stage or Reroute/SubgraphTemplate nodes)
 * @param nodeIterator - iterator of object { node: <node data> }
 */
export async function traverseIterationRecursiveCallback({ traversalIterator, additionalChildNode, traverserPosition, traverseCallContext }) {
  // first call is used to initialize the function (using non-standard function.sent)
  let nextYielded = await traversalIterator.next({ eventEmitterCallback: (...args) => traverserPosition.eventEmitter.emit('nodeTraversalCompleted', ...args) })
  // call traverse for each node
  while (!nextYielded.done) {
    /* TODO: Missing ability to await next node in chain traversal P- e.g. Pass next function to control traversal initiation of next node in line
      Use generator function to stop traversal function and signal to the control code to await specific group of node iterators. This will keep the control of iteration in the originating port controller/function, instead of iterating from within many other nodes (which will be hard to debug).
    */
    // let traversalInvocation = function() {}
    // pass Iterator
    // from within next - call iterator.next & traverse
    let traversalPromise = this::this.traverse({ nodeInstance: nextYielded.value.node /* next node */, additionalChildNode }, { parentTraverserPosition: traverserPosition, traverseCallContext })
    // 🔁 recursion traversal call (with next node)
    nextYielded = await traversalIterator.next({ traversalPromise })
  }
  return nextYielded.value // last yielded value is the result array.
}

/**
 * Controls execution of node traversals & Hands over control to implementation:
 *  1. Accepts new nodes from implementing function.
 *  2. returns back to the implementing function a promise, handing control of flow and arragement of running traversals.
 * @return {iterator feed of object} - {config: { port: <port node> }, result: <array of next nodes>}
 */
export async function* traverseGroupIterationRecursiveCall({
  groupIterator /** Feeding iterator that will accept node parameters for traversals */,
  additionalChildNode,
  traverseCallContext,
  /** 
    Important Note:  
    Below parameters are used in the interception proxy to decide what to traverse and how to aggregate the results. 
    `Traversal config` in the interception will limit the traversal and processing, i.e. it decides if to process current node, if to include it to aggragation, and if to traverse the nested nodes.
    If interception proxy is excluded (no implementation set), the graph should traverse all nodes with no restrictions.
  */
  traverserPosition,
  processDataCallback,
}) {
  // port traversal result - last node iterator feed should be an array of resolved node promises that will be forwarded through this function
  // forward array of resolved results
  for await (let { group } of groupIterator) {
    /*
      2-way communication with propagation implamentation -  next nodes iterator with receiving promise of node traversal
      the first iterator object call is used to initialize the function, in addition to the iterator function call.
    */
    let traversalIterator = traversalIterator2WayCommunication({
      nodeIteratorFeed: group.nodeIterator,
      implementation: handlePropagation[group.config.handlePropagationImplementationKey || 'chronological'],
    })

    yield {
      group: {
        result: await this::this.traverseIterationRecursiveCallback({
          traversalIterator,
          additionalChildNode,
          traverserPosition,
          traverseCallContext,
        }),
        config: {
          portNode: group.config.forkEdge.destination, // the related port which the stage originated from.
        },
      },
    }
  }
}

/** 
This function is a middleware between 'traverseIterationRecursiveCallback' external function and internal handlePropagation implementation.
Async generator trap (all port propagation handlers pass through this trap) which verifies that all port implementations follow a 2 way iterator communication.
 * @receive [function.sent] Object { eventEmitterCallback: <function emitting a traversal complete event> } - during iterator initialization.
 *
 * Iteration 2 way communication:
 * 1. @yield object { node: <node data> }
 * 2. @recieve [function.sent] object { traversalPromise }
 *
 * @return {Array} results array
 */
async function* traversalIterator2WayCommunication({ nodeIteratorFeed, implementation }) {
  let { eventEmitterCallback } = function.sent

  let traversalIteratorFeed = implementation({ nodeIteratorFeed, emit: eventEmitterCallback }) // pass iterator to implementation and propagate back (through return statement) the results of the node promises after completion

  let iteratorObject = await traversalIteratorFeed.next()
  while (!iteratorObject.done) {
    yield { node: iteratorObject.value.node }
    iteratorObject = await traversalIteratorFeed.next({ traversalPromise: function.sent.traversalPromise })
  }
  return iteratorObject.value
}

/**
 * Methods controlling the iteration over nodes and execution arrangement.
 * Propagation Control implementation - Handles the graph traversal propagation order of Next nodes: 
    - Parallel
    - Chronological
    - Race first
    - etc...
 * @param nodeIteratorFeed iterator of object {node:<node data>}
 * @param emit event emitter callback used to indicate immediate resolution of node traversal promise (i.e. when the node completes it's traversal).
 */
const handlePropagation = {
  /**
  * Execution of nodes in chain with downstream & upstream - Execute node partially then wait for the next node, in order to finish execution. 
    e.g. Koa Middlewares concept, where each middleware waits for the next to finish and then continues it's own execution.
    In this case the graph represents the order of middlewares to be chained, without necessarily using a linear grpah (the graph still uses nested and neighbouring children to represent the middleware chain, which allows for more flexibility).
  **/
  downAndUpStream: async function*({ nodeIteratorFeed, emit }) {
    let nodeResultList = []
    // first to be executed is last to finish
    for await (let { node } of nodeIteratorFeed) {
      /** 
      Steps: 
        - yield node data
        -(external function): call traverse, producing promise
        - decide when to await for the promise
        - return results
      */
      yield { node }
      let nextResult = await function.sent.traversalPromise
      emit(nextResult) // emit for immediate consumption
      nodeResultList.push(nextResult)
    }
    return nodeResultList
  },

  /**
   * Sequential node execution - await each node till it finishes execution.
   **/
  chronological: async function*({ nodeIteratorFeed, emit }) {
    let nodeResultList = []
    for await (let { node } of nodeIteratorFeed) {
      yield { node }
      let nextResult = await function.sent.traversalPromise
      emit(nextResult) // emit for immediate consumption
      nodeResultList.push(nextResult)
    }
    return nodeResultList
  },
  // Note: kept for future reference. Implementation using while loop instead of `for await`, as it allows for passing initial config value for the generator function (that will use function.sent to catch it.)
  chronological_implementationUsingWhileLoop: async function*({ nodeIteratorFeed, emit }) {
    let nodeResultList = []

    let iteratorObject = await nodeIteratorFeed.next() // initialize generator function execution and pass execution configurations.
    while (!iteratorObject.done) {
      yield { node: iteratorObject.value.node }
      let nextResult = await function.sent.traversalPromise
      emit(nextResult) // emit for immediate consumption
      nodeResultList.push(nextResult)
      iteratorObject = await nodeIteratorFeed.next()
    }

    return nodeResultList
  },

  /**
   * Race promise of nodes - first to resolve is the one to be returned
   */
  raceFirstPromise: async function*({ nodeIteratorFeed, emit }) {
    let nodePromiseArray = []

    let iteratorObject = await nodeIteratorFeed.next() // initialize generator function execution and pass execution configurations.
    while (!iteratorObject.done) {
      yield { node: iteratorObject.value.node }
      let traversalPromise = function.sent.traversalPromise
      nodePromiseArray.push(traversalPromise)
      iteratorObject = await nodeIteratorFeed.next()
    }

    let nodeResolvedResult = await promiseProperRace(nodePromiseArray)
      .then(resolvedPromiseArray => {
        return resolvedPromiseArray[0] // as only one promise is return in the array - the first promise to be resolved.
      })
      .catch(error => {
        // TODO: catch all error and output them for each rejected promise. (edit promiseProperRace module)
        console.error(`🔀⚠️ promiseProperRace rejected because: ${error}`)
      })

    if (nodeResolvedResult) {
      emit(nodeResolvedResult) // emitting result is not immediate in this case, because the objective is to get a single resolved promise, and "promiseProperRace" maybe doesn't have the ability to stop uncompleted promises.
      return [nodeResolvedResult] // returned results must be wrapped in array so it could be forwarded through yeild* generator.
    } else return []
  },

  /**
   * Insures all nodeConnection promises resolves.
   **/
  allPromise: async function*({ nodeIteratorFeed, emit }) {
    let nodePromiseArray = [] // order of call initialization
    let resolvedOrderedNodeResolvedResult = [] // order of completion

    let iteratorObject = await nodeIteratorFeed.next() // initialize generator function execution and pass execution configurations.
    while (!iteratorObject.done) {
      yield { node: iteratorObject.value.node }
      let traversalPromise = function.sent.traversalPromise.then(result => {
        emit(result) // emit result for immediate usage by lisnters
        resolvedOrderedNodeResolvedResult.push(result) // array of node process results.
      }) // arrange promises according to resolution order.
      nodePromiseArray.push(traversalPromise) // promises are in the same arrangment of connection iteration.
      iteratorObject = await nodeIteratorFeed.next()
    }

    // resolve all promises
    let nodeResolvedResultArray = await Promise.all(nodePromiseArray).catch(error => {
      if (process.env.SZN_DEBUG == 'true') console.error(`🔀⚠️ \`Promise.all\` for nodeConnectionArray rejected because: ${error}`)
      else console.log(error)
    })

    // ordered results according to promise completion.
    return resolvedOrderedNodeResolvedResult // return for all resolved results

    // Preserves the order of nodes original in connection array, i.e. does not order the node results according to the execution completion, rather according to the first visited during traversal.
    // for (let nextResult of nodeResolvedResultArray) {
    //   emit(nextResult)
    // }
  },
}

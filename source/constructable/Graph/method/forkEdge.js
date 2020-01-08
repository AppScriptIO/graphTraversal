import assert from 'assert'
import promiseProperRace from '@dependency/promiseProperRace'

/**
 * @description loops through all the `node ports` and initializes each one to execute the `node connections` specific for it.
 * @yield  {iterator feed of object} nodes group object - nested object containing Fork/Port iterator with nested Next/Stage iterator for each.
 * TODO: add ability to pass traversal configuration to a group of connections. Each port holds traversal cofigs that should affect all connection connected to this port.
 * OR
 * @return {undefined} in case no forks.
 **/
export async function* forkEdge({ stageNode, additionalChildNode, getImplementation, graph = this }) {
  const { forkArray } = await graph.databaseWrapper.getFork({ concreteDatabase: graph.database, nodeID: stageNode.identity })
  if (forkArray.length == 0) return
  // Bulk actions on forks - sort forks
  forkArray.sort((former, latter) => former.connection.properties.order - latter.connection.properties.order || isNaN(former.connection.properties.order) - isNaN(latter.connection.properties.order)) // using `order` property

  for (let forkEdge of forkArray) {
    assert(forkEdge.destination.labels.includes(graph.schemeReference.nodeLabel.port), `• "${forkEdge.destination.labels}" Unsupported node type for a FORK connection.`) // verify node type

    // get node iteartor from "portNode" implemenation - e.g. "nestedNode"
    let implementation = getImplementation(forkEdge.destination.properties.implementation) // Traversal implementation - node/edge properties implementation hierarchy - calculate and pick correct implementation according to parameter hierarchy.
    let nodeIteratorFeed = graph::implementation({ forkEdge, additionalChildNode, graph })

    // the first iterator object call is used to initialize the function, in addition to the iterator function call.
    let traversalIterator = traversalIterator2WayCommunication({
      nodeIteratorFeed,
      implementation: handlePropagation[forkEdge.connection.properties.handlePropagationImplementation || 'chronological'],
    })

    yield {
      group: {
        traversalIterator, // next nodes iterator with receiving promise of node traversal
        // nodes group information
        config: {
          forkEdge,
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

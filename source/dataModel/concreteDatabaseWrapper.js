/** Use concrete Database class instances to retrieve nodes and verify the results with a schema - wrap the concrete database with more specific query functions */

import assert from 'assert'
import * as schemeReference from '../dataModel/graphSchemeReference.js'

export function isSelfEdge(edge) {
  return edge.source.identity == edge.destination.identity
}

export async function getResource({ concreteDatabase, nodeID }) {
  let resourceArray = await concreteDatabase.getNodeConnection({ direction: 'incoming', nodeID, connectionType: schemeReference.connectionType.resource })
  assert(
    resourceArray.every(n => schemeReference.connectionProperty.context.includes(n.connection.properties.context)),
    `• Unsupported property value for a RESOURCE connection.`,
  ) // verify node type
  return { resourceArray }
}

export async function getValue({ concreteDatabase, nodeID }) {
  let valueArray = await concreteDatabase.getNodeConnection({ direction: 'incoming', nodeID, connectionType: schemeReference.connectionType.value })
  assert(
    valueArray.every(n => schemeReference.connectionProperty.type.includes(n.connection.properties.type)),
    `• Unsupported "type" property value for a VALUE connection.`,
  ) // verify node type
  return { valueArray: valueArray }
}

export async function getExecution({ concreteDatabase, nodeID }) {
  let executeArray = await concreteDatabase.getNodeConnection({ direction: 'outgoing', nodeID, connectionType: schemeReference.connectionType.execute })
  assert(
    executeArray.every(n => n.destination.labels.includes(schemeReference.nodeLabel.process)),
    `• Unsupported node type for a EXECUTE connection.`,
  ) // verify node type
  return { executeArray }
}

export async function getFork({ concreteDatabase, nodeID }) {
  let forkArray = await concreteDatabase.getNodeConnection({ direction: 'outgoing', nodeID: nodeID, connectionType: schemeReference.connectionType.fork })
  assert(
    forkArray.every(n => n.destination.labels.includes(schemeReference.nodeLabel.port)),
    `• Unsupported property value for a FORK connection.`,
  ) // verify node type
  return { forkArray }
}

export async function getNext({ concreteDatabase, nodeID }) {
  let nextArray = await concreteDatabase.getNodeConnection({ direction: 'outgoing', nodeID: nodeID, connectionType: schemeReference.connectionType.next })
  assert(
    nextArray.every(n => n.destination.labels.includes(schemeReference.nodeLabel.stage) || n.destination.labels.includes(schemeReference.nodeLabel.reroute)),
    `• Unsupported property value for a NEXT connection.`,
  ) // verify node type
  return { nextArray }
}

export async function getConfigure({ concreteDatabase, nodeID }) {
  let configureArray = await concreteDatabase.getNodeConnection({ direction: 'incoming', nodeID: nodeID, connectionType: schemeReference.connectionType.configure })
  assert(
    configureArray.every(n => n.source.labels.includes(schemeReference.nodeLabel.configuration) || n.source.labels.includes(schemeReference.nodeLabel.reroute)),
    `• Unsupported node type for a CONFIGURE connection.`,
  ) // verify node type
  assert(
    configureArray.every(n => n.connection.properties.setting),
    `• Missing "setting" property on a CONFIGURE connection.`,
  )

  return { configureArray }
}

export async function getCase({ concreteDatabase, nodeID }) {
  let caseArray = await concreteDatabase.getNodeConnection({ direction: 'outgoing', nodeID, connectionType: schemeReference.connectionType.case })
  assert(
    caseArray.every(n => n.destination.labels.includes(schemeReference.nodeLabel.configuration)),
    `• Unsupported property value for a CASE connection.`,
  ) // verify node type
  return { caseArray }
}

export async function getDefault({ concreteDatabase, nodeID }) {
  let defaultArray = await concreteDatabase.getNodeConnection({ direction: 'outgoing', nodeID, connectionType: schemeReference.connectionType.default })
  assert(
    defaultArray.every(n => n.destination.labels.includes(schemeReference.nodeLabel.configuration)),
    `• Unsupported property value for a DEFAULT connection.`,
  ) // verify node type
  return { defaultArray }
}

export async function getReference({ concreteDatabase, nodeID }) {
  let referenceArray = await concreteDatabase.getNodeConnection({ direction: 'outgoing', nodeID: nodeID, connectionType: schemeReference.connectionType.reference })
  assert(
    referenceArray.every(n => n.destination.labels.includes(schemeReference.nodeLabel.stage) || n.destination.labels.includes(schemeReference.nodeLabel.reroute)),
    `• Unsupported node type for a ${schemeReference.connectionType.reference} connection.`,
  ) // verify node type
  return { referenceArray }
}

export async function getExtend({ concreteDatabase, nodeID }) {
  let extendArray = await concreteDatabase.getNodeConnection({ direction: 'outgoing', nodeID: nodeID, connectionType: schemeReference.connectionType.extend })
  assert(
    extendArray.every(n => n.destination.labels.includes(schemeReference.nodeLabel.reroute)),
    `• Unsupported node type for a EXTEND connection.`,
  ) // verify node type
  return { extendArray }
}

export async function getInsert({ concreteDatabase, nodeID }) {
  let insertArray = await concreteDatabase.getNodeConnection({ direction: 'incoming', nodeID: nodeID, connectionType: schemeReference.connectionType.insert })
  assert(
    insertArray.every(n => n.source.labels.includes(schemeReference.nodeLabel.stage)),
    `• Unsupported node type for a INSERT connection.`,
  ) // verify node type
  return { insertArray }
}

/*
      _                                    _           _                         _           
     / \   __ _  __ _ _ __ ___  __ _  __ _| |_ ___  __| |   __ _ _   _  ___ _ __(_) ___  ___ 
    / _ \ / _` |/ _` | '__/ _ \/ _` |/ _` | __/ _ \/ _` |  / _` | | | |/ _ \ '__| |/ _ \/ __|
   / ___ \ (_| | (_| | | |  __/ (_| | (_| | ||  __/ (_| | | (_| | |_| |  __/ |  | |  __/\__ \
  /_/   \_\__, |\__, |_|  \___|\__, |\__,_|\__\___|\__,_|  \__, |\__,_|\___|_|  |_|\___||___/
          |___/ |___/          |___/                          |_|                            
*/

export async function getRerouteElement({ concreteDatabase, nodeID }) {
  const { referenceArray } = await getReference({ concreteDatabase, nodeID })
  const { extendArray } = await getExtend({ concreteDatabase, nodeID })
  const { insertArray } = await getInsert({ concreteDatabase, nodeID })

  if (extendArray.length > 1) throw new Error(`• Multiple extend relationships are not supported for Reroute node.`)
  if (referenceArray.length > 1) throw new Error(`• Multiple reference relationships are not supported for Reroute node.`)

  return { extend: extendArray.length > 0 ? extendArray[0] : null, reference: referenceArray.length > 0 ? referenceArray[0] : null, insertArray }
}

export async function getSwitchElement({ concreteDatabase, nodeID }) {
  const { caseArray } = await getCase({ concreteDatabase, nodeID })
  const { defaultArray } = await getDefault({ concreteDatabase, nodeID })

  if (defaultArray.length > 1) throw new Error(`• Multiple default relationships are not supported for Switch node.`)

  return { caseArray: caseArray.length > 0 ? caseArray : null, default: defaultArray.length > 0 ? defaultArray[0] : null }
}

// Value connection concept implementation
export async function getTargetValue({ concreteDatabase, nodeID }) {
  // get VALUE connection
  let value
  const { valueArray } = await getValue({ concreteDatabase, nodeID })
  if (valueArray.length > 1) throw new Error(`• Multiple VALUE relationships are not supported for Process node.`)
  else if (valueArray.length != 0 && valueArray[0])
    switch (valueArray[0].connection.properties.type) {
      case 'properties':
        value = valueArray[0].destination.properties
        break
      case 'node':
        value = valueArray[0].destination
        break
      case 'valueProperty':
        value = valueArray[0].destination.properties.value
        break
      default:
        throw new Error(`• VALUE edge "type" property value is not supported.`)
        break
    }
  return value
}
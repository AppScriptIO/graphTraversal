"use strict";var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");Object.defineProperty(exports, "__esModule", { value: true });exports.isSelfEdge = isSelfEdge;exports.getResource = getResource;exports.getValue = getValue;exports.getExecution = getExecution;exports.getPipe = getPipe;exports.getFork = getFork;exports.getNext = getNext;exports.getConfigure = getConfigure;exports.getCase = getCase;exports.getSelect = getSelect;exports.getFallback = getFallback;exports.getReference = getReference;exports.getExtend = getExtend;exports.getInsert = getInsert;exports.getSubgraph = getSubgraph;exports.getRerouteTraverseReferenceElement = getRerouteTraverseReferenceElement;exports.getReferenceResolutionElement = getReferenceResolutionElement;exports.getSelectionElement = getSelectionElement;exports.getConditionSwitchElement = getConditionSwitchElement;exports.getValueElement = getValueElement;

var _assert = _interopRequireDefault(require("assert"));
var schemeReference = _interopRequireWildcard(require("../dataModel/graphSchemeReference.js"));

function isSelfEdge(edge) {
  return edge.source.identity == edge.destination.identity;
}

async function getResource({ concreteDatabase, nodeID }) {
  let resourceArray = await concreteDatabase.getNodeConnection({ direction: 'incoming', nodeID, connectionType: schemeReference.connectionType.resource });
  (0, _assert.default)(
  resourceArray.every(n => schemeReference.resourceProperty.context.includes(n.connection.properties.context)),
  `• Unsupported property value for a RESOURCE connection.`);

  return { resourceArray };
}

async function getValue({ concreteDatabase, nodeID }) {
  let valueArray = await concreteDatabase.getNodeConnection({ direction: 'incoming', nodeID, connectionType: schemeReference.connectionType.value });
  return { valueArray: valueArray };
}

async function getExecution({ concreteDatabase, nodeID }) {
  let executeArray = await concreteDatabase.getNodeConnection({ direction: 'outgoing', nodeID, connectionType: schemeReference.connectionType.execute });
  (0, _assert.default)(
  executeArray.every(n => n.destination.labels.includes(schemeReference.nodeLabel.process)),
  `• Unsupported node type for a EXECUTE connection.`);

  return { executeArray };
}

async function getPipe({ concreteDatabase, nodeID }) {
  let pipeArray = await concreteDatabase.getNodeConnection({ direction: 'outgoing', nodeID, connectionType: schemeReference.connectionType.pipe });
  (0, _assert.default)(
  pipeArray.every(n => n.destination.labels.includes(schemeReference.nodeLabel.process)),
  `• Unsupported node type for a PIPE connection.`);

  return { pipeArray };
}

async function getFork({ concreteDatabase, nodeID }) {
  let forkArray = await concreteDatabase.getNodeConnection({ direction: 'outgoing', nodeID: nodeID, connectionType: schemeReference.connectionType.fork });
  (0, _assert.default)(
  forkArray.every(n => n.destination.labels.includes(schemeReference.nodeLabel.port)),
  `• Unsupported property value for a FORK connection.`);

  return { forkArray };
}

async function getNext({ concreteDatabase, nodeID }) {
  let nextArray = await concreteDatabase.getNodeConnection({ direction: 'outgoing', nodeID: nodeID, connectionType: schemeReference.connectionType.next });
  (0, _assert.default)(
  nextArray.every(n => n.destination.labels.includes(schemeReference.nodeLabel.stage) || n.destination.labels.includes(schemeReference.nodeLabel.reroute)),
  `• Unsupported property value for a NEXT connection.`);

  return { nextArray };
}

async function getConfigure({ concreteDatabase, nodeID }) {
  let configureArray = await concreteDatabase.getNodeConnection({ direction: 'incoming', nodeID: nodeID, connectionType: schemeReference.connectionType.configure });
  (0, _assert.default)(
  configureArray.every(n => n.source.labels.includes(schemeReference.nodeLabel.configuration) || n.source.labels.includes(schemeReference.nodeLabel.reroute)),
  `• Unsupported node type for a CONFIGURE connection.`);

  (0, _assert.default)(
  configureArray.every(n => n.connection.properties.setting),
  `• Missing "setting" property on a CONFIGURE connection.`);


  return { configureArray };
}

async function getCase({ concreteDatabase, nodeID }) {
  let caseArray = await concreteDatabase.getNodeConnection({ direction: 'outgoing', nodeID, connectionType: schemeReference.connectionType.case });

  return { caseArray };
}

async function getSelect({ concreteDatabase, nodeID }) {
  let selectArray = await concreteDatabase.getNodeConnection({ direction: 'outgoing', nodeID, connectionType: schemeReference.connectionType.select });

  return { selectArray };
}

async function getFallback({ concreteDatabase, nodeID }) {
  let fallbackArray = await concreteDatabase.getNodeConnection({ direction: 'outgoing', nodeID, connectionType: schemeReference.connectionType.fallback });

  return { fallbackArray };
}

async function getReference({ concreteDatabase, nodeID }) {
  let referenceArray = await concreteDatabase.getNodeConnection({ direction: 'outgoing', nodeID: nodeID, connectionType: schemeReference.connectionType.reference });

  (0, _assert.default)(
  referenceArray.every(n => n.destination.labels.includes(schemeReference.nodeLabel.stage) || n.destination.labels.includes(schemeReference.nodeLabel.reroute)),
  `• Unsupported node type for a ${schemeReference.connectionType.reference} connection.`);

  return { referenceArray };
}

async function getExtend({ concreteDatabase, nodeID }) {
  let extendArray = await concreteDatabase.getNodeConnection({ direction: 'outgoing', nodeID: nodeID, connectionType: schemeReference.connectionType.extend });
  (0, _assert.default)(
  extendArray.every(n => n.destination.labels.includes(schemeReference.nodeLabel.reroute)),
  `• Unsupported node type for a EXTEND connection.`);

  return { extendArray };
}

async function getInsert({ concreteDatabase, nodeID }) {
  let insertArray = await concreteDatabase.getNodeConnection({ direction: 'incoming', nodeID: nodeID, connectionType: schemeReference.connectionType.insert });
  (0, _assert.default)(
  insertArray.every(n => n.source.labels.includes(schemeReference.nodeLabel.stage)),
  `• Unsupported node type for a INSERT connection.`);

  return { insertArray };
}

async function getSubgraph({ concreteDatabase, nodeID }) {
  let subgraphArray = await concreteDatabase.getNodeConnection({ direction: 'incoming', nodeID: nodeID, connectionType: schemeReference.connectionType.subgraph });
  (0, _assert.default)(
  subgraphArray.every(n => n.source.labels.includes(schemeReference.nodeLabel.stage) || n.source.labels.includes(schemeReference.nodeLabel.reroute)),
  `• Unsupported node type for a SUBGRAPH connection.`);

  return { subgraphArray };
}










async function getRerouteTraverseReferenceElement({ concreteDatabase, nodeID }) {
  const { extendArray } = await getExtend({ concreteDatabase, nodeID });
  const { insertArray } = await getInsert({ concreteDatabase, nodeID });

  if (extendArray.length > 1) throw new Error(`• Multiple extend relationships are not supported for Reroute node.`);

  return { extend: extendArray.length > 0 ? extendArray[0] : null, insertArray };
}

async function getReferenceResolutionElement({ concreteDatabase, nodeID }) {
  const { referenceArray } = await getReference({ concreteDatabase, nodeID });

  if (referenceArray.length > 1) throw new Error(`• Multiple reference relationships are not supported for Reroute node.`);

  return { reference: referenceArray.length > 0 ? referenceArray[0] : null };
}

async function getSelectionElement({ concreteDatabase, nodeID }) {
  const { selectArray } = await getSelect({ concreteDatabase, nodeID });
  const { fallbackArray } = await getFallback({ concreteDatabase, nodeID });

  if (fallbackArray.length > 1) throw new Error(`• Multiple "fallback" relationships are not supported for Selection/Switch node.`);

  return { selectArray: selectArray.length > 0 ? selectArray : null, fallback: fallbackArray.length > 0 ? fallbackArray[0] : null };
}

async function getConditionSwitchElement({ concreteDatabase, nodeID }) {
  const { caseArray } = await getCase({ concreteDatabase, nodeID });

  return { caseArray: caseArray.length > 0 ? caseArray : null };
}


async function getValueElement({ concreteDatabase, nodeID }) {

  let value;
  const { valueArray } = await getValue({ concreteDatabase, nodeID });
  if (valueArray.length > 1) throw new Error(`• Multiple VALUE relationships are not supported for Process node.`);else
  if (valueArray.length != 0 && valueArray[0]) return valueArray[0];
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NvdXJjZS9kYXRhTW9kZWwvY29uY3JldGVEYXRhYmFzZVdyYXBwZXIuanMiXSwibmFtZXMiOlsiaXNTZWxmRWRnZSIsImVkZ2UiLCJzb3VyY2UiLCJpZGVudGl0eSIsImRlc3RpbmF0aW9uIiwiZ2V0UmVzb3VyY2UiLCJjb25jcmV0ZURhdGFiYXNlIiwibm9kZUlEIiwicmVzb3VyY2VBcnJheSIsImdldE5vZGVDb25uZWN0aW9uIiwiZGlyZWN0aW9uIiwiY29ubmVjdGlvblR5cGUiLCJzY2hlbWVSZWZlcmVuY2UiLCJyZXNvdXJjZSIsImV2ZXJ5IiwibiIsInJlc291cmNlUHJvcGVydHkiLCJjb250ZXh0IiwiaW5jbHVkZXMiLCJjb25uZWN0aW9uIiwicHJvcGVydGllcyIsImdldFZhbHVlIiwidmFsdWVBcnJheSIsInZhbHVlIiwiZ2V0RXhlY3V0aW9uIiwiZXhlY3V0ZUFycmF5IiwiZXhlY3V0ZSIsImxhYmVscyIsIm5vZGVMYWJlbCIsInByb2Nlc3MiLCJnZXRQaXBlIiwicGlwZUFycmF5IiwicGlwZSIsImdldEZvcmsiLCJmb3JrQXJyYXkiLCJmb3JrIiwicG9ydCIsImdldE5leHQiLCJuZXh0QXJyYXkiLCJuZXh0Iiwic3RhZ2UiLCJyZXJvdXRlIiwiZ2V0Q29uZmlndXJlIiwiY29uZmlndXJlQXJyYXkiLCJjb25maWd1cmUiLCJjb25maWd1cmF0aW9uIiwic2V0dGluZyIsImdldENhc2UiLCJjYXNlQXJyYXkiLCJjYXNlIiwiZ2V0U2VsZWN0Iiwic2VsZWN0QXJyYXkiLCJzZWxlY3QiLCJnZXRGYWxsYmFjayIsImZhbGxiYWNrQXJyYXkiLCJmYWxsYmFjayIsImdldFJlZmVyZW5jZSIsInJlZmVyZW5jZUFycmF5IiwicmVmZXJlbmNlIiwiZ2V0RXh0ZW5kIiwiZXh0ZW5kQXJyYXkiLCJleHRlbmQiLCJnZXRJbnNlcnQiLCJpbnNlcnRBcnJheSIsImluc2VydCIsImdldFN1YmdyYXBoIiwic3ViZ3JhcGhBcnJheSIsInN1YmdyYXBoIiwiZ2V0UmVyb3V0ZVRyYXZlcnNlUmVmZXJlbmNlRWxlbWVudCIsImxlbmd0aCIsIkVycm9yIiwiZ2V0UmVmZXJlbmNlUmVzb2x1dGlvbkVsZW1lbnQiLCJnZXRTZWxlY3Rpb25FbGVtZW50IiwiZ2V0Q29uZGl0aW9uU3dpdGNoRWxlbWVudCIsImdldFZhbHVlRWxlbWVudCJdLCJtYXBwaW5ncyI6Ijs7QUFFQTtBQUNBOztBQUVPLFNBQVNBLFVBQVQsQ0FBb0JDLElBQXBCLEVBQTBCO0FBQy9CLFNBQU9BLElBQUksQ0FBQ0MsTUFBTCxDQUFZQyxRQUFaLElBQXdCRixJQUFJLENBQUNHLFdBQUwsQ0FBaUJELFFBQWhEO0FBQ0Q7O0FBRU0sZUFBZUUsV0FBZixDQUEyQixFQUFFQyxnQkFBRixFQUFvQkMsTUFBcEIsRUFBM0IsRUFBeUQ7QUFDOUQsTUFBSUMsYUFBYSxHQUFHLE1BQU1GLGdCQUFnQixDQUFDRyxpQkFBakIsQ0FBbUMsRUFBRUMsU0FBUyxFQUFFLFVBQWIsRUFBeUJILE1BQXpCLEVBQWlDSSxjQUFjLEVBQUVDLGVBQWUsQ0FBQ0QsY0FBaEIsQ0FBK0JFLFFBQWhGLEVBQW5DLENBQTFCO0FBQ0E7QUFDRUwsRUFBQUEsYUFBYSxDQUFDTSxLQUFkLENBQW9CQyxDQUFDLElBQUlILGVBQWUsQ0FBQ0ksZ0JBQWhCLENBQWlDQyxPQUFqQyxDQUF5Q0MsUUFBekMsQ0FBa0RILENBQUMsQ0FBQ0ksVUFBRixDQUFhQyxVQUFiLENBQXdCSCxPQUExRSxDQUF6QixDQURGO0FBRUcsMkRBRkg7O0FBSUEsU0FBTyxFQUFFVCxhQUFGLEVBQVA7QUFDRDs7QUFFTSxlQUFlYSxRQUFmLENBQXdCLEVBQUVmLGdCQUFGLEVBQW9CQyxNQUFwQixFQUF4QixFQUFzRDtBQUMzRCxNQUFJZSxVQUFVLEdBQUcsTUFBTWhCLGdCQUFnQixDQUFDRyxpQkFBakIsQ0FBbUMsRUFBRUMsU0FBUyxFQUFFLFVBQWIsRUFBeUJILE1BQXpCLEVBQWlDSSxjQUFjLEVBQUVDLGVBQWUsQ0FBQ0QsY0FBaEIsQ0FBK0JZLEtBQWhGLEVB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QUFGLEVBQW9CQyxNQUFwQixFQUFELENBQW5DOztBQUVBLFNBQU8sRUFBRXlDLFNBQVMsRUFBRUEsU0FBUyxDQUFDcUIsTUFBVixHQUFtQixDQUFuQixHQUF1QnJCLFNBQXZCLEdBQW1DLElBQWhELEVBQVA7QUFDRDs7O0FBR00sZUFBZTBCLGVBQWYsQ0FBK0IsRUFBRXBFLGdCQUFGLEVBQW9CQyxNQUFwQixFQUEvQixFQUE2RDs7QUFFbEUsTUFBSWdCLEtBQUo7QUFDQSxRQUFNLEVBQUVELFVBQUYsS0FBaUIsTUFBTUQsUUFBUSxDQUFDLEVBQUVmLGdCQUFGLEVBQW9CQyxNQUFwQixFQUFELENBQXJDO0FBQ0EsTUFBSWUsVUFBVSxDQUFDK0MsTUFBWCxHQUFvQixDQUF4QixFQUEyQixNQUFNLElBQUlDLEtBQUosQ0FBVyxvRUFBWCxDQUFOLENBQTNCO0FBQ0ssTUFBSWhELFVBQVUsQ0FBQytDLE1BQVgsSUFBcUIsQ0FBckIsSUFBMEIvQyxVQUFVLENBQUMsQ0FBRCxDQUF4QyxFQUE2QyxPQUFPQSxVQUFVLENBQUMsQ0FBRCxDQUFqQjtBQUNuRCIsInNvdXJjZXNDb250ZW50IjpbIi8qKiBVc2UgY29uY3JldGUgRGF0YWJhc2UgY2xhc3MgaW5zdGFuY2VzIHRvIHJldHJpZXZlIG5vZGVzIGFuZCB2ZXJpZnkgdGhlIHJlc3VsdHMgd2l0aCBhIHNjaGVtYSAtIHdyYXAgdGhlIGNvbmNyZXRlIGRhdGFiYXNlIHdpdGggbW9yZSBzcGVjaWZpYyBxdWVyeSBmdW5jdGlvbnMgKi9cblxuaW1wb3J0IGFzc2VydCBmcm9tICdhc3NlcnQnXG5pbXBvcnQgKiBhcyBzY2hlbWVSZWZlcmVuY2UgZnJvbSAnLi4vZGF0YU1vZGVsL2dyYXBoU2NoZW1lUmVmZXJlbmNlLmpzJ1xuXG5leHBvcnQgZnVuY3Rpb24gaXNTZWxmRWRnZShlZGdlKSB7XG4gIHJldHVybiBlZGdlLnNvdXJjZS5pZGVudGl0eSA9PSBlZGdlLmRlc3RpbmF0aW9uLmlkZW50aXR5XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXRSZXNvdXJjZSh7IGNvbmNyZXRlRGF0YWJhc2UsIG5vZGVJRCB9KSB7XG4gIGxldCByZXNvdXJjZUFycmF5ID0gYXdhaXQgY29uY3JldGVEYXRhYmFzZS5nZXROb2RlQ29ubmVjdGlvbih7IGRpcmVjdGlvbjogJ2luY29taW5nJywgbm9kZUlELCBjb25uZWN0aW9uVHlwZTogc2NoZW1lUmVmZXJlbmNlLmNvbm5lY3Rpb25UeXBlLnJlc291cmNlIH0pXG4gIGFzc2VydChcbiAgICByZXNvdXJjZUFycmF5LmV2ZXJ5KG4gPT4gc2NoZW1lUmVmZXJlbmNlLnJlc291cmNlUHJvcGVydHkuY29udGV4dC5pbmNsdWRlcyhuLmNvbm5lY3Rpb24ucHJvcGVydGllcy5jb250ZXh0KSksXG4gICAgYOKAoiBVbnN1cHBvcnRlZCBwcm9wZXJ0eSB2YWx1ZSBmb3IgYSBSRVNPVVJDRSBjb25uZWN0aW9uLmAsXG4gICkgLy8gdmVyaWZ5IG5vZGUgdHlwZVxuICByZXR1cm4geyByZXNvdXJjZUFycmF5IH1cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldFZhbHVlKHsgY29uY3JldGVEYXRhYmFzZSwgbm9kZUlEIH0pIHtcbiAgbGV0IHZhbHVlQXJyYXkgPSBhd2FpdCBjb25jcmV0ZURhdGFiYXNlLmdldE5vZGVDb25uZWN0aW9uKHsgZGlyZWN0aW9uOiAnaW5jb21pbmcnLCBub2RlSUQsIGNvbm5lY3Rpb25UeXBlOiBzY2hlbWVSZWZlcmVuY2UuY29ubmVjdGlvblR5cGUudmFsdWUgfSlcbiAgcmV0dXJuIHsgdmFsdWVBcnJheTogdmFsdWVBcnJheSB9XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXRFeGVjdXRpb24oeyBjb25jcmV0ZURhdGFiYXNlLCBub2RlSUQgfSkge1xuICBsZXQgZXhlY3V0ZUFycmF5ID0gYXdhaXQgY29uY3JldGVEYXRhYmFzZS5nZXROb2RlQ29ubmVjdGlvbih7IGRpcmVjdGlvbjogJ291dGdvaW5nJywgbm9kZUlELCBjb25uZWN0aW9uVHlwZTogc2NoZW1lUmVmZXJlbmNlLmNvbm5lY3Rpb25UeXBlLmV4ZWN1dGUgfSlcbiAgYXNzZXJ0KFxuICAgIGV4ZWN1dGVBcnJheS5ldmVyeShuID0+IG4uZGVzdGluYXRpb24ubGFiZWxzLmluY2x1ZGVzKHNjaGVtZVJlZmVyZW5jZS5ub2RlTGFiZWwucHJvY2VzcykpLFxuICAgIGDigKIgVW5zdXBwb3J0ZWQgbm9kZSB0eXBlIGZvciBhIEVYRUNVVEUgY29ubmVjdGlvbi5gLFxuICApIC8vIHZlcmlmeSBub2RlIHR5cGVcbiAgcmV0dXJuIHsgZXhlY3V0ZUFycmF5IH1cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldFBpcGUoeyBjb25jcmV0ZURhdGFiYXNlLCBub2RlSUQgfSkge1xuICBsZXQgcGlwZUFycmF5ID0gYXdhaXQgY29uY3JldGVEYXRhYmFzZS5nZXROb2RlQ29ubmVjdGlvbih7IGRpcmVjdGlvbjogJ291dGdvaW5nJywgbm9kZUlELCBjb25uZWN0aW9uVHlwZTogc2NoZW1lUmVmZXJlbmNlLmNvbm5lY3Rpb25UeXBlLnBpcGUgfSlcbiAgYXNzZXJ0KFxuICAgIHBpcGVBcnJheS5ldmVyeShuID0+IG4uZGVzdGluYXRpb24ubGFiZWxzLmluY2x1ZGVzKHNjaGVtZVJlZmVyZW5jZS5ub2RlTGFiZWwucHJvY2VzcykpLFxuICAgIGDigKIgVW5zdXBwb3J0ZWQgbm9kZSB0eXBlIGZvciBhIFBJUEUgY29ubmVjdGlvbi5gLFxuICApIC8vIHZlcmlmeSBub2RlIHR5cGVcbiAgcmV0dXJuIHsgcGlwZUFycmF5IH1cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldEZvcmsoeyBjb25jcmV0ZURhdGFiYXNlLCBub2RlSUQgfSkge1xuICBsZXQgZm9ya0FycmF5ID0gYXdhaXQgY29uY3JldGVEYXRhYmFzZS5nZXROb2RlQ29ubmVjdGlvbih7IGRpcmVjdGlvbjogJ291dGdvaW5nJywgbm9kZUlEOiBub2RlSUQsIGNvbm5lY3Rpb25UeXBlOiBzY2hlbWVSZWZlcmVuY2UuY29ubmVjdGlvblR5cGUuZm9yayB9KVxuICBhc3NlcnQoXG4gICAgZm9ya0FycmF5LmV2ZXJ5KG4gPT4gbi5kZXN0aW5hdGlvbi5sYWJlbHMuaW5jbHVkZXMoc2NoZW1lUmVmZXJlbmNlLm5vZGVMYWJlbC5wb3J0KSksXG4gICAgYOKAoiBVbnN1cHBvcnRlZCBwcm9wZXJ0eSB2YWx1ZSBmb3IgYSBGT1JLIGNvbm5lY3Rpb24uYCxcbiAgKSAvLyB2ZXJpZnkgbm9kZSB0eXBlXG4gIHJldHVybiB7IGZvcmtBcnJheSB9XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXROZXh0KHsgY29uY3JldGVEYXRhYmFzZSwgbm9kZUlEIH0pIHtcbiAgbGV0IG5leHRBcnJheSA9IGF3YWl0IGNvbmNyZXRlRGF0YWJhc2UuZ2V0Tm9kZUNvbm5lY3Rpb24oeyBkaXJlY3Rpb246ICdvdXRnb2luZycsIG5vZGVJRDogbm9kZUlELCBjb25uZWN0aW9uVHlwZTogc2NoZW1lUmVmZXJlbmNlLmNvbm5lY3Rpb25UeXBlLm5leHQgfSlcbiAgYXNzZXJ0KFxuICAgIG5leHRBcnJheS5ldmVyeShuID0+IG4uZGVzdGluYXRpb24ubGFiZWxzLmluY2x1ZGVzKHNjaGVtZVJlZmVyZW5jZS5ub2RlTGFiZWwuc3RhZ2UpIHx8IG4uZGVzdGluYXRpb24ubGFiZWxzLmluY2x1ZGVzKHNjaGVtZVJlZmVyZW5jZS5ub2RlTGFiZWwucmVyb3V0ZSkpLFxuICAgIGDigKIgVW5zdXBwb3J0ZWQgcHJvcGVydHkgdmFsdWUgZm9yIGEgTkVYVCBjb25uZWN0aW9uLmAsXG4gICkgLy8gdmVyaWZ5IG5vZGUgdHlwZVxuICByZXR1cm4geyBuZXh0QXJyYXkgfVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0Q29uZmlndXJlKHsgY29uY3JldGVEYXRhYmFzZSwgbm9kZUlEIH0pIHtcbiAgbGV0IGNvbmZpZ3VyZUFycmF5ID0gYXdhaXQgY29uY3JldGVEYXRhYmFzZS5nZXROb2RlQ29ubmVjdGlvbih7IGRpcmVjdGlvbjogJ2luY29taW5nJywgbm9kZUlEOiBub2RlSUQsIGNvbm5lY3Rpb25UeXBlOiBzY2hlbWVSZWZlcmVuY2UuY29ubmVjdGlvblR5cGUuY29uZmlndXJlIH0pXG4gIGFzc2VydChcbiAgICBjb25maWd1cmVBcnJheS5ldmVyeShuID0+IG4uc291cmNlLmxhYmVscy5pbmNsdWRlcyhzY2hlbWVSZWZlcmVuY2Uubm9kZUxhYmVsLmNvbmZpZ3VyYXRpb24pIHx8IG4uc291cmNlLmxhYmVscy5pbmNsdWRlcyhzY2hlbWVSZWZlcmVuY2Uubm9kZUxhYmVsLnJlcm91dGUpKSxcbiAgICBg4oCiIFVuc3VwcG9ydGVkIG5vZGUgdHlwZSBmb3IgYSBDT05GSUdVUkUgY29ubmVjdGlvbi5gLFxuICApIC8vIHZlcmlmeSBub2RlIHR5cGVcbiAgYXNzZXJ0KFxuICAgIGNvbmZpZ3VyZUFycmF5LmV2ZXJ5KG4gPT4gbi5jb25uZWN0aW9uLnByb3BlcnRpZXMuc2V0dGluZyksXG4gICAgYOKAoiBNaXNzaW5nIFwic2V0dGluZ1wiIHByb3BlcnR5IG9uIGEgQ09ORklHVVJFIGNvbm5lY3Rpb24uYCxcbiAgKVxuXG4gIHJldHVybiB7IGNvbmZpZ3VyZUFycmF5IH1cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldENhc2UoeyBjb25jcmV0ZURhdGFiYXNlLCBub2RlSUQgfSkge1xuICBsZXQgY2FzZUFycmF5ID0gYXdhaXQgY29uY3JldGVEYXRhYmFzZS5nZXROb2RlQ29ubmVjdGlvbih7IGRpcmVjdGlvbjogJ291dGdvaW5nJywgbm9kZUlELCBjb25uZWN0aW9uVHlwZTogc2NoZW1lUmVmZXJlbmNlLmNvbm5lY3Rpb25UeXBlLmNhc2UgfSlcbiAgLy8gTm90ZTogbm9kZSB0eXBlIGNvdWxkIGJlIGFueSBub2RlXG4gIHJldHVybiB7IGNhc2VBcnJheSB9XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXRTZWxlY3QoeyBjb25jcmV0ZURhdGFiYXNlLCBub2RlSUQgfSkge1xuICBsZXQgc2VsZWN0QXJyYXkgPSBhd2FpdCBjb25jcmV0ZURhdGFiYXNlLmdldE5vZGVDb25uZWN0aW9uKHsgZGlyZWN0aW9uOiAnb3V0Z29pbmcnLCBub2RlSUQsIGNvbm5lY3Rpb25UeXBlOiBzY2hlbWVSZWZlcmVuY2UuY29ubmVjdGlvblR5cGUuc2VsZWN0IH0pXG4gIC8vIE5vdGU6IG5vZGUgdHlwZSBjb3VsZCBiZSBhbnkgbm9kZVxuICByZXR1cm4geyBzZWxlY3RBcnJheSB9XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXRGYWxsYmFjayh7IGNvbmNyZXRlRGF0YWJhc2UsIG5vZGVJRCB9KSB7XG4gIGxldCBmYWxsYmFja0FycmF5ID0gYXdhaXQgY29uY3JldGVEYXRhYmFzZS5nZXROb2RlQ29ubmVjdGlvbih7IGRpcmVjdGlvbjogJ291dGdvaW5nJywgbm9kZUlELCBjb25uZWN0aW9uVHlwZTogc2NoZW1lUmVmZXJlbmNlLmNvbm5lY3Rpb25UeXBlLmZhbGxiYWNrIH0pXG4gIC8vIE5vdGU6IG5vZGUgdHlwZSBjb3VsZCBiZSBhbnkgbm9kZVxuICByZXR1cm4geyBmYWxsYmFja0FycmF5IH1cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldFJlZmVyZW5jZSh7IGNvbmNyZXRlRGF0YWJhc2UsIG5vZGVJRCB9KSB7XG4gIGxldCByZWZlcmVuY2VBcnJheSA9IGF3YWl0IGNvbmNyZXRlRGF0YWJhc2UuZ2V0Tm9kZUNvbm5lY3Rpb24oeyBkaXJlY3Rpb246ICdvdXRnb2luZycsIG5vZGVJRDogbm9kZUlELCBjb25uZWN0aW9uVHlwZTogc2NoZW1lUmVmZXJlbmNlLmNvbm5lY3Rpb25UeXBlLnJlZmVyZW5jZSB9KVxuICAvLyBUT0RPOiB1c2UgZW50cnlwb2ludCBhcnJheSBmcm9tIFRyYXZlcnNhbENvbmZpZyBjbGFzcy5cbiAgYXNzZXJ0KFxuICAgIHJlZmVyZW5jZUFycmF5LmV2ZXJ5KG4gPT4gbi5kZXN0aW5hdGlvbi5sYWJlbHMuaW5jbHVkZXMoc2NoZW1lUmVmZXJlbmNlLm5vZGVMYWJlbC5zdGFnZSkgfHwgbi5kZXN0aW5hdGlvbi5sYWJlbHMuaW5jbHVkZXMoc2NoZW1lUmVmZXJlbmNlLm5vZGVMYWJlbC5yZXJvdXRlKSksXG4gICAgYOKAoiBVbnN1cHBvcnRlZCBub2RlIHR5cGUgZm9yIGEgJHtzY2hlbWVSZWZlcmVuY2UuY29ubmVjdGlvblR5cGUucmVmZXJlbmNlfSBjb25uZWN0aW9uLmAsXG4gICkgLy8gdmVyaWZ5IG5vZGUgdHlwZVxuICByZXR1cm4geyByZWZlcmVuY2VBcnJheSB9XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXRFeHRlbmQoeyBjb25jcmV0ZURhdGFiYXNlLCBub2RlSUQgfSkge1xuICBsZXQgZXh0ZW5kQXJyYXkgPSBhd2FpdCBjb25jcmV0ZURhdGFiYXNlLmdldE5vZGVDb25uZWN0aW9uKHsgZGlyZWN0aW9uOiAnb3V0Z29pbmcnLCBub2RlSUQ6IG5vZGVJRCwgY29ubmVjdGlvblR5cGU6IHNjaGVtZVJlZmVyZW5jZS5jb25uZWN0aW9uVHlwZS5leHRlbmQgfSlcbiAgYXNzZXJ0KFxuICAgIGV4dGVuZEFycmF5LmV2ZXJ5KG4gPT4gbi5kZXN0aW5hdGlvbi5sYWJlbHMuaW5jbHVkZXMoc2NoZW1lUmVmZXJlbmNlLm5vZGVMYWJlbC5yZXJvdXRlKSksXG4gICAgYOKAoiBVbnN1cHBvcnRlZCBub2RlIHR5cGUgZm9yIGEgRVhURU5EIGNvbm5lY3Rpb24uYCxcbiAgKSAvLyB2ZXJpZnkgbm9kZSB0eXBlXG4gIHJldHVybiB7IGV4dGVuZEFycmF5IH1cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldEluc2VydCh7IGNvbmNyZXRlRGF0YWJhc2UsIG5vZGVJRCB9KSB7XG4gIGxldCBpbnNlcnRBcnJheSA9IGF3YWl0IGNvbmNyZXRlRGF0YWJhc2UuZ2V0Tm9kZUNvbm5lY3Rpb24oeyBkaXJlY3Rpb246ICdpbmNvbWluZycsIG5vZGVJRDogbm9kZUlELCBjb25uZWN0aW9uVHlwZTogc2NoZW1lUmVmZXJlbmNlLmNvbm5lY3Rpb25UeXBlLmluc2VydCB9KVxuICBhc3NlcnQoXG4gICAgaW5zZXJ0QXJyYXkuZXZlcnkobiA9PiBuLnNvdXJjZS5sYWJlbHMuaW5jbHVkZXMoc2NoZW1lUmVmZXJlbmNlLm5vZGVMYWJlbC5zdGFnZSkpLFxuICAgIGDigKIgVW5zdXBwb3J0ZWQgbm9kZSB0eXBlIGZvciBhIElOU0VSVCBjb25uZWN0aW9uLmAsXG4gICkgLy8gdmVyaWZ5IG5vZGUgdHlwZVxuICByZXR1cm4geyBpbnNlcnRBcnJheSB9XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXRTdWJncmFwaCh7IGNvbmNyZXRlRGF0YWJhc2UsIG5vZGVJRCB9KSB7XG4gIGxldCBzdWJncmFwaEFycmF5ID0gYXdhaXQgY29uY3JldGVEYXRhYmFzZS5nZXROb2RlQ29ubmVjdGlvbih7IGRpcmVjdGlvbjogJ2luY29taW5nJywgbm9kZUlEOiBub2RlSUQsIGNvbm5lY3Rpb25UeXBlOiBzY2hlbWVSZWZlcmVuY2UuY29ubmVjdGlvblR5cGUuc3ViZ3JhcGggfSlcbiAgYXNzZXJ0KFxuICAgIHN1YmdyYXBoQXJyYXkuZXZlcnkobiA9PiBuLnNvdXJjZS5sYWJlbHMuaW5jbHVkZXMoc2NoZW1lUmVmZXJlbmNlLm5vZGVMYWJlbC5zdGFnZSkgfHwgbi5zb3VyY2UubGFiZWxzLmluY2x1ZGVzKHNjaGVtZVJlZmVyZW5jZS5ub2RlTGFiZWwucmVyb3V0ZSkpLFxuICAgIGDigKIgVW5zdXBwb3J0ZWQgbm9kZSB0eXBlIGZvciBhIFNVQkdSQVBIIGNvbm5lY3Rpb24uYCxcbiAgKSAvLyB2ZXJpZnkgbm9kZSB0eXBlXG4gIHJldHVybiB7IHN1YmdyYXBoQXJyYXkgfVxufVxuXG4vKlxuICAgICAgXyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF8gICAgICAgICAgIF8gICAgICAgICAgICAgICAgICAgICAgICAgXyAgICAgICAgICAgXG4gICAgIC8gXFwgICBfXyBfICBfXyBfIF8gX18gX19fICBfXyBfICBfXyBffCB8XyBfX18gIF9ffCB8ICAgX18gXyBfICAgXyAgX19fIF8gX18oXykgX19fICBfX18gXG4gICAgLyBfIFxcIC8gX2AgfC8gX2AgfCAnX18vIF8gXFwvIF9gIHwvIF9gIHwgX18vIF8gXFwvIF9gIHwgIC8gX2AgfCB8IHwgfC8gXyBcXCAnX198IHwvIF8gXFwvIF9ffFxuICAgLyBfX18gXFwgKF98IHwgKF98IHwgfCB8ICBfXy8gKF98IHwgKF98IHwgfHwgIF9fLyAoX3wgfCB8IChffCB8IHxffCB8ICBfXy8gfCAgfCB8ICBfXy9cXF9fIFxcXG4gIC9fLyAgIFxcX1xcX18sIHxcXF9fLCB8X3wgIFxcX19ffFxcX18sIHxcXF9fLF98XFxfX1xcX19ffFxcX18sX3wgIFxcX18sIHxcXF9fLF98XFxfX198X3wgIHxffFxcX19ffHxfX18vXG4gICAgICAgICAgfF9fXy8gfF9fXy8gICAgICAgICAgfF9fXy8gICAgICAgICAgICAgICAgICAgICAgICAgIHxffCAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbiovXG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXRSZXJvdXRlVHJhdmVyc2VSZWZlcmVuY2VFbGVtZW50KHsgY29uY3JldGVEYXRhYmFzZSwgbm9kZUlEIH0pIHtcbiAgY29uc3QgeyBleHRlbmRBcnJheSB9ID0gYXdhaXQgZ2V0RXh0ZW5kKHsgY29uY3JldGVEYXRhYmFzZSwgbm9kZUlEIH0pXG4gIGNvbnN0IHsgaW5zZXJ0QXJyYXkgfSA9IGF3YWl0IGdldEluc2VydCh7IGNvbmNyZXRlRGF0YWJhc2UsIG5vZGVJRCB9KVxuXG4gIGlmIChleHRlbmRBcnJheS5sZW5ndGggPiAxKSB0aHJvdyBuZXcgRXJyb3IoYOKAoiBNdWx0aXBsZSBleHRlbmQgcmVsYXRpb25zaGlwcyBhcmUgbm90IHN1cHBvcnRlZCBmb3IgUmVyb3V0ZSBub2RlLmApXG5cbiAgcmV0dXJuIHsgZXh0ZW5kOiBleHRlbmRBcnJheS5sZW5ndGggPiAwID8gZXh0ZW5kQXJyYXlbMF0gOiBudWxsLCBpbnNlcnRBcnJheSB9XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXRSZWZlcmVuY2VSZXNvbHV0aW9uRWxlbWVudCh7IGNvbmNyZXRlRGF0YWJhc2UsIG5vZGVJRCB9KSB7XG4gIGNvbnN0IHsgcmVmZXJlbmNlQXJyYXkgfSA9IGF3YWl0IGdldFJlZmVyZW5jZSh7IGNvbmNyZXRlRGF0YWJhc2UsIG5vZGVJRCB9KVxuXG4gIGlmIChyZWZlcmVuY2VBcnJheS5sZW5ndGggPiAxKSB0aHJvdyBuZXcgRXJyb3IoYOKAoiBNdWx0aXBsZSByZWZlcmVuY2UgcmVsYXRpb25zaGlwcyBhcmUgbm90IHN1cHBvcnRlZCBmb3IgUmVyb3V0ZSBub2RlLmApXG5cbiAgcmV0dXJuIHsgcmVmZXJlbmNlOiByZWZlcmVuY2VBcnJheS5sZW5ndGggPiAwID8gcmVmZXJlbmNlQXJyYXlbMF0gOiBudWxsIH1cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldFNlbGVjdGlvbkVsZW1lbnQoeyBjb25jcmV0ZURhdGFiYXNlLCBub2RlSUQgfSkge1xuICBjb25zdCB7IHNlbGVjdEFycmF5IH0gPSBhd2FpdCBnZXRTZWxlY3QoeyBjb25jcmV0ZURhdGFiYXNlLCBub2RlSUQgfSlcbiAgY29uc3QgeyBmYWxsYmFja0FycmF5IH0gPSBhd2FpdCBnZXRGYWxsYmFjayh7IGNvbmNyZXRlRGF0YWJhc2UsIG5vZGVJRCB9KVxuXG4gIGlmIChmYWxsYmFja0FycmF5Lmxlbmd0aCA+IDEpIHRocm93IG5ldyBFcnJvcihg4oCiIE11bHRpcGxlIFwiZmFsbGJhY2tcIiByZWxhdGlvbnNoaXBzIGFyZSBub3Qgc3VwcG9ydGVkIGZvciBTZWxlY3Rpb24vU3dpdGNoIG5vZGUuYClcblxuICByZXR1cm4geyBzZWxlY3RBcnJheTogc2VsZWN0QXJyYXkubGVuZ3RoID4gMCA/IHNlbGVjdEFycmF5IDogbnVsbCwgZmFsbGJhY2s6IGZhbGxiYWNrQXJyYXkubGVuZ3RoID4gMCA/IGZhbGxiYWNrQXJyYXlbMF0gOiBudWxsIH1cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldENvbmRpdGlvblN3aXRjaEVsZW1lbnQoeyBjb25jcmV0ZURhdGFiYXNlLCBub2RlSUQgfSkge1xuICBjb25zdCB7IGNhc2VBcnJheSB9ID0gYXdhaXQgZ2V0Q2FzZSh7IGNvbmNyZXRlRGF0YWJhc2UsIG5vZGVJRCB9KVxuXG4gIHJldHVybiB7IGNhc2VBcnJheTogY2FzZUFycmF5Lmxlbmd0aCA+IDAgPyBjYXNlQXJyYXkgOiBudWxsIH1cbn1cblxuLy8gVmFsdWUgY29ubmVjdGlvbiBjb25jZXB0IGltcGxlbWVudGF0aW9uXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0VmFsdWVFbGVtZW50KHsgY29uY3JldGVEYXRhYmFzZSwgbm9kZUlEIH0pIHtcbiAgLy8gZ2V0IFZBTFVFIGNvbm5lY3Rpb25cbiAgbGV0IHZhbHVlXG4gIGNvbnN0IHsgdmFsdWVBcnJheSB9ID0gYXdhaXQgZ2V0VmFsdWUoeyBjb25jcmV0ZURhdGFiYXNlLCBub2RlSUQgfSlcbiAgaWYgKHZhbHVlQXJyYXkubGVuZ3RoID4gMSkgdGhyb3cgbmV3IEVycm9yKGDigKIgTXVsdGlwbGUgVkFMVUUgcmVsYXRpb25zaGlwcyBhcmUgbm90IHN1cHBvcnRlZCBmb3IgUHJvY2VzcyBub2RlLmApXG4gIGVsc2UgaWYgKHZhbHVlQXJyYXkubGVuZ3RoICE9IDAgJiYgdmFsdWVBcnJheVswXSkgcmV0dXJuIHZhbHVlQXJyYXlbMF1cbn1cbiJdfQ==
"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.functionProperty = exports.forkProperty = exports.caseProperty = exports.resourceProperty = exports.valueProperty = exports.referenceProperty = exports.rerouteProperty = exports.traversalOption = exports.evaluationOption = exports.connectionType = exports.nodeLabel = void 0;const nodeLabel = {
  stage: 'Stage',
  port: 'Port',
  process: 'Process',
  configuration: 'Configuration',
  file: 'File',
  function: 'Function',
  reroute: 'Reroute' };exports.nodeLabel = nodeLabel;






const connectionType = {

  reference: 'REFERENCE',
  insert: 'INSERT',
  extend: 'EXTEND',

  next: 'NEXT',
  fork: 'FORK',

  configure: 'CONFIGURE',

  execute: 'EXECUTE',
  pipe: 'PIPE',
  resource: 'RESOURCE',
  value: 'VALUE',
  fallback: 'FALLBACK',
  select: 'SELECT',
  case: 'CASE',
  subgraph: 'SUBGRAPH' };exports.connectionType = connectionType;





const evaluationOption = {
  propagation: {

    continue: 'continue',
    break: 'break',
    hult: 'hult' },

  aggregation: {

    include: 'process&include',
    exclude: 'process&exclude',
    skip: 'skipProcess' } };exports.evaluationOption = evaluationOption;



const traversalOption = ['processNode', 'portNode', 'aggregator', 'traversalInterception'];exports.traversalOption = traversalOption;

const rerouteProperty = {
  externalReferenceNodeKey: 'externalReferenceNodeKey' };exports.rerouteProperty = rerouteProperty;


const referenceProperty = {
  resolutionImplementation: ['selection', 'node'] };exports.referenceProperty = referenceProperty;


const valueProperty = {
  type: ['conditionSubgraph', 'properties', 'node', 'valueProperty'] };exports.valueProperty = valueProperty;


const resourceProperty = {
  context: ['applicationReference', 'filesystemReference'] };exports.resourceProperty = resourceProperty;


const caseProperty = ['expected'];exports.caseProperty = caseProperty;

const forkProperty = { handlePropagationImplementation: ['chronological', 'raceFirstPromise', 'allPromise'] };exports.forkProperty = forkProperty;

const functionProperty = ['functionName'];exports.functionProperty = functionProperty;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NvdXJjZS9kYXRhTW9kZWwvZ3JhcGhTY2hlbWVSZWZlcmVuY2UuanMiXSwibmFtZXMiOlsibm9kZUxhYmVsIiwic3RhZ2UiLCJwb3J0IiwicHJvY2VzcyIsImNvbmZpZ3VyYXRpb24iLCJmaWxlIiwiZnVuY3Rpb24iLCJyZXJvdXRlIiwiY29ubmVjdGlvblR5cGUiLCJyZWZlcmVuY2UiLCJpbnNlcnQiLCJleHRlbmQiLCJuZXh0IiwiZm9yayIsImNvbmZpZ3VyZSIsImV4ZWN1dGUiLCJwaXBlIiwicmVzb3VyY2UiLCJ2YWx1ZSIsImZhbGxiYWNrIiwic2VsZWN0IiwiY2FzZSIsInN1YmdyYXBoIiwiZXZhbHVhdGlvbk9wdGlvbiIsInByb3BhZ2F0aW9uIiwiY29udGludWUiLCJicmVhayIsImh1bHQiLCJhZ2dyZWdhdGlvbiIsImluY2x1ZGUiLCJleGNsdWRlIiwic2tpcCIsInRyYXZlcnNhbE9wdGlvbiIsInJlcm91dGVQcm9wZXJ0eSIsImV4dGVybmFsUmVmZXJlbmNlTm9kZUtleSIsInJlZmVyZW5jZVByb3BlcnR5IiwicmVzb2x1dGlvbkltcGxlbWVudGF0aW9uIiwidmFsdWVQcm9wZXJ0eSIsInR5cGUiLCJyZXNvdXJjZVByb3BlcnR5IiwiY29udGV4dCIsImNhc2VQcm9wZXJ0eSIsImZvcmtQcm9wZXJ0eSIsImhhbmRsZVByb3BhZ2F0aW9uSW1wbGVtZW50YXRpb24iLCJmdW5jdGlvblByb3BlcnR5Il0sIm1hcHBpbmdzIjoic1dBQU8sTUFBTUEsU0FBUyxHQUFHO0FBQ3ZCQyxFQUFBQSxLQUFLLEVBQUUsT0FEZ0I7QUFFdkJDLEVBQUFBLElBQUksRUFBRSxNQUZpQjtBQUd2QkMsRUFBQUEsT0FBTyxFQUFFLFNBSGM7QUFJdkJDLEVBQUFBLGFBQWEsRUFBRSxlQUpRO0FBS3ZCQyxFQUFBQSxJQUFJLEVBQUUsTUFMaUI7QUFNdkJDLEVBQUFBLFFBQVEsRUFBRSxVQU5hO0FBT3ZCQyxFQUFBQSxPQUFPLEVBQUUsU0FQYyxFQUFsQixDOzs7Ozs7O0FBY0EsTUFBTUMsY0FBYyxHQUFHOztBQUU1QkMsRUFBQUEsU0FBUyxFQUFFLFdBRmlCO0FBRzVCQyxFQUFBQSxNQUFNLEVBQUUsUUFIb0I7QUFJNUJDLEVBQUFBLE1BQU0sRUFBRSxRQUpvQjs7QUFNNUJDLEVBQUFBLElBQUksRUFBRSxNQU5zQjtBQU81QkMsRUFBQUEsSUFBSSxFQUFFLE1BUHNCOztBQVM1QkMsRUFBQUEsU0FBUyxFQUFFLFdBVGlCOztBQVc1QkMsRUFBQUEsT0FBTyxFQUFFLFNBWG1CO0FBWTVCQyxFQUFBQSxJQUFJLEVBQUUsTUFac0I7QUFhNUJDLEVBQUFBLFFBQVEsRUFBRSxVQWJrQjtBQWM1QkMsRUFBQUEsS0FBSyxFQUFFLE9BZHFCO0FBZTVCQyxFQUFBQSxRQUFRLEVBQUUsVUFma0I7QUFnQjVCQyxFQUFBQSxNQUFNLEVBQUUsUUFoQm9CO0FBaUI1QkMsRUFBQUEsSUFBSSxFQUFFLE1BakJzQjtBQWtCNUJDLEVBQUFBLFFBQVEsRUFBRSxVQWxCa0IsRUFBdkIsQzs7Ozs7O0FBd0JBLE1BQU1DLGdCQUFnQixHQUFHO0FBQzlCQyxFQUFBQSxXQUFXLEVBQUU7O0FBRVhDLElBQUFBLFFBQVEsRUFBRSxVQUZDO0FBR1hDLElBQUFBLEtBQUssRUFBRSxPQUhJO0FBSVhDLElBQUFBLElBQUksRUFBRSxNQUpLLEVBRGlCOztBQU85QkMsRUFBQUEsV0FBVyxFQUFFOztBQUVYQyxJQUFBQSxPQUFPLEVBQUUsaUJBRkU7QUFHWEMsSUFBQUEsT0FBTyxFQUFFLGlCQUhFO0FBSVhDLElBQUFBLElBQUksRUFBRSxhQUpLLEVBUGlCLEVBQXpCLEM7Ozs7QUFlQSxNQUFNQyxlQUFlLEdBQUcsQ0FBQyxhQUFELEVBQWdCLFVBQWhCLEVBQTRCLFlBQTVCLEVBQTBDLHVCQUExQyxDQUF4QixDOztBQUVBLE1BQU1DLGVBQWUsR0FBRztBQUM3QkMsRUFBQUEsd0JBQXdCLEVBQUUsMEJBREcsRUFBeEIsQzs7O0FBSUEsTUFBTUMsaUJBQWlCLEdBQUc7QUFDL0JDLEVBQUFBLHdCQUF3QixFQUFFLENBQUMsV0FBRCxFQUFjLE1BQWQsQ0FESyxFQUExQixDOzs7QUFJQSxNQUFNQyxhQUFhLEdBQUc7QUFDM0JDLEVBQUFBLElBQUksRUFBRSxDQUFDLG1CQUFELEVBQXNCLFlBQXRCLEVBQW9DLE1BQXBDLEVBQTRDLGVBQTVDLENBRHFCLEVBQXRCLEM7OztBQUlBLE1BQU1DLGdCQUFnQixHQUFHO0FBQzlCQyxFQUFBQSxPQUFPLEVBQUUsQ0FBQyxzQkFBRCxFQUF5QixxQkFBekIsQ0FEcUIsRUFBekIsQzs7O0FBSUEsTUFBTUMsWUFBWSxHQUFHLENBQUMsVUFBRCxDQUFyQixDOztBQUVBLE1BQU1DLFlBQVksR0FBRyxFQUFFQywrQkFBK0IsRUFBRSxDQUFDLGVBQUQsRUFBa0Isa0JBQWxCLEVBQXNDLFlBQXRDLENBQW5DLEVBQXJCLEM7O0FBRUEsTUFBTUMsZ0JBQWdCLEdBQUcsQ0FBQyxjQUFELENBQXpCLEMiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgY29uc3Qgbm9kZUxhYmVsID0ge1xuICBzdGFnZTogJ1N0YWdlJyxcbiAgcG9ydDogJ1BvcnQnLFxuICBwcm9jZXNzOiAnUHJvY2VzcycsXG4gIGNvbmZpZ3VyYXRpb246ICdDb25maWd1cmF0aW9uJyxcbiAgZmlsZTogJ0ZpbGUnLFxuICBmdW5jdGlvbjogJ0Z1bmN0aW9uJyxcbiAgcmVyb3V0ZTogJ1Jlcm91dGUnLCAvLyBwcmV2aW91c2x5IG5hbWVkIHN1YmdyYXBoVGVtcGxhdGU6ICdTdWJncmFwaFRlbXBsYXRlJyxcbiAgLy8gZXZhbHVhdGlvbjogJ0V2YWx1YXRpb24nLFxuICAvLyBub2RlUmVmZXJlbmNlOiAnTm9kZVJlZmVyZW5jZScsXG4gIC8vIHN3aXRjaDogJ1N3aXRjaCcsXG4gIC8vIHN3aXRjaEJvb2xlYW46ICdTd2l0Y2hCb29sZWFuJyxcbn1cblxuZXhwb3J0IGNvbnN0IGNvbm5lY3Rpb25UeXBlID0ge1xuICAvLyBSZXJvdXRlXG4gIHJlZmVyZW5jZTogJ1JFRkVSRU5DRScsXG4gIGluc2VydDogJ0lOU0VSVCcsXG4gIGV4dGVuZDogJ0VYVEVORCcsXG4gIC8vIFN0YWdlXG4gIG5leHQ6ICdORVhUJyxcbiAgZm9yazogJ0ZPUksnLFxuICAvL1RPRE86IGltcGxlbWVudCBgZGVwdGhBZmZlY3RlZGAgcHJvcGVydHkgZm9yIENPTkZJR1VSRSBjb25uZWN0aW9uXG4gIGNvbmZpZ3VyZTogJ0NPTkZJR1VSRScsXG4gIC8vIFByb2Nlc3MgJiBFdmFsdWF0aW9uXG4gIGV4ZWN1dGU6ICdFWEVDVVRFJyxcbiAgcGlwZTogJ1BJUEUnLFxuICByZXNvdXJjZTogJ1JFU09VUkNFJyxcbiAgdmFsdWU6ICdWQUxVRScsIC8vIHt0eXBlOiAnbm9kZScgfHwgJ3Byb3BlcnRpZXMnfSBpLmUuIHJldHVybiB0aGUgbm9kZSByZWZlcmVuY2Ugb3IgcmV0dXJuIGl0cyBwcm9wZXJ0aWVzLlxuICBmYWxsYmFjazogJ0ZBTExCQUNLJyxcbiAgc2VsZWN0OiAnU0VMRUNUJyxcbiAgY2FzZTogJ0NBU0UnLFxuICBzdWJncmFwaDogJ1NVQkdSQVBIJywgLy8gc3ViZ3JhcGhzIHVzZWQgZm9yIHNlY29uZGFyeSB0cmF2ZXJzYWxzLlxuICAvLyByb290OiAnUk9PVCcsXG4gIC8vIHJ1bjogJ1JVTicsIC8vIHJ1biBhcyBzdWJncmFwaCB3aGVyZSB0aGUgcmVzdWx0IG9mIHRoZSBzdWJncmFwaCB0cmF2ZXJzYWwgaXMgdG8gYmUgdXNlZCBpbiB0aGUgc3RhZ2Ugbm9kZSBjYWxsaW5nIGl0LlxuICAvLyBpbmhlcml0OiAnSU5IRVJJVCcsXG59XG5cbmV4cG9ydCBjb25zdCBldmFsdWF0aW9uT3B0aW9uID0ge1xuICBwcm9wYWdhdGlvbjoge1xuICAgIC8vIHRyYXZlcnNlIG5laWdoYm91cnMgb3Igbm90LlxuICAgIGNvbnRpbnVlOiAnY29udGludWUnLCAvLyBjb250aW51ZSB0cmF2ZXJzYWwgb2YgY2hpbGQgbm9kZXNcbiAgICBicmVhazogJ2JyZWFrJywgLy8gZG8gbm90IHRyYXZlcnNlIHN1YnByb2Nlc3NcbiAgICBodWx0OiAnaHVsdCcsIC8vIGh1bHQgdHJhdmVyc2FsIGFsbCB0b2dldGhlciBhbmQgcmV0dXJuLlxuICB9LFxuICBhZ2dyZWdhdGlvbjoge1xuICAgIC8vIGV4ZWN1dGUgJiBpbmNsdWRlIG9yIGRvbid0IGV4ZWN1dGUgJiBleGNsdWRlIGZyb20gYWdncmVnYXRlZCByZXN1bHRzLlxuICAgIGluY2x1ZGU6ICdwcm9jZXNzJmluY2x1ZGUnLFxuICAgIGV4Y2x1ZGU6ICdwcm9jZXNzJmV4Y2x1ZGUnLFxuICAgIHNraXA6ICdza2lwUHJvY2VzcycsXG4gIH0sXG59XG5cbmV4cG9ydCBjb25zdCB0cmF2ZXJzYWxPcHRpb24gPSBbJ3Byb2Nlc3NOb2RlJywgJ3BvcnROb2RlJywgJ2FnZ3JlZ2F0b3InLCAndHJhdmVyc2FsSW50ZXJjZXB0aW9uJ11cblxuZXhwb3J0IGNvbnN0IHJlcm91dGVQcm9wZXJ0eSA9IHtcbiAgZXh0ZXJuYWxSZWZlcmVuY2VOb2RlS2V5OiAnZXh0ZXJuYWxSZWZlcmVuY2VOb2RlS2V5Jyxcbn1cblxuZXhwb3J0IGNvbnN0IHJlZmVyZW5jZVByb3BlcnR5ID0ge1xuICByZXNvbHV0aW9uSW1wbGVtZW50YXRpb246IFsnc2VsZWN0aW9uJywgJ25vZGUnXSxcbn1cblxuZXhwb3J0IGNvbnN0IHZhbHVlUHJvcGVydHkgPSB7XG4gIHR5cGU6IFsnY29uZGl0aW9uU3ViZ3JhcGgnLCAncHJvcGVydGllcycsICdub2RlJywgJ3ZhbHVlUHJvcGVydHknXSxcbn1cblxuZXhwb3J0IGNvbnN0IHJlc291cmNlUHJvcGVydHkgPSB7XG4gIGNvbnRleHQ6IFsnYXBwbGljYXRpb25SZWZlcmVuY2UnLCAnZmlsZXN5c3RlbVJlZmVyZW5jZSddLFxufVxuXG5leHBvcnQgY29uc3QgY2FzZVByb3BlcnR5ID0gWydleHBlY3RlZCddXG5cbmV4cG9ydCBjb25zdCBmb3JrUHJvcGVydHkgPSB7IGhhbmRsZVByb3BhZ2F0aW9uSW1wbGVtZW50YXRpb246IFsnY2hyb25vbG9naWNhbCcsICdyYWNlRmlyc3RQcm9taXNlJywgJ2FsbFByb21pc2UnXSB9XG5cbmV4cG9ydCBjb25zdCBmdW5jdGlvblByb3BlcnR5ID0gWydmdW5jdGlvbk5hbWUnXVxuIl19
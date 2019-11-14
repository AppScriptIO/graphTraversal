"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.entityPrototype = exports.Prototype = exports.Reference = exports.Traversal = void 0;
var _entity = require("@dependency/entity");
var _ImplementationManagementClass = require("./ImplementationManagement.class.js");
var _multiplePrototypeDelegation = require("@dependency/multiplePrototypeDelegation");










const { class: Traversal, reference: Reference, constructablePrototype: Prototype, entityPrototype } = new _ImplementationManagementClass.ImplementationManagement.clientInterface({ description: 'Traversal' });exports.entityPrototype = entityPrototype;exports.Prototype = Prototype;exports.Reference = Reference;exports.Traversal = Traversal;









Object.assign(Reference, {
  key: {} });










Object.assign(entityPrototype, {

  [_entity.Entity.reference.key.concereteBehavior]({ constructorCallback, currentConcereteBehavior }) {
    return new Proxy(constructorCallback, {
      apply(target, thisArg, [{ data }]) {
        let instance = Reflect.apply(...arguments);
        _multiplePrototypeDelegation.MultipleDelegation.addDelegation({ targetObject: instance, delegationList: [currentConcereteBehavior] });
        return instance;
      } });

  } });









Traversal[_entity.Constructable.reference.initialize.functionality].setter.call(Traversal, {});








Traversal.clientInterface = Prototype[_entity.Constructable.reference.clientInterface.functionality].switch.call(Traversal, {
  implementationKey: _entity.Entity.reference.key.instanceDelegatingToEntityInstancePrototype })(
{
  constructorImplementation: _entity.Entity.reference.key.handleDataInstance });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NvdXJjZS9jb25zdHJ1Y3RhYmxlL1RyYXZlcnNhbC5jbGFzcy5qcyJdLCJuYW1lcyI6WyJjbGFzcyIsIlRyYXZlcnNhbCIsInJlZmVyZW5jZSIsIlJlZmVyZW5jZSIsImNvbnN0cnVjdGFibGVQcm90b3R5cGUiLCJQcm90b3R5cGUiLCJlbnRpdHlQcm90b3R5cGUiLCJJbXBsZW1lbnRhdGlvbk1hbmFnZW1lbnQiLCJjbGllbnRJbnRlcmZhY2UiLCJkZXNjcmlwdGlvbiIsIk9iamVjdCIsImFzc2lnbiIsImtleSIsIkVudGl0eSIsImNvbmNlcmV0ZUJlaGF2aW9yIiwiY29uc3RydWN0b3JDYWxsYmFjayIsImN1cnJlbnRDb25jZXJldGVCZWhhdmlvciIsIlByb3h5IiwiYXBwbHkiLCJ0YXJnZXQiLCJ0aGlzQXJnIiwiZGF0YSIsImluc3RhbmNlIiwiUmVmbGVjdCIsImFyZ3VtZW50cyIsIk11bHRpcGxlRGVsZWdhdGlvbiIsImFkZERlbGVnYXRpb24iLCJ0YXJnZXRPYmplY3QiLCJkZWxlZ2F0aW9uTGlzdCIsIkNvbnN0cnVjdGFibGUiLCJpbml0aWFsaXplIiwiZnVuY3Rpb25hbGl0eSIsInNldHRlciIsInN3aXRjaCIsImltcGxlbWVudGF0aW9uS2V5IiwiaW5zdGFuY2VEZWxlZ2F0aW5nVG9FbnRpdHlJbnN0YW5jZVByb3RvdHlwZSIsImNvbnN0cnVjdG9ySW1wbGVtZW50YXRpb24iLCJoYW5kbGVEYXRhSW5zdGFuY2UiXSwibWFwcGluZ3MiOiI7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7O0FBV08sTUFBTSxFQUFFQSxLQUFLLEVBQUVDLFNBQVQsRUFBb0JDLFNBQVMsRUFBRUMsU0FBL0IsRUFBMENDLHNCQUFzQixFQUFFQyxTQUFsRSxFQUE2RUMsZUFBN0UsS0FBaUcsSUFBSUMsd0RBQXlCQyxlQUE3QixDQUE2QyxFQUFFQyxXQUFXLEVBQUUsV0FBZixFQUE3QyxDQUF2RyxDOzs7Ozs7Ozs7O0FBVVBDLE1BQU0sQ0FBQ0MsTUFBUCxDQUFjUixTQUFkLEVBQXlCO0FBQ3ZCUyxFQUFBQSxHQUFHLEVBQUUsRUFEa0IsRUFBekI7Ozs7Ozs7Ozs7O0FBWUFGLE1BQU0sQ0FBQ0MsTUFBUCxDQUFjTCxlQUFkLEVBQStCOztBQUU3QixHQUFDTyxlQUFPWCxTQUFQLENBQWlCVSxHQUFqQixDQUFxQkUsaUJBQXRCLEVBQXlDLEVBQUVDLG1CQUFGLEVBQXVCQyx3QkFBdkIsRUFBekMsRUFBNEY7QUFDMUYsV0FBTyxJQUFJQyxLQUFKLENBQVVGLG1CQUFWLEVBQStCO0FBQ3BDRyxNQUFBQSxLQUFLLENBQUNDLE1BQUQsRUFBU0MsT0FBVCxFQUFrQixDQUFDLEVBQUVDLElBQUYsRUFBRCxDQUFsQixFQUE4QjtBQUNqQyxZQUFJQyxRQUFRLEdBQUdDLE9BQU8sQ0FBQ0wsS0FBUixDQUFjLEdBQUdNLFNBQWpCLENBQWY7QUFDQUMsd0RBQW1CQyxhQUFuQixDQUFpQyxFQUFFQyxZQUFZLEVBQUVMLFFBQWhCLEVBQTBCTSxjQUFjLEVBQUUsQ0FBQ1osd0JBQUQsQ0FBMUMsRUFBakM7QUFDQSxlQUFPTSxRQUFQO0FBQ0QsT0FMbUMsRUFBL0IsQ0FBUDs7QUFPRCxHQVY0QixFQUEvQjs7Ozs7Ozs7OztBQW9CV3JCLFNBQVMsQ0FBQzRCLHNCQUFjM0IsU0FBZCxDQUF3QjRCLFVBQXhCLENBQW1DQyxhQUFwQyxDQUFULENBQTREQyxNQUF2RSxNQUFBL0IsU0FBUyxFQUFxRSxFQUFyRSxDQUFUOzs7Ozs7Ozs7QUFTQUEsU0FBUyxDQUFDTyxlQUFWLEdBQXVDSCxTQUFTLENBQUN3QixzQkFBYzNCLFNBQWQsQ0FBd0JNLGVBQXhCLENBQXdDdUIsYUFBekMsQ0FBVCxDQUFpRUUsTUFBNUUsTUFBQWhDLFNBQVMsRUFBMEU7QUFDN0dpQyxFQUFBQSxpQkFBaUIsRUFBRXJCLGVBQU9YLFNBQVAsQ0FBaUJVLEdBQWpCLENBQXFCdUIsMkNBRHFFLEVBQTFFLENBQVQ7QUFFekI7QUFDREMsRUFBQUEseUJBQXlCLEVBQUV2QixlQUFPWCxTQUFQLENBQWlCVSxHQUFqQixDQUFxQnlCLGtCQUQvQyxFQUZ5QixDQUE1QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBhc3NlcnQgZnJvbSAnYXNzZXJ0J1xyXG5pbXBvcnQgeyBFbnRpdHksIENvbnN0cnVjdGFibGUsIHN5bWJvbCB9IGZyb20gJ0BkZXBlbmRlbmN5L2VudGl0eSdcclxuaW1wb3J0IHsgSW1wbGVtZW50YXRpb25NYW5hZ2VtZW50IH0gZnJvbSAnLi9JbXBsZW1lbnRhdGlvbk1hbmFnZW1lbnQuY2xhc3MuanMnXHJcbmltcG9ydCB7IE11bHRpcGxlRGVsZWdhdGlvbiB9IGZyb20gJ0BkZXBlbmRlbmN5L211bHRpcGxlUHJvdG90eXBlRGVsZWdhdGlvbidcclxuaW1wb3J0IHsgcHJveGlmeU1ldGhvZERlY29yYXRvciB9IGZyb20gJy4uL3V0aWxpdHkvcHJveGlmeU1ldGhvZERlY29yYXRvci5qcydcclxuXHJcbmludGVyZmFjZSBUcmF2ZXJzYWxJbXBsZW1lbnRhdGlvbiB7XHJcbiAgLy8gVXNhZ2Ugb2YgYXN5bmMgZ2VuZXJhdG9ycyB3aWxsIHByZXZlbnQgaGFuZGluZyB0aGUgY29udHJvbCB0byBjYWxsZWQgZnVuY3Rpb24gKGFnYWluc3QgYFJ1bi10by1jb21wbGV0ZWAgcHJpbmNpcGxlKSwgYW5kIHdpbGwgYWxsb3cgaW50ZXJjZXB0aW4gdGhlIGV4ZWN1dGlvbiBtaWQgd2F5LlxyXG4gIHRyYXZlcnNlR3JhcGg6IEZ1bmN0aW9uO1xyXG59XHJcblxyXG4vKipcclxuICoqIFRyYXZlcnNhbCBzeXN0ZW0gZm9yIHN1cHBvcnRpbmcgZGlmZmVyZW50IGdyYXBoIGltcGxlbWVudGF0aW9uIChjb25jcmV0ZSBiZWhhdmlvciBvZiBwbHVnaW4gdGhhdCB3aWxsIGJlIHVzZWQgaW4gdGhlIGNsaWVudCB0YXJnZXQpLlxyXG4gKi9cclxuZXhwb3J0IGNvbnN0IHsgY2xhc3M6IFRyYXZlcnNhbCwgcmVmZXJlbmNlOiBSZWZlcmVuY2UsIGNvbnN0cnVjdGFibGVQcm90b3R5cGU6IFByb3RvdHlwZSwgZW50aXR5UHJvdG90eXBlIH0gPSBuZXcgSW1wbGVtZW50YXRpb25NYW5hZ2VtZW50LmNsaWVudEludGVyZmFjZSh7IGRlc2NyaXB0aW9uOiAnVHJhdmVyc2FsJyB9KVxyXG5cclxuLypcclxuICAgX19fXyAgICAgICBfXyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9fXyAgICAgX19fXyAgICAgICAgICAgIF8gICAgICAgIF8gICAgICAgICAgICAgICAgICAgIFxyXG4gIHwgIF8gXFwgX19fIC8gX3wgX19fIF8gX18gX19fIF8gX18gICBfX18gX19fICAgKCBfICkgICB8ICBfIFxcIF8gX18gX19fIHwgfF8gX19fIHwgfF8gXyAgIF8gXyBfXyAgIF9fXyBcclxuICB8IHxfKSAvIF8gXFwgfF8gLyBfIFxcICdfXy8gXyBcXCAnXyBcXCAvIF9fLyBfIFxcICAvIF8gXFwvXFwgfCB8XykgfCAnX18vIF8gXFx8IF9fLyBfIFxcfCBfX3wgfCB8IHwgJ18gXFwgLyBfIFxcXHJcbiAgfCAgXyA8ICBfXy8gIF98ICBfXy8gfCB8ICBfXy8gfCB8IHwgKF98ICBfXy8gfCAoXz4gIDwgfCAgX18vfCB8IHwgKF8pIHwgfHwgKF8pIHwgfF98IHxffCB8IHxfKSB8ICBfXy9cclxuICB8X3wgXFxfXFxfX198X3wgIFxcX19ffF98ICBcXF9fX3xffCB8X3xcXF9fX1xcX19ffCAgXFxfX18vXFwvIHxffCAgIHxffCAgXFxfX18vIFxcX19cXF9fXy8gXFxfX3xcXF9fLCB8IC5fXy8gXFxfX198XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfF9fXy98X3wgICAgICAgICBcclxuKi9cclxuT2JqZWN0LmFzc2lnbihSZWZlcmVuY2UsIHtcclxuICBrZXk6IHt9LFxyXG59KVxyXG5cclxuLypcclxuICAgICAgICAgICAgICAgICAgIF8gICAgICAgIF8gICAgICAgICAgICAgICAgICAgIF9fX18gICAgICAgXyAgICAgICAgICAgICAgICAgIF8gICBfICAgICAgICAgICAgIFxyXG4gICBfIF9fICBfIF9fIF9fXyB8IHxfIF9fXyB8IHxfIF8gICBfIF8gX18gICBfX198ICBfIFxcICBfX198IHwgX19fICBfXyBfICBfXyBffCB8XyhfKSBfX18gIF8gX18gIFxyXG4gIHwgJ18gXFx8ICdfXy8gXyBcXHwgX18vIF8gXFx8IF9ffCB8IHwgfCAnXyBcXCAvIF8gXFwgfCB8IHwvIF8gXFwgfC8gXyBcXC8gX2AgfC8gX2AgfCBfX3wgfC8gXyBcXHwgJ18gXFwgXHJcbiAgfCB8XykgfCB8IHwgKF8pIHwgfHwgKF8pIHwgfF98IHxffCB8IHxfKSB8ICBfXy8gfF98IHwgIF9fLyB8ICBfXy8gKF98IHwgKF98IHwgfF98IHwgKF8pIHwgfCB8IHxcclxuICB8IC5fXy98X3wgIFxcX19fLyBcXF9fXFxfX18vIFxcX198XFxfXywgfCAuX18vIFxcX19ffF9fX18vIFxcX19ffF98XFxfX198XFxfXywgfFxcX18sX3xcXF9ffF98XFxfX18vfF98IHxffFxyXG4gIHxffCAgICAgICAgICAgICAgICAgICAgICAgICAgIHxfX18vfF98ICAgICAgICAgICAgICAgICAgICAgICAgICAgfF9fXy8gICAgICAgICAgICAgICAgICAgICAgICAgXHJcbiovXHJcbk9iamVjdC5hc3NpZ24oZW50aXR5UHJvdG90eXBlLCB7XHJcbiAgLy8gIGNvbmNlcmV0ZSBiZWhhdmlvciBpbml0aWFsaXphdGlvbiBvbiB0aGUgdGFyZ2V0IGluc3RhbmNlLlxyXG4gIFtFbnRpdHkucmVmZXJlbmNlLmtleS5jb25jZXJldGVCZWhhdmlvcl0oeyBjb25zdHJ1Y3RvckNhbGxiYWNrLCBjdXJyZW50Q29uY2VyZXRlQmVoYXZpb3IgfSkge1xyXG4gICAgcmV0dXJuIG5ldyBQcm94eShjb25zdHJ1Y3RvckNhbGxiYWNrLCB7XHJcbiAgICAgIGFwcGx5KHRhcmdldCwgdGhpc0FyZywgW3sgZGF0YSB9XSkge1xyXG4gICAgICAgIGxldCBpbnN0YW5jZSA9IFJlZmxlY3QuYXBwbHkoLi4uYXJndW1lbnRzKVxyXG4gICAgICAgIE11bHRpcGxlRGVsZWdhdGlvbi5hZGREZWxlZ2F0aW9uKHsgdGFyZ2V0T2JqZWN0OiBpbnN0YW5jZSwgZGVsZWdhdGlvbkxpc3Q6IFtjdXJyZW50Q29uY2VyZXRlQmVoYXZpb3JdIH0pXHJcbiAgICAgICAgcmV0dXJuIGluc3RhbmNlXHJcbiAgICAgIH0sXHJcbiAgICB9KVxyXG4gIH0sXHJcbn0pXHJcblxyXG4vKlxyXG4gICBfX18gICAgICAgXyBfICAgXyAgICAgICBfIF8gICAgICAgICBcclxuICB8XyBffF8gX18gKF8pIHxfKF8pIF9fIF98IChfKV9fX19fX18gXHJcbiAgIHwgfHwgJ18gXFx8IHwgX198IHwvIF9gIHwgfCB8XyAgLyBfIFxcXHJcbiAgIHwgfHwgfCB8IHwgfCB8X3wgfCAoX3wgfCB8IHwvIC8gIF9fL1xyXG4gIHxfX198X3wgfF98X3xcXF9ffF98XFxfXyxffF98Xy9fX19cXF9fX3xcclxuKi9cclxuVHJhdmVyc2FsOjpUcmF2ZXJzYWxbQ29uc3RydWN0YWJsZS5yZWZlcmVuY2UuaW5pdGlhbGl6ZS5mdW5jdGlvbmFsaXR5XS5zZXR0ZXIoe30pXHJcblxyXG4vKlxyXG4gICAgX19fXyBfIF8gICAgICAgICAgICBfICAgICBfIF8gICAgICAgICAgICAgICAgICAgIF9fICAgICAgICAgICAgICAgIFxyXG4gICAvIF9fX3wgKF8pIF9fXyBfIF9fIHwgfF8gIChfKSB8XyBfIF9fICAgX19fIF8gX18gLyBffCBfXyBfICBfX18gX19fIFxyXG4gIHwgfCAgIHwgfCB8LyBfIFxcICdfIFxcfCBfX3wgfCB8IF9ffCAnXyBcXCAvIF8gXFwgJ19ffCB8XyAvIF9gIHwvIF9fLyBfIFxcXHJcbiAgfCB8X19ffCB8IHwgIF9fLyB8IHwgfCB8XyAgfCB8IHxffCB8IHwgfCAgX18vIHwgIHwgIF98IChffCB8IChffCAgX18vXHJcbiAgIFxcX19fX3xffF98XFxfX198X3wgfF98XFxfX3wgfF98XFxfX3xffCB8X3xcXF9fX3xffCAgfF98ICBcXF9fLF98XFxfX19cXF9fX3xcclxuKi9cclxuVHJhdmVyc2FsLmNsaWVudEludGVyZmFjZSA9IFRyYXZlcnNhbDo6UHJvdG90eXBlW0NvbnN0cnVjdGFibGUucmVmZXJlbmNlLmNsaWVudEludGVyZmFjZS5mdW5jdGlvbmFsaXR5XS5zd2l0Y2goe1xyXG4gIGltcGxlbWVudGF0aW9uS2V5OiBFbnRpdHkucmVmZXJlbmNlLmtleS5pbnN0YW5jZURlbGVnYXRpbmdUb0VudGl0eUluc3RhbmNlUHJvdG90eXBlLFxyXG59KSh7XHJcbiAgY29uc3RydWN0b3JJbXBsZW1lbnRhdGlvbjogRW50aXR5LnJlZmVyZW5jZS5rZXkuaGFuZGxlRGF0YUluc3RhbmNlLFxyXG59KVxyXG4iXX0=
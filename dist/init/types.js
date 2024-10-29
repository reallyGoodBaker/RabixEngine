export var ParameterType;
(function (ParameterType) {
    ParameterType[ParameterType["Component"] = 0] = "Component";
    ParameterType[ParameterType["Query"] = 1] = "Query";
    ParameterType[ParameterType["Option"] = 2] = "Option";
})(ParameterType || (ParameterType = {}));
export var QueryFilterType;
(function (QueryFilterType) {
    QueryFilterType[QueryFilterType["With"] = 0] = "With";
    QueryFilterType[QueryFilterType["Without"] = 1] = "Without";
})(QueryFilterType || (QueryFilterType = {}));
export var RunnerLabel;
(function (RunnerLabel) {
    RunnerLabel[RunnerLabel["Local"] = 0] = "Local";
    RunnerLabel[RunnerLabel["Remote"] = 1] = "Remote";
})(RunnerLabel || (RunnerLabel = {}));
export var WorldPeriods;
(function (WorldPeriods) {
    WorldPeriods[WorldPeriods["Init"] = 0] = "Init";
    WorldPeriods[WorldPeriods["BeforeUpdate"] = 1] = "BeforeUpdate";
    WorldPeriods[WorldPeriods["Update"] = 2] = "Update";
    WorldPeriods[WorldPeriods["AfterUpdate"] = 3] = "AfterUpdate";
    WorldPeriods[WorldPeriods["BeforeEvent"] = 4] = "BeforeEvent";
    WorldPeriods[WorldPeriods["Event"] = 5] = "Event";
})(WorldPeriods || (WorldPeriods = {}));

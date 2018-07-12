define('src/WorkerStates', [], function() {
  var WorkerStates = {
    STARTING: 0,
    STARTED: 1,
    LOADED: 2,
    INITIALIZED: 3,
    DISPATCH: 4,
    JOB: 5,
    COMPLETED: 6
  };

  Object.freeze(WorkerStates);

  return WorkerStates;
});

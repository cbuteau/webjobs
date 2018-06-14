'use strict';
define([] , function() {

  function SimpleJob() {}

  // figure out ES6 crap later...

  // return default new class {
  //   dispatch(options) {
  //     var workerId = options.workerId;
  //   }
  // };

  SimpleJob.prototype = {
    dispatch: function(workerId, parameters) {
      var result = parameters.param1 + parameters.param2;
      postMessage({
        msg: 4,
        workerId: workerId,
        payload: result
      });
    }
  };

  return SimpleJob;
});

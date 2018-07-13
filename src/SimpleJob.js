'use strict';
define('src/SimpleJob', ['src/MessageIds'] , function(MessageIds) {

  function SimpleJob() {}

  // figure out ES6 crap later...

  // return default new class {
  //   dispatch(options) {
  //     var workerId = options.workerId;
  //   }
  // };

  SimpleJob.prototype = {
    dispatch: function(workerId, parameters) {
      var op = parameters.op;
      if (!op) {
        op = '+';
      }
      var result;
      switch (op) {
        case '+':
          result = parameters.param1 + parameters.param2;
          break;
        case '-':
          result = parameters.param1 - parameters.param2;
          break;
        case '*':
          result = parameters.param1 * parameters.param2;
          break;
        case '/':
          result = parameters.param1 / parameters.param2;
          break;
      }
      if (isNaN(result)) {
        throw new Error('IsNaN man...');
      }
      if (!isFinite(result)) {
        throw new Error('Infinity Gauntlet');
      }
      //var result = parameters.param1 + parameters.param2;
      postMessage({
        msg: MessageIds.DISPATCH_COMPLETE,
        workerId: workerId,
        payload: result
      });
    }
  };

  return SimpleJob;
});

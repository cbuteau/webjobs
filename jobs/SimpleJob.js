'use strict';
define('jobs/SimpleJob', ['src/DispatcherHelper'], function(DispatcherHelper) {

  function SimpleJob() {}


  SimpleJob.prototype = {
    dispatch: function(workerId, parameters) {
      DispatcherHelper.execute(workerId, parameters, this._work);
    },
    dispatch_old: function(workerId, parameters) {

      var op = '+';
      if (parameters && parameters.op) {
        op = parameters.op;
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
      //DispatcherHelper.success(result);
      postMessage({
        msg: 5,
        workerId: workerId,
        payload: result
      });
    },
    _work: function(workerId, parameters) {
      var op = '+';
      if (parameters && parameters.op) {
        op = parameters.op;
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

      return result;
    }
  };

  return SimpleJob;
});

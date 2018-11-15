'use strict';
define('src/DispatcherHelper', ['src/MessageIds'], function(MessageIds) {
  var instance = null;

  function DispatcherHelper() {
    if (instance !== null) {
      throw new Error('Cannot instantiate twice');
    }

    this.initialize();
  }

  DispatcherHelper.prototype = {
    initialize: function() {
    },
    execute: function(workerId, parameters, executionCallback) {
      try {
        var payload = executionCallback(workerId, parameters);
        this.success(workerId, payload);
      } catch (e) {
        this.fail(workerId, e);
      }
    },
    success: function(workerId, payload) {
      postMessage({
        msg: MessageIds.DISPATCH_COMPLETE,
        workerId: workerId,
        payload: payload
      });
    },
    fail: function(workerId, err) {
      if (err instanceof Error) {
        var olderr = err;
        err = {
          message: olderr.message,
          stack: olderr.stack
        };
      };
      postMessage({
        msg: MessageIds.DISPATCH_ERROR,
        workerId: workerId,
        error: err
      });
    }
  };

  DispatcherHelper.getInstance = function() {
    if (instance === null) {
      instance = new DispatcherHelper();
    }
    return instance;
  };

  return DispatcherHelper.getInstance();
});

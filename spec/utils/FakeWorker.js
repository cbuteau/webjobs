define('spec/utils/FakeWorker', ['src/MessageIds'], function(MessageIds) {

  function FakeWorkerBaseInitError() {
    var that = this;
    setTimeout(function() {
      that.onmessage({
        data: {
          msg: MessageIds.SCRIPTLOADED,
          workerId: 'unknown'
        }
      });
    }, 500);
  }

  FakeWorkerBaseInitError.prototype = {
    postMessage: function(data) {
      var msg = params.msg;
      switch (msg) {
        case 1:
          this.onmessage({
            data: {
              msg: MessageIds.BASEINIT_ERROR,
              workerId: params.workerId
            }
          });
      }
    }
  }

  function FakeWorkerWithPayload(options) {
    var that = this;
    this.options = options;
    setTimeout(function() {
      that.onmessage({
        data: {
          msg: MessageIds.SCRIPTLOADED,
          workerId: 'unknown'
        }
      });
    }, 500);
  }

  FakeWorkerWithPayload.prototype = {
    postMessage: function(params) {
      // postMEssage is the client code calling us and we should respond with a delay...
      var that = this;
      var msg = params.msg;
      switch (msg) {
        case 1:
          this.onmessage({
            data: {
              msg: MessageIds.BASEINIT_COMPLETE,
              workerId: params.workerId
            }
          });
        case 4:
          this.onmessage({
            data: {
              msg: MessageIds.DISPATCH_COMPLETE,
              workerId: params.workerId,
              payload: this.options.payload
            }
          });
      }
    }
  };




  return {
    FakeWorkerBaseInitError: FakeWorkerBaseInitError,
    FakeWorkerWithPayload: FakeWorkerWithPayload
  }
});

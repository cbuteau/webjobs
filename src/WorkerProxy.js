 define('src/WorkerProxy', ['src/WorkerStates', 'src/MessageIds'], function(WorkerStates, MessageIds) {

   var usedIds = [];

   function getId() {
     return '' + Math.random().toString(36).substr(2, 9);
   }

   function ensureId() {
     var id = getId();
     while(usedIds.indexOf(id) !== -1) {
       id = getId();
     }
     usedIds.push(id);

     return id;
   }


  function WorkerProxy(parameters) {
    this._boundOnMessage = this.onMessage.bind(this);
    this.messages  = [];
    this.settings = {};
    this.jobparams = parameters.jobparams;
    this.settings.state = WorkerStates.STARTING;
    this.settings.id = ensureId();
    this._worker = new Worker(parameters.basePath);
    this._worker.onmessage = this._boundOnMessage;
    this.settings.startTime = Date.now();
    this.settings.state = WorkerStates.STARTED;
    this.queue({
      msg: MessageIds.BASEINIT,
      baseUrl: parameters.baseUrl,
      jobPath: parameters.jobPath,
      workerId: this.settings.id,
      requirePath: parameters.requirePath
    });
    var that = this;
    this._promise = new Promise(function(resolve, reject) {
      that.reject = reject;
      that.resolve = resolve;
    });

    if (parameters.timeout) {
      setTimeout(function() {
        that.rejectReason = 'timeout';
        that.reject(new Error('Job Timeout'));
      }, parameters.timeout);
    }
  }


  WorkerProxy.prototype = {
    onMessage:function(e) {
      var data = e.data;
      switch (data.msg) {
        case MessageIds.SCRIPTLOADED:
          this.process();
          break;
        case MessageIds.BASEINIT_COMPLETE:
          this.settings.state = WorkerStates.INITIALIZED;
          this._worker.postMessage({
            msg: MessageIds.DISPATCH,
            workerId: data.workerId,
            params: this.jobparams
          })
          break;
        case MessageIds.BASEINIT_ERROR:
        // worker.state = WorkerStates.COMPLETED;
        // worker.reject(data.error);
          this.settings.state = WorkerStates.COMPLETED;
          this.reject(data.error);

          break;
        case MessageIds.DISPATCH_COMPLETE:
          this.resolve(data.payload);
          this.settings.state = WorkerStates.COMPLETED;
          // TODO move into Thread Pool to reinit.
          break;
        case MessageIds.DISPATCH_ERROR:
          this.reject(data.error);
          this.settings.state = WorkerStates.COMPLETED;
          break;
        default:
          console.log('Unhandled = ' + data.msg);
          break;
      }
    },
    queue: function(msg) {
      this.messages.push(msg);
    },
    process: function() {
      var msg = this.messages.pop();
      while (msg) {
        this._worker.postMessage(msg);
        msg = this.messages.pop();
      }
    },
    getPromise: function() {
      return this._promise;
    }
  }


  return WorkerProxy;
});

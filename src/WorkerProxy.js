
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
    this.callbacks = [];
    this.settings = {};
    this.jobparams = parameters.jobparams;
    this.settings.state = WorkerStates.STARTING;
    this.settings.id = ensureId();

    var that = this;
    this._promise = new Promise(function(resolve, reject) {
      that.reject = reject;
      that.resolve = resolve;
    });


    try {
      //this._worker = new Worker(parameters.basePath);
      this._worker = new Worker('BaseThread.js');
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

      if (parameters.timeout) {
        setTimeout(function() {
          that.rejectReason = 'timeout';
          that.reject(new Error('Job Timeout'));
        }, parameters.timeout);
      }
    } catch(e) {
      this.settings.state = WorkerStates.COMPLETED;
      this.reject(e);
    }
  }


  WorkerProxy.prototype = {
    onMessage:function(e) {
      var data = e.data;
      switch (data.msg) {
        case MessageIds.SCRIPTLOADED:
          this.process();
          this.updateState(WorkerStates.STARTED);
          break;
        case MessageIds.BASEINIT_COMPLETE:
          this.settings.state = WorkerStates.INITIALIZED;
          this._worker.postMessage({
            msg: MessageIds.DISPATCH,
            workerId: data.workerId,
            params: this.jobparams
          });
          this.updateState(WorkerStates.JOB);
          break;
        case MessageIds.BASEINIT_ERROR:
          this.updateState(WorkerStates.COMPLETED);
          this.reject(data.error);

          break;
        case MessageIds.DISPATCH_COMPLETE:
          this.resolve(data.payload);
          this.updateState(WorkerStates.COMPLETED);
          break;
        case MessageIds.DISPATCH_ERROR:
          this.reject(data.error);
          this.updateState(WorkerStates.COMPLETED);
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
    restart: function(parameters) {
      var that = this;
      this._promise = new Promise(function(resolve, reject) {
        that.reject = reject;
        that.resolve = resolve;
      });

      this.jobparams = parameters.jobparams;
      this.queue({
        msg: MessageIds.BASEINIT,
        baseUrl: parameters.baseUrl,
        jobPath: parameters.jobPath,
        workerId: this.settings.id,
        requirePath: parameters.requirePath
      });

      if (parameters.timeout) {
        setTimeout(function() {
          that.rejectReason = 'timeout';
          that.reject(new Error('Job Timeout'));
        }, parameters.timeout);
      }

      this.process();
    },
    subscribe: function(eventId, callback) {
      // if we have more events we can build a pubsub mechanism...
      this.callbacks.push(callback);
    },
    updateState: function(newState) {
      this.settings.state = newState;
      for (var i = 0; i < this.callbacks.length; i++) {
        this.callbacks[i](newState, this);
      }
    },
    getPromise: function() {
      return this._promise;
    }
  }

  return WorkerProxy;
});

'use strict';
define('src/TroubleMaker', ['src/MessageIds', 'src/WorkerStates', 'src/ThePool', 'src/WorkerProxy'], function(MessageIds, WorkerStates, ThePool, WorkerProxy) {

  var instance = null;

  function TroubleMaker() {
    this.workers = {};
  }

  TroubleMaker.prototype = {
    setup: function(options) {
      // setup resolver...
      this.options = options;
      // bind it once..
      //this._boundOnMessage = this._workerOnMessage.bind(this);

      this.requirejsBaseUrl = require.toUrl('');
    },
    start: function(options) {
      //var basePath = this._resolve('src/BaseThread.js');

      var proxy = ThePool.pickup({
        jobparams: options.jobparams,
        baseUrl: this.requirejsBaseUrl,
        requirePath: this.options.resolver.getrequirePath(),
        jobPath: options.jobPath,
        timeout: options.timeout
      });

      this.workers[proxy.settings.workerId] = proxy;

      return proxy.getPromise();
    },
    start_proxy: function(options) {
      //var path = this._resolve(options.jobPath);
      var basePath = this._resolve('src/BaseThread.js');

      var proxy = new WorkerProxy({
        jobparams: options.jobparams,
        baseUrl: this.requirejsBaseUrl,
        requirePath: this.options.resolver.getrequirePath(),
        jobPath: options.jobPath,
        basePath: basePath,
        timeout: options.timeout
      });

      this.workers[proxy.settings.workerId] = proxy;

      return proxy.getPromise();
    },
    _workerOnMessage: function(e) {
      var data = e.data;
      switch (data.msg) {
        case MessageIds.SCRIPTLOADED:
          var flat = this._flattenWorkers();
          flat.sort(function(wrkOne, wrkTwo) {
            return wrkOne.startTime - wrkTwo.startTime;
          });
          var worker = flat[0];
          worker.state = WorkerStates.LOADED;
          var msg = worker.messages.pop();
          while (msg) {
            worker.postMessage(msg);
            msg = worker.messages.pop();
          }
          break;
        case MessageIds.BASEINIT_COMPLETE:
          // send JOB dispatch...
          if (data.workerId) {
            var worker = this.workers[data.workerId];
            worker.state = WorkerStates.INITIALIZED;
            worker.postMessage({
              msg: MessageIds.DISPATCH,
              workerId: data.workerId,
              params: worker.jobparams
            });
          } else {
            console.error('No workerId in message');
          }
          break;
        case MessageIds.BASEINIT_ERROR:
          if (data.workerId) {
            var worker = this.workers[data.workerId];
            worker.state = WorkerStates.COMPLETED;
            worker.reject(data.error);

          } else {
            console.error('No workerId in message');
          }
          break;
        case MessageIds.DISPATCH_COMPLETE:
          var context = this.workers[data.workerId];
          context.resolve(data.payload);
          break;
        case MessageIds.DISPATCH_ERROR:
          console.error(data.error);
          if (data.workerId) {
            var worker = this.workers[data.workerId];
            worker.reject(data.error);
          }
          break;
        default:
          console.error('Response did not have valid msg code "' + data.msg + '')
          break;
      }
    },

    // <editor-fold> Private

    _resolve: function(path) {
      return this.options.resolver.resolve(path);
    },

    _flattenWorkers: function() {
      var flat = [];
      for (var prop in this.workers) {
        var worker = this.workers[prop];
        flat.push(worker);
      }
      return flat;
    },

    _cleanupWorkers: function() {
      // disable until we can debug threads.
      return;
      var flat = [];
      for (var prop in this.workers) {
        var worker = this.workers[prop];
        if (worker.isDone) {
          flat.push(worker);
        }
      }
      if (flat.length) {
        flat.sort(function(verOne, verTwo) {
          return verOne.doneTime - verTwo.doneTime;
        });
        var bottom = flat[flat.length-1];
        // Until we learn to pool and reuse these...just let them go.
        bottom.terminate();
        delete this.workers[bottom.workerId];
      }
    }

    // </editor-fold>

  }

  if (!instance) {
    instance = new TroubleMaker();
  }
  return instance;
});

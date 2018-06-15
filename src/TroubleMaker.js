'use strict';
define('src/JobStarter', ['src/IdGenerator', 'src/MessageIds'], function(IdGenerator, MessageIds) {

  var instance = null;

  function TroubleMaker() {
    this.workers = {};
  }

  TroubleMaker.prototype = {
    setup: function(options) {
      // setup resolver...
      this.options = options;
      // bind it once..
      this._boundOnMessage = this._workerOnMessage.bind(this);
    },
    start: function(options) {
      // resolve actual path to script...
      var path = this._resolve(options.jobPath);
      var basePath = this._resolve('base/src/BaseThread.js');

      var worker = new Worker(basePath);
      var workerId = IdGenerator.generate();
      this.workers[workerId] = worker;
      worker.workerId = workerId;
      // TODO include the path to require js so the thread can load it...
      worker.postMessage({
        msg: MessageIds.BASEINIT,
        baseUrl: this.options.resolver.baseUrl(),
        jobPath: options.jobPath,
        jobImport: this.options.resolver.resolve('base/' + options.jobPath),
        workerId: workerId,
        requirePath: this.options.resolver.getrequirePath()
      });

      worker.onmessage = this._boundOnMessage;

      worker.jobparams = options.jobparams;

      if (options.timeout) {
        setTimeout(function() {
          worker.rejectReason = 'timeout';
          worker.reject(new Error('Job Timeout'));
        }, options.timeout);
      }

      var promise = new Promise(function(resolve, reject) {
        // appedn onto worker object.
        // if it does not work append onto wrppper object.
        worker.resolve = resolve;
        worker.reject = reject;
      });

      var that = this;

      var finish = function() {
        worker.isDone = true;
        worker.doneTime = Date.now();
        that._cleanupWorkers();
      }

      promise.catch(function(err) {
        worker.isFaulted = true;
        finish();
      });

      promise.then(function(result) {
        finish();
      });

      return promise;
    },
    _workerOnMessage: function(e) {
      var data = e.data;
      switch (data.msg) {
        case MessageIds.BASEINIT_COMPLETE:
          // send JOB dispatch...
          if (data.workerId) {
            var worker = this.workers[data.workerId];
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

    _cleanupWorkers: function() {
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

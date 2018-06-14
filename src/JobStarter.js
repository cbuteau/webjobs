'use strict';
define('src/JobStarter', ['src/IdGenerator', 'src/MessageIds'], function(IdGenerator, MessageIds) {

  var instance = null;

  function JobStarter() {
    this.workers = {};
  }

  JobStarter.prototype = {
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

      promise.catch(function(err) {
        worker.isFaulted = true;
      });

      return promise;
    },
    _resolve: function(path) {
      return this.options.resolver.resolve(path);
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
    }
  }

  if (!instance) {
    instance = new JobStarter();
  }
  return instance;
});

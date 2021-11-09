'use strict';
define('src/TroubleMaker', ['src/MessageIds', 'src/WorkerStates', 'src/ThePool'], function(MessageIds, WorkerStates, ThePool) {

  var instance = null;

  function TroubleMaker() {
    this.workers = {};
    this.isSetup = false;
  }

  TroubleMaker.prototype = {
    initialize: function(options) {
      this.options = options;
      if ((!this.options.fullPathToRequire) || (!this.options.baseUrl))) {
        throw new Error(
          'Key options missing'
        )
      }
      return new Promise(function(resolve, reject) {
        ThePool.
        resolve()
      });
    },

    setup: function(options) {
      // setup resolver...
      this.options = options;
      // bind it once..
      //this._boundOnMessage = this._workerOnMessage.bind(this);

      this.requirejsBaseUrl = require.toUrl('');
      this.isSetup = true;
    },
    start: function(options) {
      //var basePath = this._resolve('src/BaseThread.js');
      if (!this.isSetup) {
        throw new Error('setup method not called.');
      }

      var proxy = ThePool.pickup({
        jobParams: options.jobParams,
        instance: true,
        baseUrl: this.options.baseUrl,
        requirePath: this.options.fullPathToRequire,
        appPath: this.options.appPath,
        jobPath: options.jobPath,
        infoCallback: options.infoCallback,
        timeout: options.timeout
      });

      this.workers[proxy.settings.workerId] = proxy;

      return proxy.getPromise();
    }
  }

  if (!instance) {
    instance = new TroubleMaker();
  }
  return instance;
});

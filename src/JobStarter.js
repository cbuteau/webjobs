define('src/JobStarter', [], function() {

  var instance = null;

  function JobStarter() {
  }

  JobStarter.prototype = {
    setup: function(options) {
      // setup resolver...
      this.options = options;
    },
    start: function(options) {
      // resolve actual path to script...
      var path = this._resolve(options.jobPath);
      var basePath = this._resolve('src/BaseThread');

      this._worker = new Worker(basePath);
      this._worker.sendMessage({
        msg: 0,
        jobPath: path
      });
    },
    _resolve: function(path) {
      return this.options.resolver.resolve(path);
    }
  }

  if (instance) {
    return instance;
  } else {
    instance = new JobStarter();
    return instance;
  }
});

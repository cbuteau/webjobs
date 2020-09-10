'use strict';
define('src/WorkQueue', [], function() {

  function PromiseParts() {
    var that = this;
    this._promise = new Promise(function(resolve, reject) {
      that.resolve = resolve;
      that.reject = reject;
    });
  }


  function WorkQueue() {
    this.work = [];
    this._boundRaf = this._raf.bind(this);
    this._start();
  }

  WorkQueue.prototype = {
    queue: function(workObject) {
      var parts = new PromiseParts();
      var workContext = {
          work: workObject,
          parts: parts
      };
      this.work.push(workContext);
      this._start();
      return parts._promise;
    },
    _raf: function() {
      var counter = 0;

      while (this.work.length) {
        var workContext = this.work.pop();
        workContext.work.execute.call(workContext.work, workContext.parts);
        counter++;
      }

      if (counter === 0) {
        return;
      }

      this._start();
    },
    _start: function() {
      requestAnimationFrame(this._boundRaf);
    }
  };

  var instance;
  if (!instance) {
    instance = new WorkQueue();
  }

  return instance;
});

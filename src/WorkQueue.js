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
      this.work.push(workObject);
      this._start();
    },
    _raf: function() {
      var counter = 0;

      while (this.work.length) {
        var work = this.work.pop();
        var parts = new PromiseParts();
        work.execute.call(work, parts);
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

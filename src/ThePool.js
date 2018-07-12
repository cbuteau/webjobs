define('src/ThePool', ['src/WorkerStates'], function(WorkerStates) {
  var instance = null;

  function ThePool() {
    this.list = [];
    this.completed = [];
    this.boundThink = this.think.bind(this);

  }

  ThePool.prototype = {
    dropoff: function(worker, deleteCallback) {
      this.list.push({
        worker: worker,
        deleteCallback: deleteCallback
      });


    },

    pickup: function(parameters) {
      var worker;
      if (this.completed.length > 0) {
        worker = this.completed.pop();
      }

      if (worker === undefined) {
        // spawn by parameters passed in...
      }

      return worker;
    },

    think: function() {

      // logic to coral and reuse webworkers.
      // we would have to reload thier initializer.
      var totrim = [];
      for (var i = 0; i < this.list.length; i++) {
        var worker = this.list[i];
        if (worker.state === WorkerStates.COMPLETED) {
          totrim.push(worker);
          this.completed.push(worker);
        }
      }

      for (var j = 0 ; j < totrim.length; j++) {
        var workertotrim = totrim[j];
        var myindex = this.list.indexOf(workertotrim);
        this.list = this.list.splice(myindex, 1);
      }

      if (this.list.length) {
        setTimeout(this.boundThink, 0);
      }
    }
  }

  if (!instance) {
    instance = new ThePool();
  }
  return instance;
});

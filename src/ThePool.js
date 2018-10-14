define('src/ThePool', ['src/WorkerStates', 'src/WorkerProxy'], function(WorkerStates, WorkerProxy) {
  var instance = null;

  function ThePool() {
    this.list = [];
    this.completed = [];
    this.boundStateUpdate = this.stateUpdate.bind(this);
  }

  ThePool.prototype = {
    dropoff: function(worker) {
      var myindex = this.list.indexOf(worker);
      this.completed.push(worker);
      this.list.splice(myindex, 1);
    },

    pickup: function(parameters) {
      var worker;
      if (this.completed.length > 0) {
        worker = this.completed.pop();
      }

      if (worker === undefined) {
        // spawn by parameters passed in...
        worker = new WorkerProxy(parameters);
        worker.subscribe('StateChanged', this.boundStateUpdate);
        this.list.push(worker);
      } else {
        worker.restart(parameters);
      }

      return worker;
    },

    stateUpdate: function(state, worker) {
      console.log('id:' + worker.settings.id + ' state:' + state);
      if (state === WorkerStates.COMPLETED) {
        this.dropoff(worker);
      }
    }
  }

  if (!instance) {
    instance = new ThePool();
  }
  return instance;
});

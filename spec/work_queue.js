define('spec/work_queue', ['src/WorkQueue'], function(WorkQueue) {

  function SuccessWork(options) {
    this.options = options;
  }

  SuccessWork.prototype = {
    execute: function(work, parts) {
      for (var i = 0; i < 1000; i ++) {
        console.log(i);
      }
      parts.resolve(i);
    }
  };

  function FailureWork(options) {
    this.options = options;
  }

  FailureWork.prototype = {
    execute: function(work, parts) {
      parts.reject();
    }
  };

  fdescribe('Test WorkQueue...', function() {

    fit ('Success', function() {
      return new Promise(function(resolve, reject) {
        WorkQueue.queue(new SuccessWork()).then(resolve);
      })
    });

    fit ('Failure', function() {
      return new Promise(function(resolve, reject) {
        WorkQueue.queue(new FailureWork()).catch(resolve);
      })
    });

  });

});

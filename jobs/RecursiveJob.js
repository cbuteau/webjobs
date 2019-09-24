'use strict';
define('jobs/RecursiveJob' ,[], function() {

  function factorial(n) {
    if (n >= 1) {
      return n * factorial(n - 1);
    } else {
      return 1;
    }
  }

  function RecursiveJob() {}

  RecursiveJob.prototype = {
    dispatch: function(workerId, params, callback) {
      var fact = factorial(params.n);
      callback({
        workerId: workerId,
        payload: fact
      });
    }
  };

  return RecursiveJob;
});

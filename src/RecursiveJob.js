define([], function() {

  function factorial(n) {
    if (n >= 1) {
      return n * factorial(n - 1);
    } else {
      return 1;
    }
  }

  function RecursiveJob() {}

  RecursiveJob.prototype = {
    dispatch: function(workerId, params) {
      var fact = factorial(params.n);
      postMessage({
        msg: 5,
        workerId: workerId,
        payload: fact
      });
    }
  };

  return RecursiveJob;
});

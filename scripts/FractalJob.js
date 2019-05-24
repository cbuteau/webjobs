
define('jobs/FractalJob' , [], function() {
'use strict';

  function MandelBrot() {}

  MandelBrot.prototype = {
    render: function(array) {

    }
  }

  function FractalJob() {}

  FractalJob.prototype = {
    dispatch: function(workerId, parameters) {
      // TODO build a fractal buffer and then postMessage back to main thread.

      var buffer = new ArrayBuffer(64);
      var result = new Uint8Array(buffer);

      var mandelbrot = new MandelBrot();
      mandelbrot.render(result);


      postMessage({
          msg: 5,
          workerId: workerId,
          payload: result
      });
    }
  };

  return FractalJob;

});

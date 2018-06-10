'use strict';


// In the thread we will load the job script and requirejs...
function Helper() {
}

Helper.prototype = {
  convertError: function(err) {
    return {
      code: err.code,
      message: err.message,
      stack: err.stack
    };
  }
};

self.helper = new Helper();

onmessage = function(e) {
  console.log('Message received from main script');

  var data = e.data;

  switch (data.msg) {
    case 0:
      console.log('INIT');
      // LOad Job Script into thread using import scripts.

      // TODO somehow load requirejs and configure it...

      try {
        importScripts(data.requirePath);

        requirejs.config({
          base: 'base',
          callback: function() {
            require([data.jobPath], function(JobDispatcher) {
              self.dispatcher = new JobDispatcher();
            }, function(requireerr) {
              console.error(requireerr);
              postMessage({
                msg: 2,
                workerId: data.workerId,
                comment: 'Require of Job failed',
                error: self.helper.convertError(requireerr)
              });
            });
          }
        });
        //importScripts('http://localhost:9876/base/node_modules/requirejs/require.js');
      } catch (err) {
        postMessage({
          msg: 2,
          workerId: data.workerId,
          comment: 'Require would not import.',
          error: self.helper.convertError(err)
        });
      }

      //importScripts('../src/requirejs.js');

      postMessage({
        msg: 1,
        workerId: data.workerId,
        comment: 'Init complete'
      });

      break;
    case 1:
      // Diapatch work data to job...
      break;
  }

  var workerResult = 'Result: ' + (e.data[0] * e.data[1]);
  console.log('Posting message back to main script');
  postMessage(workerResult);
}

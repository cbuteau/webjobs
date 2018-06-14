'use strict';


// In the thread we will load the job script and requirejs...
function Helper() {
}

Helper.prototype = {
  convertError: function(err) {

    var converted = {
      message: err.message,
      stack: err.stack
    };

    if (err.code) {
      converted.code = err.code;
    }

    return converted;
  },
  translateMsg: function(msg) {
    switch (msg) {
      case 0:
        return 'BASINIT';
        break;
      case 1:
        return 'BASEINIT_COMPLETE';
        break;
      case 2:
        return 'BASEINIT_ERROR';
        break;
      case 3:
        return 'DISPATCH';
        break;
      case 4:
        return 'DISPATCH_COMPLETE';
        break;
      case 5:
        return 'DISPATCH_ERROR';
        break;
      default:
        return 'OMG_UNDEFINED';
        break;
    }
  }
};

self.helper = new Helper();

onmessage = function(e) {
  console.log('Message received from main script');

  var data = e.data;

  console.log('msg:' + data.msg + ' translated:' + self.helper.translateMsg(data.msg));

  switch (data.msg) {
    case 0:
      console.log('INIT');
      // LOad Job Script into thread using import scripts.

      // TODO somehow load requirejs and configure it...

      try {
        importScripts(data.requirePath);

        if (data.test) {
          // TODO load test infrastructure...
        }

        requirejs.config({
          baseUrl: '/base',
          waitSeconds: 20,
          callback: function() {
            //importScripts(data.jobImport);

            //self.dispatcher = new SimpleJob();

            require([data.jobImport], function(JobDispatcher) {
              self.dispatcher = new JobDispatcher();
              postMessage({
                msg: 1,
                workerId: data.workerId,
                comment: 'Initialized dispatcher'
              });
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
        //console.log(requirejs);
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

      // postMessage({
      //   msg: 1,
      //   workerId: data.workerId,
      //   comment: 'Init complete'
      // });

      break;
    case 3:
      // Diapatch work data to job...
      self.dispatcher.dispatch(data.workerId, data.params);
      break;
    default:
      console.log('you dropped a message on the floor.');
      break;
  }

  // var workerResult = 'Result: ' + (e.data[0] * e.data[1]);
  // console.log('Posting message back to main script');
  // postMessage(workerResult);
}

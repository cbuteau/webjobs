'use strict';

// <editor-fold>
// In the thread we will load the job script and requirejs...

function convertError(err) {

  var converted = {
    message: err.message,
    stack: err.stack
  };

  if (err.code) {
    converted.code = err.code;
  }

  return converted;
}

function translateMsg(msg) {
  switch (msg) {
    case 0:
      return 'SCRIPTLOADED';
      break;
    case 1:
      return 'BASEINIT';
      break;
    case 2:
      return 'BASEINIT_COMPLETE';
      break;
    case 3:
      return 'BASEINIT_ERROR';
      break;
    case 4:
      return 'DISPATCH';
      break;
    case 5:
      return 'DISPATCH_COMPLETE';
      break;
    case 6:
      return 'DISPATCH_ERROR';
      break;
    default:
      return 'OMG_UNDEFINED';
      break;
  }
}


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
        return 'SCRIPTLOADED';
        break;
      case 1:
        return 'BASEINIT';
        break;
      case 2:
        return 'BASEINIT_COMPLETE';
        break;
      case 3:
        return 'BASEINIT_ERROR';
        break;
      case 4:
        return 'DISPATCH';
        break;
      case 5:
        return 'DISPATCH_COMPLETE';
        break;
      case 6:
        return 'DISPATCH_ERROR';
        break;
      default:
        return 'OMG_UNDEFINED';
        break;
    }
  }
};

self.helper = new Helper();

var reply;
// </editor-fold>

onmessage = function(e) {
  console.log('Message received from main script');

  var data = e.data;

  console.log('msg:' + data.msg + ' translated:' + self.helper.translateMsg(data.msg));

  switch (data.msg) {
    case 1:
      //console.log('INIT');
      // LOad Job Script into thread using import scripts.

      // TODO somehow load requirejs and configure it...

      try {
        importScripts(data.requirePath);

        if (data.test) {
          // TODO load test infrastructure...
        }

        // TODO Load abstraction and other modules here also.
        require({
          baseUrl: data.baseUrl,
          waitSeconds: 20
        }, [data.jobPath, 'internals/Reply'], function(JobDispatcher, Reply) {
          try {
            reply = Reply;
            self.dispatcher = new JobDispatcher();
            postMessage({
              msg: 2,
              workerId: data.workerId,
              comment: 'Initialized dispatcher'
            });
          } catch (errDispatcher) {
            postMessage({
              msg: 3,
              workerId: data.workerId,
              comment: 'Instantiation of dispatcher failed',
              error: self.helper.convertError(errDispatcher)
            });
          }

        }, function(requireerr) {
          console.error(requireerr);
          postMessage({
            msg: 3,
            workerId: data.workerId,
            comment: 'Require of Job failed',
            error: self.helper.convertError(requireerr.originalError)
          });

        });
      } catch (err) {
        postMessage({
          msg: 2,
          workerId: data.workerId,
          comment: 'Require would not import.',
          error: self.helper.convertError(err)
        });
      }
      break;
    case 4:
      // Dispatch work data to job...
      try {
        var result = self.dispatcher.dispatch(data.workerId, data.params);
        reply.dispatch(result);
      } catch(err) {
        console.errror(err);
        reply.dispatch({ error: convertError(err)});
        // postMessage({
        //   msg: 6,
        //   error: self.helper.convertError(err)
        // });
      }
      break;
    default:
      console.log('you dropped a message on the floor.');
      break;
  }
}

// execute this to tell launcher that we loaded this thread.
postMessage({
  msg: 0,
  workerId: 'unknown'
});

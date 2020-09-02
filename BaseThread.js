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

var reply;
// </editor-fold>

onmessage = function(e) {
  console.log('Message received from main script');

  var data = e.data;

  console.log('msg:' + data.msg + ' translated:' + translateMsg(data.msg));

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
        }, [data.jobPath], function(JobDispatcher) {
          try {
            self.dispatcher = new JobDispatcher();
            // reply.init({
            //   workerId: data.workerId,
            //   comment: 'Initialized dispatcher'
            // });
            postMessage({
              workerId: data.workerId,
              comment: 'Initialized dispatcher',
              msg: 2
            });
          } catch (errDispatcher) {
            postMessage({
              msg: 3,
              workerId: data.workerId,
              comment: 'Instantiation of dispatcher failed',
              error: convertError(errDispatcher)
            });
          }

        }, function(requireerr) {
          console.error(requireerr);
          postMessage({
            msg: 3,
            workerId: data.workerId,
            comment: 'Require of Job failed',
            error: convertError(requireerr.originalError)
          });

        });
      } catch (err) {
        postMessage({
          msg: 2,
          workerId: data.workerId,
          comment: 'Require would not import.',
          error: convertError(err)
        });
      }
      break;
    case 4:
      // Dispatch work data to job...
      try {
        var result = self.dispatcher.dispatch(data.workerId, data.params, function(result) {
          if (result.isError) {
            if (result.payload instanceof Error) {
              result.payload = convertError(result.payload);
            }
              //reply.dispatch(result, true);

              result.msg = 6;
              postMessage(result);
          } else {
              //reply.dispatch(result);
              result.msg = 5;
              postMessage(result);
              // postMessage({
              //   msg: 6,
              //   error: self.helper.convertError(err)
              // });
          }
        });
        //reply.dispatch(result);
      } catch(err) {
        console.error(err);
        //reply.dispatch({ error: convertError(err)}, true);
        postMessage({
          msg: 6,
          payload: convertError(err)
        });
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

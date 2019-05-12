/*global define */
'use strict';
define('jobs/TestJob', ['src/MessageIds'], function(MessageIds) {

  /*
   * Just create a regular vanilla javascript class in requirejs format.
   *
   * A constructor
   * A prototype decalration with the method dispatch.
   * return the constructor at the end.
   *
   * Within dispatch you can call other styatic or instamce functions
   * but you have 2 maain exits..
   *
   * postMessage({
   *   msg: MessageIds.DISPATCH_COMPLETE,
   *   workerId: workerId,
   *   payload: <the javascript object or variable to result.
   * });
   *
   * OR
   *
   * postMessage({
   *   msg: MessageIds.DISPATCH_ERROR,
   *   workerId: workerId,
   *   payload: <I usually copy the stack and message of the error and send that.>
   * });
   *
   */


  function TestJob() {}

  TestJob.prototype = {
    dispatch: function(workerId, params) {
      postMessage({
        msg: MessageIds.DISPATCH_COMPLETE,
        workerId: workerId,
        payload: 42
      });
    }
  }

  return TestJob;
});

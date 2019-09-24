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
   * but you have 2 main exits..
   *
   * callback({
   *   isError: true,
   *   payload: e
   * })
   *
   * OR
   *
   * callback({
   *   payload: result
   * })
   *
   */


  function TestJob() {}

  TestJob.prototype = {
    dispatch: function(workerId, params, callback) {
      callback({
        payload: 42
      });
    }
  }

  return TestJob;
});

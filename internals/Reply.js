/*jslint node: true */
/*global define */
'use strict';

// var MessageIds = {
//   SCRIPTLOADED: 0,
//   BASEINIT: 1,
//   BASEINIT_COMPLETE: 2,
//   BASEINIT_ERROR: 3,
//   DISPATCH: 4,
//   DISPATCH_COMPLETE: 5,
//   DISPATCH_ERROR: 6
// };

define('internals/Reply', ['src/MessageIds'], function (MessageIds) {



  function Reply() {}


  Reply.prototype = {
      loaded: function(data) {
        data.msg = MessageIds.SCRIPTLOADED;
        postMessage(data);
      },
      init: function(data, isError) {
        data.msg = isError ? MessageIds.BASEINIT_ERROR : MessageIds.BASEINIT_COMPLETE;
        postMessage(data);
      },
      dispatch: function(data, isError) {
        data.msg = isError ? MessageIds.DISPATCH_ERROR : MessageIds.DISPATCH_COMPLETE;
        postMessage(data);
      }
  };

  var instance;

  if (!instance) {
    instance = new Reply();
  }

  return instance;
});

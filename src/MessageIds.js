/*jslint node: true */
/*global define */
'use strict';
define('src/MessageIds', [], function () {
  var MessageIds = {
    SCRIPTLOADED: 0,
    BASEINIT: 1,
    BASEINIT_COMPLETE: 2,
    BASEINIT_ERROR: 3,
    DISPATCH: 4,
    DISPATCH_COMPLETE: 5,
    DISPATCH_ERROR: 6,
    DISPATCH_INFO: 7
  };

  Object.freeze(MessageIds);

  return MessageIds;
});

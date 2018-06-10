'use strict';
define('src/MessageIds', [], function() {
  const MessageIds = {
    BASEINIT: 0,
    BASEINIT_COMPLETE: 1,
    BASEINIT_ERROR: 2,
    DISPATCH: 3,
    DISPATCH_COMPLETE: 4,
    DISPATCH_ERROR: 5
  };

  Object.freeze(MessageIds);

  return MessageIds;

});

'use strict'

//importScripts('../shared/Messages.js')

const MESSGES = {
  THREADLOADED: 0,
  INIT: 1,

}

self.onmessage = function(e) {
  console.log('msg received');

  switch (data.msg) {
    case MESSGES.INIT:
      break;
    case MESSGES.
  }
}

// execute this to tell launcher that we loaded this thread.
postMessage({
  msg: MESSAGES.THREADLOADED,
  workerId: 'unknown'
});

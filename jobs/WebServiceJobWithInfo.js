'use strict';
define('jobs/WebServiceJobWithInfo', [
  'src/MessageIds'
], function(MessageIds) {

  function request(url, verb, body, onComplete, onFailure) {

    var xhr;

    if (self.XMLHttpRequest) {
      xhr = new XMLHttpRequest();
    } else {
      // I hate IE
      xhr = new ActiveXObject('Microsoft.XMLHTTP');
    }

    function transferComplete(evt) {
      console.log("The transfer is complete.");
      onComplete(JSON.parse(evt.currentTarget.responseText));
    }

    function transferFailed(evt) {
      console.log("An error occurred while transferring the file.");
    }

    function transferCanceled(evt) {
      console.log("The transfer has been canceled by the user.");
    }

    xhr.addEventListener("load", transferComplete);
    xhr.addEventListener("error", transferFailed);
    xhr.addEventListener("abort", transferCanceled);


    xhr.open(verb, url);
    xhr.send();
  }

  function WebServiceJobWithInfo() {}

  WebServiceJobWithInfo.prototype = {
    dispatch: function(workerId, params, callback) {
      /* IE does not like single line comments.
      try timezone api.
      http://api.timezonedb.com/v2.1/get-time-zone

      this works
      http://ip.jsontest.com/


      Bunch of APIs I could test.
      https://reqres.in/

      This is with our free API key.
      http://api.timezonedb.com/v2.1/get-time-zone?key=YLT4O2POSKCD&format=json&by=zone&zone=America/New_York

      var url = 'http://api.timezonedb.com/v2.1/get-time-zone?key=' + params.apiKey + '&format=json&by=zone&zone=America/New_York '

      'http://api.timezonedb.com/v2.1/get-time-zone?key=YLT4O2POSKCD&format=json&by=zone&zone=America/New_York'
      */
      postMessage({
        msg: MessageIds.DISPATCH_INFO,
        payload: 'BeforeRequest'
      })
      request(params.url, params.verb, null, function(data) {
        callback({
          workerId: workerId,
          payload: data
        });
        postMessage({
          msg: MessageIds.DISPATCH_INFO,
          payload: 'AfterRequest'
        })
      }, function(err) {
        callback({
          workerId: workerId,
          isError: true,
          payload: err
        });
        postMessage({
          msg: MessageIds.DISPATCH_INFO,
          payload: 'FailRequest'
        })
      });
    }
  };

  return WebServiceJobWithInfo;
});

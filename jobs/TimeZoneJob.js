'use strict';
define('../jobs/TimeZoneJob', [], function() {

  function request(url, verb, body, onComplete, onFailure) {
    var xhr = new XMLHttpRequest();

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

  function TimeZoneJob() {}

  TimeZoneJob.prototype = {
    dispatch(workerId, params) {
      // try timezone api.
      // http://api.timezonedb.com/v2.1/get-time-zone

      // this works
      // http://ip.jsontest.com/


      // Bunch of APIs I could test.
      // https://reqres.in/

      // This is with our free API key.
      // http://api.timezonedb.com/v2.1/get-time-zone?key=YLT4O2POSKCD&format=json&by=zone&zone=America/New_York

      var url = 'http://api.timezonedb.com/v2.1/get-time-zone?key=' + params.apiKey + '&format=json&by=zone&zone=America/New_York '

      // 'http://api.timezonedb.com/v2.1/get-time-zone?key=YLT4O2POSKCD&format=json&by=zone&zone=America/New_York'

      request(url, 'GET', function(data) {
        postMessage({
          msg: 4,
          workerId: workerId,
          payload: data
        });
      }, function(err) {
        postMessage({
          msg: 5,
          workerId: workerId,
          payload: err
        });
      });
    }
  };

  return TimeZoneJob;
});

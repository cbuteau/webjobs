define([], function() {

  function request(url, verb, body, onComplete, onFailure) {
    var xhr = new XMLHttpRequest();

    function transferComplete(evt) {
      console.log("The transfer is complete.");
      onComplete(JSON.parse(evt.currentTarget.responseText);
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
      request('http://ip.jsontest.com/', 'GET', function(data) {
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

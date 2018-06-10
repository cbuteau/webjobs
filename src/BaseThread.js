
// In the thread we will load the job script and requirejs...

onmessage = function(e) {
  console.log('Message received from main script');

  var data = e.data;

  switch (data.msg) {
    case 0:
      console.log('INIT');
      // LOad Job Script into thread using import scripts.

      postMessage({
        msg: 3,
        comment: 'INit complete'
      });

      break;
    case 1:
      // Diapatch work data to job...
      break;
  }

  var workerResult = 'Result: ' + (e.data[0] * e.data[1]);
  console.log('Posting message back to main script');
  postMessage(workerResult);
}

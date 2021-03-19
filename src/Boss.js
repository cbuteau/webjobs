define('src/Boss', [
  'src/WorkQueue',
  'src/TroubleMaker'
], function(WorkQueue, TroubleMaker) {

  function Boss() {
  }

  Boss.prototype = {
    create: function(options) {
      let that = this;
      return new Promise(function(resolve, reject) {
        let preps = [];
        for (let i = 0; i < options.prep.length; i++) {
          preps.push(WorkQueue.queue(options.prep[i]));
        }
        Promise.all(preps).then(function(resultsArray) {
          let workOptions = options.prepResults(resultsArray);
          let workProm = TroubleMaker.start(workOptions);
          workProm.then(function(workData) {
            let postProm = WorkQueue.queue(new options.postConstructor(workData));
            postProm.then(function() {
              resolve();
            })
          });
        });
      });
    }
  };

  var instance;
  if (!instance) {
    instance = new Boss();
  }

  return instance;
});

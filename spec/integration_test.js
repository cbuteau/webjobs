define('spec/integration_test', ['src/TroubleMaker',  'src/ThePool', 'src/WorkQueue', 'src/Boss'], function(TroubleMaker, ThePool, WorkQueue, Boss) {

  fdescribe('Full back and forth', function() {

    beforeAll(function() {
      // setup promise for those who do not have it (IE)
      if (!window.Promise) {
        window.Promise = Core.Promise;
      }

      var allScripts = document.querySelectorAll('script');

      var requirejsLoadUrl = 'dunno';

      for (var i = 0; i < allScripts.length; i++) { // jshint ignore:line
        var entry = allScripts[i];
        var srcPath = entry.src;
        if (srcPath.indexOf('require') !== -1) {
          requirejsLoadUrl = srcPath;
          break;
        }
      }

      var base_url = window.location.origin;

      TroubleMaker.setup({
        fullPathToRequire: requirejsLoadUrl,
        baseUrl: base_url + '/base/',
        appPath: base_url + '/base/src/../'
      });

    });

    afterAll(function() {
      // remove singleton so it reinitializes
      var cache = require.cache;
      for (var moduleId in cache) {
        delete cache[moduleId];
      }
      //delete require.cache[require.resolve('src/TroubleMaker')];
    });

    beforeEach(function() {
      // so we do NOT reuse proxies...
      ThePool.completed.length = 0;
    });

    fit ('TestJob', function(done) {
      // cover ensureId
      spyOn(Math, 'random').and.returnValues(0.1, 0.1, 0.2, 0.3, 0.4);
      var prom = TroubleMaker.start({
        jobPath: 'jobs/TestJob',
        jobParams: {
          param1: 10,
          param2: 20
        }
      });

      prom.then(function(result) {
        expect(result).toBe(42);
        done();
      });

    });

    fit ('TestJob2', function(done) {
      // cover ensureId
      spyOn(Math, 'random').and.returnValues(0.1, 0.1, 0.2, 0.3, 0.4);
      var prom = TroubleMaker.start({
        jobPath: 'jobs/TestJob',
        jobParams: {
          param1: 10,
          param2: 20
        }
      });

      prom.then(function(result) {
        expect(result).toBe(42);
        done();
      });

    });

    fit ('TestJob timeout', function(done) {
      // cover ensureId
      spyOn(Math, 'random').and.returnValues(0.1, 0.1, 0.2, 0.3, 0.4);
      var prom = TroubleMaker.start({
        jobPath: 'jobs/TestJob',
        jobParams: {
          param1: 10,
          param2: 20
        },
        timeout: 1
      });

      prom.catch(function(err) {
        console.error(err);
        done();
      });

    });


  });

  function SuccessWork(options) {
    this.options = options;
  }

  SuccessWork.prototype = {
    execute: function(parts) {
      for (var i = 0; i < 1000; i ++) {
        console.log(i);
      }
      parts.resolve(i);
    }
  };

  function FailureWork(options) {
    this.options = options;
  }

  FailureWork.prototype = {
    execute: function(parts) {
      parts.reject();
    }
  };

  fdescribe('Test WorkQueue...', function() {

    fit ('Success', function() {
      return new Promise(function(resolve, reject) {
        WorkQueue.queue(new SuccessWork()).then(resolve);
      })
    });

    fit ('Failure', function() {
      return new Promise(function(resolve, reject) {
        WorkQueue.queue(new FailureWork()).catch(resolve);
      })
    });

  });

  function PrepData(options) {
    this.options = options;
  }

  PrepData.prototype = {
    execute: function(parts) {
      parts.resolve({
        param1: 10,
        param2: 20
      })
    }
  }

  function DispatchToUI(options){
    this.options = options;
  }

  DispatchToUI.prototype = {
    execute: function(parts) {
      // push to HTML.
      parts.resolve();
    }
  }

  fdescribe('Test Boss...', function(done) {
    let job = Boss.create({
      prep: [new PrepData()],
      prepResults: function(results) {
        return {
          jobPath: 'jobs/TestJob',
          jobParams: results[0]
        }
      },
      postConstructor: DispatchToUI
    });
    job.then(done);
  });
});

define('spec/integration_test', ['src/TroubleMaker',  'src/ThePool'], function(TroubleMaker, ThePool) {

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

});

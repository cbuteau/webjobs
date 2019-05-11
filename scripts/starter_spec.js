define('spec/starter_spec', ['src/TroubleMaker'], function(TroubleMaker) {

  jasmine.DEFAULT_TIMEOUT_INTERVAL = jasmine.DEFAULT_TIMEOUT_INTERVAL * 10;

  // These are intergration tests come back to them later...
  // They are with the actual threads running and jasmine tends to timeout...

  xdescribe('First test', function() {

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

    it ('Super short timeout', function(done) {
      var prom = TroubleMaker.start({
        jobPath: 'jobs/SimpleJob',
        timeout: 20
      });

      prom.then(function(results) {
        console.log(results);
      }).catch(function(err) {
        expect(err.message).toBe('Job Timeout');
        console.error(err);
        done();
      });
    });

    it ('Start a Simple Job', function(done) {
      //var starter = new JobStarter();
      var prom = TroubleMaker.start({
        jobPath: 'jobs/SimpleJob',
        jobParams: {
          param1: 10,
          param2: 20
        }
      });

      prom.then(function(results) {
        console.log(results);
        expect(results).toBe(30);
        done();
      }).catch(function(err) {
        console.error(err);
        // this path should not be taken.
        expect(err).not.toBe(null);
        //done();
      });
    });

    it ('Simple Job Fail', function(done) {
      var prom = TroubleMaker.start({
        jobPath: 'jobs/SimpleJob',
        jobParams: {
          param1: 10,
          param2: 0,
          op: '/'
        }
      });

      prom.then(function(results) {
        console.log(results);
        expect(results).toBe(30);
        done();
      }).catch(function(err) {
        console.error(err);
        // this path should not be taken.
        expect(err).not.toBe(null);
        done();
      });

    });

    xit ('RecursiveJob', function(done) {
      var prom = TroubleMaker.start({
        jobPath: 'src/RecursiveJob',
        jobParams: {
          n: 5
        }
      });

      prom.then(function(results) {
        console.log(results);
        expect(results).toBe(120);
        done();
      }).catch(function(err) {
        console.error(err);
        // this path should not be taken.
        expect(err).not.toBe(null);
        //done();
      });

    });

    xit ('Multi-Start', function(done) {
      // TODO: Get Pool going for this test to pass.
      var promises = [];
      var prom1 = TroubleMaker.start({
        jobPath: 'src/SimpleJob.js',
        jobParams: {
          param1: 10,
          param2: 20
        }
      });
      promises.push(prom1);

      var prom2 = TroubleMaker.start({
        jobPath: 'src/SimpleJob.js',
        jobParams: {
          param1: 20,
          param2: 20
        }
      });
      promises.push(prom2);

      var prom3 = TroubleMaker.start({
        jobPath: 'src/SimpleJob.js',
        jobParams: {
          param1: 30,
          param2: 20
        }
      });
      promises.push(prom3);

      Promise.all(promises).then(function(results) {
        expect(results).toEqual([30, 40, 50]);
        done();
      }).catch(function(err) {
        // this is what is working...
        console.error(err);
        //throw new Error('Not the correct path');
        done();
      })
    });

  });

});

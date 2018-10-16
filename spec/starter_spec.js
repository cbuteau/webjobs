define('spec/starter_spec', ['src/TroubleMaker', 'src/BasicResolver'], function(TroubleMaker, BasicResolver) {

  jasmine.DEFAULT_TIMEOUT_INTERVAL = jasmine.DEFAULT_TIMEOUT_INTERVAL * 10;

  describe('First test', function() {

    beforeAll(function() {
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

      TroubleMaker.setup({
        resolver: new BasicResolver({
          requirePath: requirejsLoadUrl
        })
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
        jobparams: {
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
        jobPath: 'src/SimpleJob',
        jobparams: {
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
        jobparams: {
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
        jobparams: {
          param1: 10,
          param2: 20
        }
      });
      promises.push(prom1);

      var prom2 = TroubleMaker.start({
        jobPath: 'src/SimpleJob.js',
        jobparams: {
          param1: 20,
          param2: 20
        }
      });
      promises.push(prom2);

      var prom3 = TroubleMaker.start({
        jobPath: 'src/SimpleJob.js',
        jobparams: {
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

define('spec/starter_spec', ['src/TroubleMaker', 'src/BasicResolver'], function(TroubleMaker, BasicResolver) {

  jasmine.DEFAULT_TIMEOUT_INTERVAL = jasmine.DEFAULT_TIMEOUT_INTERVAL * 10;

  describe('First test', function() {

    beforeAll(function() {
      TroubleMaker.setup({
        resolver: new BasicResolver()
      });
    });

    it ('Super short timeout', function(done) {
      var prom = TroubleMaker.start({
        jobPath: 'src/SimpleJob',
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

    xit ('Start a Simple Job', function(done) {
      //var starter = new JobStarter();
      var prom = TroubleMaker.start({
        jobPath: 'src/SimpleJob',
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

    xit ('RecursiveJob', function(done) {
      var prom = TroubleMaker.start({
        jobPath: 'src/RecursiveJob.js',
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
          param1: 10,
          param2: 20
        }
      });
      promises.push(prom2);

      var prom3 = TroubleMaker.start({
        jobPath: 'src/SimpleJob.js',
        jobparams: {
          param1: 10,
          param2: 20
        }
      });
      promises.push(prom3);

      Promise.all(promises).then(function() {
        done();
      }).catch(function() {
        done();
      })
    });

  });

});

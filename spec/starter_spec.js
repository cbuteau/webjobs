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
        jobPath: 'src/SimpleJob.js',
        timeout: 200
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
        jobPath: 'src/SimpleJob.js',
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

    it ('RecursiveJob', function(done) {
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

  });

});

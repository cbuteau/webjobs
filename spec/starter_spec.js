define('spec/starter_spec', ['src/JobStarter', 'src/BasicResolver'], function(JobStarter, BasicResolver) {
  describe('First test', function() {

    beforeAll(function() {
      JobStarter.setup({
        resolver: new BasicResolver()
      });
    });

    xit ('Super short timeout', function(done) {
      var prom = JobStarter.start({
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
      var prom = JobStarter.start({
        jobPath: 'src/SimpleJob.js',
        jobparams: {
          param1: 10,
          param2: 20
        }
      });

      prom.then(function(results) {
        console.log(results);
        done();
      }).catch(function(err) {
        console.error(err);
        // this path should not be taken.
        expect(err).not.toBe(null);
        done();
      });
    });

  });

});

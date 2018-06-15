'use strict';

define('spec/complicated_spec', ['src/JobStarter', 'src/BasicResolver'], function(JobStarter, BasicResolver) {

  jasmine.DEFAULT_TIMEOUT_INTERVAL = jasmine.DEFAULT_TIMEOUT_INTERVAL * 10;

  describe('More Complicated Tests', function() {
    beforeAll(function() {
      JobStarter.setup({
        resolver: new BasicResolver()
      });
    });




    it ('RecursiveJob', function(done) {
      var prom = JobStarter.start({
        jobPath: 'src/TimeZoneJob.js',
        jobparams: {
          url: 'http://ip.jsontest.com/',
          verb: 'GET'
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

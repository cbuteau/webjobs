'use strict';

define('spec/complicated_spec', ['src/TroubleMaker', 'src/BasicResolver'], function(TroubleMaker, BasicResolver) {

  jasmine.DEFAULT_TIMEOUT_INTERVAL = jasmine.DEFAULT_TIMEOUT_INTERVAL * 10;

  describe('More Complicated Tests', function() {
    beforeAll(function() {
      TroubleMaker.setup({
        resolver: new BasicResolver()
      });
    });




    xit ('RecursiveJob', function(done) {
      var prom = TroubleMaker.start({
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

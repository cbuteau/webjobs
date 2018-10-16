define('__tests__/first', ['src/TroubleMaker'], function(TroubleMaker) {

  describe('First Jest Test', function() {

      beforeAll(function() {
        // configure troublemaker...

      });

      test('Addition', function() {
        // default is plus
        var prom = TroubleMaker.start({
          jobPath: 'jobs/SimpleJob',
          jobparams: {
            param1: 10,
            param2: 20
          }
        });
        prom.then(function(results) {
          expect(results).toBe(20);
        }).catch(function(err) {
          // BROKEN
          expect(true).toBe(false);
        })
      });

      test('Subtraction', function() {
        // default is plus
        var prom = TroubleMaker.start({
          jobPath: 'jobs/SimpleJob',
          jobparams: {
            param1: 20,
            param2: 10,
            op: '-'
          }
        });
        prom.then(function(results) {
          expect(results).toBe(10);
        }).catch(function(err) {
          // BROKEN
          expect(true).toBe(false);
        })
      });
  });

});

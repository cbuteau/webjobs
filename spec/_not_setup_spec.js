define('spec/_not_setup',['src/TroubleMaker'], function(TroubleMaker) {

  // Named with underscore so it will be run first...
  

  describe('Calls start without setup', function() {
    it ('Call start', function() {
      expect(function() {
        TroubleMaker.start({
          jobPath: 'src/SimpleJob.js',
          jobParams: {
            param1: 10,
            param2: 20
          }
        });
      }).toThrow();
    })
  });

});

define('spec/_not_setup', ['src/TroubleMaker'], function(TroubleMaker) {

  describe('Cover the exception when we do not setup singleton', function() {
    it ('test it', function() {
      expect(function() {
        TroubleMaker.start({
          jobPath: 'src/SimpleJob.js',
          jobParams: {
            param1: 10,
            param2: 20
          }
        });
      }).toThrow();
    });
  });
});

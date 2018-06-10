define('spec/starter_spec', ['src/JobStarter', 'src/BasicResolver'], function(JobStarter, BasicResolver) {
  describe('First test', function() {

    beforeAll(function() {
      JobStarter.setup({
        resolver: new BasicResolver()
      });
    });

    it ('this should fail', function() {
      expect(true).toBe(false);
    });

    it ('hopefully call a method', function() {
      //var starter = new JobStarter();
      JobStarter.start({
        jobPath: 'src/SimpleJob.js'
      });
    });

  });

});

define('spec/client_spec', ['src/TroubleMaker', 'src/MessageIds', 'src/ThePool'], function(TroubleMaker, MessageIds, ThePool) {

  // THis suite of tests excerises the client code and protocol while modkcing the threading..

  jasmine.DEFAULT_TIMEOUT_INTERVAL = jasmine.DEFAULT_TIMEOUT_INTERVAL * 10;

  // <editor-fold>


  function FakeWorker(options) {
    var that = this;
    this.options = options;
    setTimeout(function() {
      that.onmessage({
        data: {
          msg: MessageIds.SCRIPTLOADED,
          workerId: 'unknown'
        }
      });
    }, 500);
  }

  FakeWorker.prototype = {
    nextMsg: function() {
      var m = this.msgs.pop();
      this.postMessage({
        data: {
          msg: m.msg,
          workerId: this.workerId
        }
      });
      setTimeout(that.nextMsg.bind(that), 500);
    },
    postMessage: function(params) {
      // postMEssage is the client code calling us and we should respond with a delay...
      var that = this;
      var msg = params.msg;
      switch (msg) {
        case 1:
          this.onmessage({
            data: {
              msg: MessageIds.BASEINIT_COMPLETE,
              workerId: params.workerId
            }
          });
        case 4:
          this.onmessage({
            data: {
              msg: MessageIds.DISPATCH_COMPLETE,
              workerId: params.workerId,
              payload: this.options.payload
            }
          });
      }
    }
  };

  function FakeWorkerBaseInitError() {
    var that = this;
    setTimeout(function() {
      that.onmessage({
        data: {
          msg: MessageIds.SCRIPTLOADED,
          workerId: 'unknown'
        }
      });
    }, 500);
  }

  FakeWorkerBaseInitError.prototype = {
    postMessage: function(params) {
      var msg = params.msg;
      switch (msg) {
        case 1:
          this.onmessage({
            data: {
              msg: MessageIds.BASEINIT_ERROR,
              workerId: params.workerId,
              payload: {
                message: 'Base Init Error',
                stack: 'who knows'
              }
            }
          });
      }
    }
  }

  // </editor-fold>



  describe('Client spec', function() {
    beforeAll(function() {
      // setup promise for those who do not have it (IE)
      if (!window.Promise) {
        window.Promise = Core.Promise;
      }

      expect(function() {
        TroubleMaker.start({
          jobPath: 'src/SimpleJob.js',
          jobParams: {
            param1: 10,
            param2: 20
          }
        });
      }).toThrow();

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

      var base_url = window.location.origin;

      TroubleMaker.setup({
        fullPathToRequire: requirejsLoadUrl,
        baseUrl: base_url + '/base/',
        appPath: base_url + '/base/src/../'
      });

    });

    afterAll(function() {
      // remove singleton so it reinitializes
      var cache = require.cache;
      for (var moduleId in cache) {
        delete cache[moduleId];
      }
      //delete require.cache[require.resolve('src/TroubleMaker')];
    });

    describe('Positive', function() {
      beforeEach(function() {
        // so we do NOT reuse proxies...
        ThePool.completed.length = 0;
      });

      it ('Multi-Start', function(done) {
        var workerRequest = 0;
        spyOn(window, 'Worker').and.callFake(function() {
          workerRequest++;
          var opts = {};
          switch (workerRequest) {
            case 1:
              opts.payload = 30;
              break;
            case 2:
              opts.payload = 40;
              break;
            case 3:
              opts.payload = 50;
              break;
          }
          return new FakeWorker(opts);
        });

        expect(true).toBe(true);
        // TODO: Get Pool going for this test to pass.
        var promises = [];
        var prom1 = TroubleMaker.start({
          jobPath: 'src/SimpleJob.js',
          jobParams: {
            param1: 10,
            param2: 20
          }
        });
        promises.push(prom1);

        var prom2 = TroubleMaker.start({
          jobPath: 'src/SimpleJob.js',
          jobParams: {
            param1: 20,
            param2: 20
          }
        });
        promises.push(prom2);

        var prom3 = TroubleMaker.start({
          jobPath: 'src/SimpleJob.js',
          jobParams: {
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
          //done();
        });
      });

    });

    describe('Negative', function() {
      beforeEach(function() {
        // so we do NOT reuse proxies...
        ThePool.completed.length = 0;
      });

      it ('Exception', function(done) {
        spyOn(window, 'Worker').and.callFake(function() {
          window.Worker.and.callThrough();
          throw new Error('You passed a crap parameter');
        });

        var prom = TroubleMaker.start({
          jobPath: 'jobs/SimpleJob',
          jobParams: {
            param1: 10,
            param2: 20
          }
        });

        prom.then(function(results) {
          console.log(results);
        }).catch(function(err) {
          expect(err.message).toBe('You passed a crap parameter');
          console.error(err);
          done();
        });

      });

      it ('BASEINIT_ERROR', function(done) {

        spyOn(window, 'Worker').and.callFake(function() {
          window.Worker.and.callThrough();
          return new FakeWorkerBaseInitError();
        });

        var prom = TroubleMaker.start({
          jobPath: 'jobs/SimpleJob',
          jobParams: {
            param1: 10,
            param2: 20
          }
        });

        prom.then(function(results) {
          console.log(results);
        }).catch(function(err) {
          expect(err.message).toBe('Base Init Error');
          console.error(err);
          done();
        });
      });
    });

    it ('start when not setup', function() {
      TroubleMaker.isSetup = undefined;
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

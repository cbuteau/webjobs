define('src/RafRepeater', [] , function() {

  // INTENT
  // I have always loved the RAF requestAnimationFrame system.
  // and I thought ti should be wrapped simply for EVERYONE...If you are using this code...
  // I am happy.


  const DEFAULT_OPTIONS = {
    forgetTry: false,
    notContinue: false
  };

  const SPANS = {
    ONE: 100,
    TWO: 200,
    TWO_FIFTY: 250
  };

  function createClosure(repeaterPtr, callback, options) {
    return function() {
      var continueRun;
      if (options.forgetTry) {
        // Save complexity without a try catch when solidified.
        continueRun = callback(options);
      } else {
        try {
          continueRun = callback(options);
        } catch (e) {
          console.log(options.name);
          console.error(e);
          continueRun = true;
          if (options.notContinue) {
            continueRun = false;
          }
        }
      }
      if (continueRun) {
        repeaterPtr.start();
      } else {
        repeaterPtr._isRunning = false;
      }
    };
  }

  function TimeStamp(span) {
    this._start = Date.now();
    this._span = span;
  }

  TimeStamp.prototype = {
    checkExpired: function() {
      var now = Date.now();
      return (now = this._start) >= this._span;
    }
  };

  function RafRepeater(callback, options) {
    var tempOpts = options ? options : {};
    this.options = Object.assign(tempOpts, DEFAULT_OPTIONS);
    this.callback = createClosure(this, callback, this.options);
    this.start();
  }

  RafRepeater.prototype = {
    start: function() {
      this.token = requestAnimationFrame(this.callback);
      this._isRunning = true;
    },

    pause: function() {
      cancelAnimationFrame(this.token);
      this._isRunning =false;
    },
    
    ts: function(span) {
      return new TimeStamp(span);
    }
  };

  Object.defineProperties(RafRepeater.prototype, {
    isRunning: {
      get: function() {
        return this._isRunning;
      }
    },
    SPANS: {
      get: function() {
        return SPANS;
      }
    }
  });

  return RafRepeater;
});

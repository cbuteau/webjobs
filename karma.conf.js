// Karma configuration
// Generated on Sat Jun 09 2018 16:35:46 GMT-0400 (Eastern Daylight Time)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine', 'requirejs'],


    // list of files / patterns to load in the browser
    files: [
      { pattern: 'node_modules/jasmine-core/lib/jasmine-core/boot.js', included: false },

      'test-main.js',

      {pattern: 'src/**/*.js', included: false},
      {pattern: 'jobs/*.js', included: false},
      //'BaseThread.js',
      {pattern: 'spec/**/*.js', included: false},
      //'spec/client_spec_fails.js',
    ],


    // list of files / patterns to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress', 'spec', 'kjhtml'],


    specReporter: {
      maxLogLines: 5,             // limit number of lines logged per test
      suppressErrorSummary: true, // do not print error summary
      suppressFailed: false,      // do not print information about failed tests
      suppressPassed: false,      // do not print information about passed tests
      suppressSkipped: true,      // do not print information about skipped tests
      showSpecTiming: false,      // print the time elapsed for each spec
      failFast: false              // test would finish with error when a first fail occurs.
    },

    // add to plugins
    plugins: [
      // other plugins
      'karma-chrome-launcher',
      'karma-firefox-launcher',
      'karma-phantomjs-launcher',
      'karma-spec-reporter',
      'karma-jasmine-html-reporter',
      'karma-requirejs',
      'karma-jasmine'
    ],

    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome', 'Firefox'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,
    captureTimeout: 60000,
    browserNoActivityTimeout: 60000,
    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  })
}

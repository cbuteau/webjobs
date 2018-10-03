'use strict';

requirejs.config({
  baseUrl: '',
  paths: {
    app: '../app',
    lib: '../lib',
    src: '../src',
    text: 'text'
  },
  text: {
    useXhr: function(url, protocol, hostname, port) {
      return true;
    }
  }
});

requirejs(['testsite/site/main']);

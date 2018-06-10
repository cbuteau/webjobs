'use strict';
define('src/BasicResolver', [], function() {

  var REGEX_DOUBLE_SLASH = /[\w]\/\//;

  function BasicResolver(options) {
    this.options = options;
  }

  BasicResolver.prototype = {
    resolve: function(partialPath) {
        var current = location.origin;
        return current + (partialPath.indexOf('/') === 0 ? partialPath : '/' + partialPath);
        //return current + '/' + partialPath;
    },
    getrequirePath: function() {
      if (typeof expect === 'function') {
        return this.resolve(window.__karma__.requirePath);
      } else {
        return this.options.requirePath;
      }
    }
  }

  return BasicResolver;

});

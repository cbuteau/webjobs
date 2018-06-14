'use strict';
define('src/BasicResolver', [], function() {

  function BasicResolver(options) {
    this.options = options;
  }

  BasicResolver.prototype = {
    baseUrl: function() {
      if (this.isInJasmine()) {
        return location.origin + '/base';
      }
      return location.origin;
    },
    isInJasmine: function() {
      return typeof expect === 'function';
    },
    resolve: function(partialPath) {
        var current = location.origin;
        return current + (partialPath.indexOf('/') === 0 ? partialPath : '/' + partialPath);
    },
    getrequirePath: function() {
      if (this.isInJasmine()) {
        return this.resolve(window.__karma__.requirePath);
      } else {
        return this.options.requirePath;
      }
    }
  }

  return BasicResolver;

});

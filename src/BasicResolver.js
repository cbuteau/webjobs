define('src/BasicResolver', [], function() {

  function BasicResolver() {
  }

  BasicResolver.prototype = {
    resolve: function(partialPath) {
        var current = location.origin;
        return current + '/' + partialPath;
    }
  }

  return BasicResolver;

});

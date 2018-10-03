'use strict';
(function() {

  // load modules....instantiate...
  require(['src/TroubleMaker', 'src/BasicResolver'], function(TroubleMaker, BasicResolver) {

    var requireScriptNode = document.querySelector('#require');
    var requireScriptUrl = requireScriptNode.src;
    console.log(requireScriptUrl);

    TroubleMaker.setup({
      resolver: new BasicResolver({
        requirePath: requireScriptUrl
      }),
    });


    var addButton = document.querySelector('#addButton');

    var param1 = document.querySelector('#param1');
    var param2 = document.querySelector('#param2');

    var resultDom = document.querySelector('#result');

    addButton.addEventListener('click', function(e) {
      var prom = TroubleMaker.start({
        jobPath: '../jobs/SimpleJob',
        jobparams: {
          param1: parseInt(param1.value),
          param2: parseInt(param2.value)
        }
      });

      prom.then(function(result) {
        resultDom.innerHTML = result.toString();
      });
    });


  });
})();

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


    var addButton = document.querySelector('#simple_execButton');

    var param1 = document.querySelector('#simple_param1');
    var param2 = document.querySelector('#simple_param2');
    var paramOp = document.querySelector('#simple_paramop');

    var resultDom = document.querySelector('#simple_result');

    addButton.addEventListener('click', function(e) {
      var prom = TroubleMaker.start({
        jobPath: '../jobs/SimpleJob',
        jobparams: {
          param1: parseInt(param1.value),
          param2: parseInt(param2.value),
          op: paramOp.value
        }
      });

      prom.then(function(result) {
        resultDom.innerHTML = result.toString();
      });
    });


    var reExecButton = document.querySelector('#recurse_execButton');
    var reParamOne = document.querySelector('#recurse_param1');
    var reresultDom = document.querySelector('#recurse_result');

    reExecButton.addEventListener('click', function(e) {
      var prom = TroubleMaker.start({
        jobPath: '../jobs/RecursiveJob',
        jobparams: {
          n: parseInt(reParamOne.value),
        }
      });

      prom.then(function(result) {
        reresultDom.innerHTML = result.toString();
      });
    });


    var wsExecButton = document.querySelector('#ws_execButton');
    var wsresultDom = document.querySelector('#ws_result');

    wsExecButton.addEventListener('click', function(e) {
      var prom = TroubleMaker.start({
        jobPath: '../jobs/TimeZoneJob',
        jobparams: {
        }
      });

      prom.then(function(result) {
        wsresultDom.innerHTML = JSON.stringify(result, null, '  '); // result.toString();
      });
    });


  });
})();

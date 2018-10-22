/* uglified webjobs...good luck */
"use strict";function e(){}e.prototype={convertError:function(e){var r={message:e.message,stack:e.stack};return e.code&&(r.code=e.code),r},translateMsg:function(e){switch(e){case 0:return"BASINIT";case 1:return"BASEINIT_COMPLETE";case 2:return"BASEINIT_ERROR";case 3:return"DISPATCH";case 4:return"DISPATCH_COMPLETE";case 5:return"DISPATCH_ERROR";default:return"OMG_UNDEFINED"}}},self.helper=new e,onmessage=function(e){alert("Message received from main script");var r=e.data;switch(alert("msg:"+r.msg+" translated:"+self.helper.translateMsg(r.msg)),r.msg){case 1:alert("INIT");try{importScripts(r.requirePath),r.test,require({baseUrl:r.baseUrl,waitSeconds:20},[r.jobPath],function(e){try{self.dispatcher=new e,postMessage({msg:2,workerId:r.workerId,comment:"Initialized dispatcher"})}catch(e){postMessage({msg:3,workerId:r.workerId,comment:"Instantiation of dispatcher failed",error:self.helper.convertError(e)})}},function(e){postMessage({msg:3,workerId:r.workerId,comment:"Require of Job failed",error:self.helper.convertError(e)})})}catch(e){postMessage({msg:2,workerId:r.workerId,comment:"Require would not import.",error:self.helper.convertError(e)})}break;case 4:try{self.dispatcher.dispatch(r.workerId,r.params)}catch(e){postMessage({msg:6,error:self.helper.convertError(e)})}break;default:alert("you dropped a message on the floor.")}},postMessage({msg:0,workerId:"unknown"}),define("src/BasicResolver",[],function(){function e(e){this.options=e}return e.prototype={baseUrl:function(){return this.isInJasmine()?location.origin+"/base":location.origin},isInJasmine:function(){return"function"==typeof expect},resolve:function(e){return this.baseUrl()+(0===e.indexOf("/")?e:"/"+e)},getrequirePath:function(){return this.isInJasmine()?window.__karma__.requirePath:this.options.requirePath}},e}),define("src/DispatcherHelper",["src/MessageIds"],function(s){var e=null;function r(){if(null!==e)throw new Error("Cannot instantiate twice");this.initialize()}return r.prototype={initialize:function(){},execute:function(r,e,t){try{var s=t(r,e);this.success(r,s)}catch(e){this.fail(r,e)}},success:function(e,r){postMessage({msg:s.DISPATCH_COMPLETE,workerId:e,payload:r})},fail:function(e,r){if(r instanceof Error){var t=r;r={message:t.message,stack:t.stack}}postMessage({msg:s.DISPATCH_ERROR,workerId:e,error:r})}},r.getInstance=function(){return null===e&&(e=new r),e},r.getInstance()}),define("src/MessageIds",[],function(){var e={SCRIPTLOADED:0,BASEINIT:1,BASEINIT_COMPLETE:2,BASEINIT_ERROR:3,DISPATCH:4,DISPATCH_COMPLETE:5,DISPATCH_ERROR:6};return Object.freeze(e),e}),define("src/ThePool",["src/WorkerStates","src/WorkerProxy"],function(t,s){var e=null;function r(){this.list=[],this.completed=[],this.boundStateUpdate=this.stateUpdate.bind(this)}return r.prototype={dropoff:function(e){var r=this.list.indexOf(e);this.completed.push(e),this.list.splice(r,1)},pickup:function(e){var r;return 0<this.completed.length&&(r=this.completed.pop()),void 0===r?((r=new s(e)).subscribe("StateChanged",this.boundStateUpdate),this.list.push(r)):r.restart(e),r},stateUpdate:function(e,r){alert("id:"+r.settings.id+" state:"+e),e===t.COMPLETED&&this.dropoff(r)}},e||(e=new r),e}),define("src/TroubleMaker",["src/MessageIds","src/WorkerStates","src/ThePool","src/WorkerProxy"],function(a,i,t,s){var e=null;function r(){this.workers={}}return r.prototype={setup:function(e){this.options=e,this.requirejsBaseUrl=require.toUrl("")},start:function(e){var r=t.pickup({jobparams:e.jobparams,baseUrl:this.requirejsBaseUrl,requirePath:this.options.fullPathToRequire,jobPath:e.jobPath,timeout:e.timeout});return(this.workers[r.settings.workerId]=r).getPromise()},start_proxy:function(e){var r=this._resolve("src/BaseThread.js"),t=new s({jobparams:e.jobparams,baseUrl:this.requirejsBaseUrl,requirePath:this.options.resolver.getrequirePath(),jobPath:e.jobPath,basePath:r,timeout:e.timeout});return(this.workers[t.settings.workerId]=t).getPromise()},_workerOnMessage:function(e){var r=e.data;switch(r.msg){case a.SCRIPTLOADED:var t=this._flattenWorkers();t.sort(function(e,r){return e.startTime-r.startTime}),(o=t[0]).state=i.LOADED;for(var s=o.messages.pop();s;)o.postMessage(s),s=o.messages.pop();break;case a.BASEINIT_COMPLETE:r.workerId?((o=this.workers[r.workerId]).state=i.INITIALIZED,o.postMessage({msg:a.DISPATCH,workerId:r.workerId,params:o.jobparams})):console.error("No workerId in message");break;case a.BASEINIT_ERROR:r.workerId?((o=this.workers[r.workerId]).state=i.COMPLETED,o.reject(r.error)):console.error("No workerId in message");break;case a.DISPATCH_COMPLETE:this.workers[r.workerId].resolve(r.payload);break;case a.DISPATCH_ERROR:var o;console.error(r.error),r.workerId&&(o=this.workers[r.workerId]).reject(r.error);break;default:console.error('Response did not have valid msg code "'+r.msg)}},_resolve:function(e){return this.options.resolver.resolve(e)},_flattenWorkers:function(){var e=[];for(var r in this.workers){var t=this.workers[r];e.push(t)}return e},_cleanupWorkers:function(){}},e||(e=new r),e}),define("src/WorkerProxy",["src/WorkerStates","src/MessageIds"],function(s,o){var r=[];function a(){return""+Math.random().toString(36).substr(2,9)}function e(e){this._boundOnMessage=this.onMessage.bind(this),this.messages=[],this.callbacks=[],this.settings={},this.jobparams=e.jobparams,this.settings.state=s.STARTING,this.settings.id=function(){for(var e=a();-1!==r.indexOf(e);)e=a();return r.push(e),e}();var t=this;this._promise=new Promise(function(e,r){t.reject=r,t.resolve=e});try{this._worker=new Worker("BaseThread.js"),this._worker.onmessage=this._boundOnMessage,this.settings.startTime=Date.now(),this.settings.state=s.STARTED,this.queue({msg:o.BASEINIT,baseUrl:e.baseUrl,jobPath:e.jobPath,workerId:this.settings.id,requirePath:e.requirePath}),e.timeout&&setTimeout(function(){t.rejectReason="timeout",t.reject(new Error("Job Timeout"))},e.timeout)}catch(e){this.settings.state=s.COMPLETED,this.reject(e)}}return e.prototype={onMessage:function(e){var r=e.data;switch(r.msg){case o.SCRIPTLOADED:this.process(),this.updateState(s.STARTED);break;case o.BASEINIT_COMPLETE:this.settings.state=s.INITIALIZED,this._worker.postMessage({msg:o.DISPATCH,workerId:r.workerId,params:this.jobparams}),this.updateState(s.JOB);break;case o.BASEINIT_ERROR:this.updateState(s.COMPLETED),this.reject(r.error);break;case o.DISPATCH_COMPLETE:this.resolve(r.payload),this.updateState(s.COMPLETED);break;case o.DISPATCH_ERROR:this.reject(r.error),this.updateState(s.COMPLETED);break;default:alert("Unhandled = "+r.msg)}},queue:function(e){this.messages.push(e)},process:function(){for(var e=this.messages.pop();e;)this._worker.postMessage(e),e=this.messages.pop()},restart:function(e){var t=this;this._promise=new Promise(function(e,r){t.reject=r,t.resolve=e}),this.jobparams=e.jobparams,this.queue({msg:o.BASEINIT,baseUrl:e.baseUrl,jobPath:e.jobPath,workerId:this.settings.id,requirePath:e.requirePath}),e.timeout&&setTimeout(function(){t.rejectReason="timeout",t.reject(new Error("Job Timeout"))},e.timeout),this.process()},subscribe:function(e,r){this.callbacks.push(r)},updateState:function(e){this.settings.state=e;for(var r=0;r<this.callbacks.length;r++)this.callbacks[r](e,this)},getPromise:function(){return this._promise}},e}),define("src/WorkerStates",[],function(){var e={STARTING:0,STARTED:1,LOADED:2,INITIALIZED:3,DISPATCH:4,COMPLETED:5};return Object.freeze(e),e});
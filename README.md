
# WebJobs

## Links

+ [WebWorkers](https://developer.mozilla.org/en-US/docs/Web/API/Worker)


## Abstract

A web worker that runs small scripts with a certain interface and wraps the work in a promise.

The idea would be to figure out this mechanism and how to run tests in it as well then publish it.

So for some reason they named threads web workers in the browser so I have named this package webjobs.

So the idea is a library where you learn to kick small jobs to threading and then they notify you when it is done.

## Samples

```javascript
define('SomeProcessingModule',
  ['src/TroubleMaker'],
  function(TroubleMaker) {
    var jobPromise = TroubleMaker.start({
      jobPath: 'src/Addition',
      jobparams: {
        param1: 10,
        param2: 20
      }    
    });

    jobPromise.then(function(results) {
      console.log(results);
    }).catch(function(err) {
      console.error(err);
    });
  });
```

## TroubleMaker

At some point some night... I decided JobStarter and JobManager were too lame.
and I said who is going to start and thought TroubleMaker and the name stuck in my head.

the coolest thing is git made it easy to do this.

## Tasks

+ [x] Get basic tests running with client code running webworkers.


## Dispatching

The main key to managing a thread was devising a protocol to initialize, start, and complete work.

Each message is an int because I prefer int compares to string compares for efficiency.

Sequence

![Sequence](http://www.plantuml.com/plantuml/png/5Son4S8m30NGdYbW0QkdoYgsye-4i-KWVLtM9wbUzvPWTUReZzTksdD5Udzkv15l4Qzd-UpSicN0THfXB3g7Q4kYffnetzb2HWt2vOeay4kOeXntky3Mopy0)

Some enums that matter

![Enums](http://www.plantuml.com/plantuml/png/5Son4S8m30NGdYbW0QkdoYgsyu-4i-ISz7LUdr2zxct1wamTZzTfVUIEzF4yo2lU8bvN-PmyicN0-pJ2MFfKwIs9chBGlhE5Q0t2vOu4bXhb-fyRRB_z0G00)


And a state machine describing how a thread is managed.

![State](http://www.plantuml.com/plantuml/png/5Son4S8m30NGdYbW0QkdoYgsye-4i-MSz7LP7rEzxct1wipH7w_JjEUEzFuyo2lU8bxlyZbvPCk0wpJ2M7GEqPP4JRdHlhE5Z1g4oufaZKIKwvzki7tv0m00)


## Status

6/09/2018

Got tests running...got requirejs laoding in test not in regular browser...
upon configure of requirejs...we cannot request the job maybe we need base/


Late ... the requirejs is configured and we supposdely succeed in loading Job script but it is NOT being called.  we cannot instantiate...

6/10/2018

SO if we give the full path to the job script the importScripts() call works and we get called back but the object is null because the define does not match the url...

Very difficult problem to solve...

10/3/2018

Got testsite doing its first job.
Got different operations working...
Cleaned up some vulnerabilities.
Putting Down.

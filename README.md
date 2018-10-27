
# WebJobs

## Links

+ [WebWorkers](https://developer.mozilla.org/en-US/docs/Web/API/Worker)


## Abstract

A web worker that runs small scripts with a certain interface and wraps the work in a promise.

The idea would be to figure out this mechanism and how to run tests in it as well then publish it.

So for some reason they named threads web workers in the browser so I have named this package webjobs.

So the idea is a library where you learn to kick small jobs to threading and then they notify you when it is done.

## Things Learned

It is very import to set rules about the messages passed back and forth.
I am sure the future holds some shared memory and locks to make things easier but for now it is entirely message based.

Where the thread loads is where importScripts() starts relative paths.
Some people thought it was where you spawned the Worker() constructor but I have confirmed that it is where the actual thread script resides.

So if you load the thread from
apps/src/webjobs/MyThread.js

relative paths for importScripts() within that thread will be
apps/src/webjobs/

This is okay if you are doing development with a test website like mine but more complex for a production website.
I believe I will have to make it configurable.


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

## Usage

In the beginiing I was going to write automated tests that excercised this library.
But I found the tests would always timeout in playback and pass in debugging so I moved to a demo webstie to debug the kinks and be able to add features.

```cmd
REM this runs an express server that serves a basic test website that you can run several tests.
node scripts/server.js
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

![Sequence](http://www.plantuml.com/plantuml/svg/5Son4S8m30NGdYbW0QkdoYgsye-4i-KWVLtM9wbUzvPWTUReZzTksdD5Udzkv15l4Qzd-UpSicN0THfXB3g7Q4kYffnetzb2HWt2vOeay4kOeXntky3Mopy0)

Some enums that matter

![Enums](http://www.plantuml.com/plantuml/svg/5Son4S8m30NGdYbW0QkdoYgsyu-4i-ISz7LUdr2zxct1wamTZzTfVUIEzF4yo2lU8bvN-PmyicN0-pJ2MFfKwIs9chBGlhE5Q0t2vOu4bXhb-fyRRB_z0G00)


And a state machine describing how a thread is managed.

![State](http://www.plantuml.com/plantuml/svg/5Son4S8m30NGdYbW0QkdoYgsye-4i-MSz7LP7rEzxct1wipH7w_JjEUEzFuyo2lU8bxlyZbvPCk0wpJ2M7GEqPP4JRdHlhE5Z1g4oufaZKIKwvzki7tv0m00)


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

10/4/2018

had the idea that the test site should have 4 or more sections with testers in them.
A little tired to try coding right now.

State machine should be less states.

10/7/2018

Started looking at layout to tester.
This is what we get a new index.html with...
https://codepen.io/mozilladevelopers/pen/JrReJE

Maybe we should finally load a style sheet.

Lets get the longing recusivejob working
and then a xhr job...

We got layout of 4 grid...now we need to figure out how to keep divs in parent div.

10/11/2018

Got layout for tester webapp working.
3 separate tests working.

Next major hurdle...thread pooling and reinitializing...


10/13/2018

ThreadPooling first started working...

10/19/2018

Removed resolver dependency.
Also installed rollup() which will be our packager.
Will work on rollup later.

## 10/20/2018

Get rollup to build in a dist directory
then build website that runs off of dist.

## 10/21/2018

Rollup is discarded we will just compress with uglify.

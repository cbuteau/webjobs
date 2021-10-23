
# Status and Such

06/13/2018

Finally got simple job script to load by not giving it a name in the define().
Seems like requirejs in webworkers does not prepend any other pathing before calling importScripts()

Having trouble with a round trip to the JobStarted and back to the thread.

Putting down for a bit.

Later got code executing got our first test passing and then another one...
Trying to pony up a test with XHR...

supposedly anyone can use these endpoints for testing.

[JSON test](http://www.jsontest.com/)

WE keep inserting base to the url to the script is correct...find a not so obvious method to reolve this better...maybe requirejs.toUrl()


07/06/2018

need test site.
need to debug and understand the url problem in a real site and then get it to work in the tests.

07/10/2018

Did some coding on the workerproxy...need more code before integration...

07/12/2018

Stepping through require code in the broswer...require/define goes through this context.nameToUrl() mapper before being loaded so the name is seperate from url...we need that in Worker Context...

Think we finally figured out the requirejs baseUrl problem...committing progress

07/18/2018

Trying to get test site running with just requirejs...and some HTML elements.

8/1/2018

bootstrapper.js gets a 404...either name is wrong or something else...
renamed to main ...got main loading but can't get troublemaker loading...

Putting down

8/23/2018

Started up again...
we probably need to move index.html to the root and serve from the root for the server for the test webpage

9/4/2018

Had great idea once up and running for requirejs and ES 2015...start a branch? for a 2016+ format port.

9/21/2018
Fixed a bug in ensureId()
assign works fine.

Still not getting it started.

10/11/2018

made a lot of headway with tester and jobs.
Need to figure out why src is part of url for followup requests.
then we can use helper modules in the jobs.
Tried changing baseUrl in require config to '../src' but it did not help.

10/13/2018

Got a generic webservice job working.
next priorities...
1. Thread pooling
2. the relative paths of jobs loading...get it working with require.

8:16 PM Thread Pooling is working...

10/15/2018

Check out these worker samples to see if we can divine the pathing problem.
https://github.com/whatwg/html/tree/1332efd5e4c27ae859bf2316c6b477d77cf93716/demos
Nope they do not.

We tried moving the BaseHTread out of src and then performing inportScripts('jobs/RecursiveJob.js')
but we ended up needing the ..//
it suddenly started working...
Moving the BaseThread to the root of serving worked it out...
Going to check in a copy for now.

11:08
Trying to install puppeteer and failing.
Trying to switch to jest and new tech.
https://medium.com/ovrsea/headless-browser-testing-with-jest-and-puppeteer-2cf7d04f4af5
https://itnext.io/testing-your-javascript-in-a-browser-with-jest-puppeteer-express-and-webpack-c998a37ef887

10/17/2018

tried to get IE working...at work...
we got 2 of the jobs working but the GenericeWebSerice problems...
https://stackoverflow.com/questions/10903989/could-not-complete-the-operation-due-to-error-80020101-ie

http://mattwhite.me/blog/2010/4/21/tracking-down-error-80020101-in-internet-exploder.html

5:46
now ie is working.

11/02/1028

Figure out how to output a requirejs library.

+ [One](https://www.sitepoint.com/building-library-with-requirejs/)
+ [Two](http://spadgos.github.io/blog/2013/10/19/using-requirejs-and-make-for-standalone-libraries/)


11/14/2018

New idea...
Parse and regurgitate the define modules with a NEW pathing.
Just change the define('star/my/webmodule')

5/5/2019

Trying to publicize and publish this library either on npm or elsewhere.

Need tests and CI...
First tests fake the threading and test the client code.

Started investigating another Promise library for IE.
Found this one...but can't load it in karma.
https://cdn.jsdelivr.net/npm/es6-promise@4/dist/es6-promise.js

5/7/2019

Got client tests running...
Disabled end to end tests...

Get and error client working and add firefox into the mix.

We should have a setup option that ensures a threadpool of X threads...
Have them all run the TestJob and then go to sleep.

```Javascript
TroubleMaker.setup({
  fullPathToRequire: requirejsLoadUrl,
  baseUrl: base_url + '/base/',
  appPath: base_url + '/base/src/../'
  poolCount: 10
});
```

5/12/2019

We tried what this article said... but the tests did not run still.

https://stackoverflow.com/questions/16423156/getting-requirejs-to-work-with-jasmine

5/17/2019

Still can't get the travis build to run and pass...

Followed these hints...
https://karma-runner.github.io/0.8/plus/Travis-CI.html

Now the tests do not run on my side the karma is so old...
Stumbled on CircleCI...maybe we should try that...

9/24/2019

New idea.
Get coverage working fro this project so we can port to DS.


10/8/2019

Got some coverage working but it is hard to debug our tests.
Got HTML exporting to evaluate on desktop.
Trying to make it so we run one test but it won't
https://stackoverflow.com/questions/29150998/karma-running-a-single-test-file-from-command-line/29151264

We should rewrite the export script...so it exports to different dirs.

10/22/2019

New idea...add a progress message to the message set.

10/22/2021

Holy crap the same date AFTER covid.
This is the new idea.
WE design and implement LongRunningJobs

Also investigate a shared worker as a timeout mechanism that talks to all of the workers in the pool.

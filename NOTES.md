
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

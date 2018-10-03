
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

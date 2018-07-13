
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

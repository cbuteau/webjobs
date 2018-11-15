
var fs = require('fs');
var path = require('path');
var esprima = require('esprima');
var escodegen = require('escodegen');

// http://www.mattzeunert.com/2013/12/30/parsing-and-modifying-Javascript-code-with-esprima-and-escodegen.html

var srcfiles = fs.readdirSync('./src');
for (var i = 0; i < srcfiles.length; i++) {
  var src = srcfiles[i];
  var full= path.join(__dirname, '../src/', src);
  console.log(full);
  var data = fs.readFileSync(full, 'utf8');
  var parsed = esprima.parse(data);
  var outpath = path.join(__dirname, '../out/', path.basename(src, '.js') + '.json');
  console.log(outpath);
  fs.writeFileSync(outpath, JSON.stringify(parsed, null, 2));
}

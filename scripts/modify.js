
var fs = require('fs');
var path = require('path');
var esprima = require('esprima');
var escodegen = require('escodegen');

// http://www.mattzeunert.com/2013/12/30/parsing-and-modifying-Javascript-code-with-esprima-and-escodegen.html

/*
GOALS

parse the define and the modules to load...
get the basename of each and replace with the parameter passed in...

like src/TroubleMaker
to
.. DS/WebJobs/Troublemaker.


*/

if (process.argv.length < 5) {
  console.log('You need a parent path for the define paths');
  return;
}

var replaceparent = process.argv[2];
var replacejobs = process.argv[3];

var replaceinternals = process.argv[4];

console.log('Replace src:' + replaceparent);
console.log('Replace jobs:' + replacejobs);
console.log('Replace internals:' + replaceinternals);


function ensureDirectory(directory) {
  if (!fs.existsSync(directory)){
      fs.mkdirSync(directory);
  }
}

function findSection(struct, type, name) {
  if (struct.type === type) {
    if (struct.expression && struct.expression.callee && struct.expression.callee.name === name) {
      return struct;
    }
  }

  var keys = Object.keys(struct);
  for (var i = 0; i < keys.length; i++) {
    var sub = struct[keys[i]];
    if (Array.isArray(sub)) {
      for (var j = 0; i < sub.length; i++) {
        var arrayChild = sub[i];
        var result = findSection(arrayChild, type, name);
        if (result) {
          return result;
        }
      }
    } else {
      // if (sub.type === type) {
      //   if (sub.callee && sub.callee.name === name) {
      //     return sub;
      //   }
      // }
    }
  }
}

function remapDefinePath(definepath, newparentpath) {
  var parent = path.posix.dirname(definepath);
  var basename = path.posix.basename(definepath);

  return path.posix.join(newparentpath, basename);
}

function remapDefine(defineSegment, newparentpath) {
  for (var i = 0; i < defineSegment.expression.arguments.length; i++) {
    var arg = defineSegment.expression.arguments[i];
    if (arg.type === 'Literal') {
      arg.value = remapDefinePath(arg.value, newparentpath);
    }
    if (arg.type === 'ArrayExpression') {
      for (var j = 0; j < arg.elements.length; j++) {
        var elem = arg.elements[j];
        elem.value = remapDefinePath(elem.value, newparentpath);
      }
    }
  }
}

function processFiles(start, subdir, outsubdir, replaceParent) {
  var files = fs.readdirSync(start);
  for (var i = 0; i < files.length; i++) {
    var file = files[i];
    var full = path.join(__dirname, subdir, file);
    console.log(full);
    var data = fs.readFileSync(full, 'utf8');
    var parsed = esprima.parse(data);
    var thedefine = findSection(parsed, 'ExpressionStatement', 'define');
    if (!thedefine) {
      console.error('define NOT found failure...' + full);
      return;
    }
    remapDefine(thedefine, replaceParent);
    var outpath = path.join(__dirname, '../out/', outsubdir, path.basename(file, '.js') + '.json');
    var outpathjs = path.join(__dirname, '../out/', outsubdir, path.basename(file, '.js') + '.js');
    var outdir = path.dirname(outpath);
    var outjsdir = path.dirname(outpathjs);
    ensureDirectory(outdir);
    ensureDirectory(outjsdir);
    console.log(outpath);
    fs.writeFileSync(outpath, JSON.stringify(parsed, null, 2));
    fs.writeFileSync(outpathjs, escodegen.generate(parsed));
  }
}

ensureDirectory('./out');

processFiles('./src', '../src/', 'src', replaceparent);

processFiles('./jobs', '../jobs/', 'jobs', replacejobs);

processFiles('./internals', '../internals/', 'internals', replaceinternals);

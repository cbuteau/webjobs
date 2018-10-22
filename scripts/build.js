
var fs = require('fs');

var UglifyJS = require('uglify-js');

var code = {};
var list = fs.readdirSync('src');

for (var i = 0; i < list.length; i++) {
  var file = 'src/' + list[i];
  code[file] = fs.readFileSync(file, 'utf8');
}

// TODO build code dynamically.
// var code = {
//   'src/TroubleMaker.js': fs.readFileSync('src/TroubleMaker.js', 'utf8'),
//   'src/MessageIds.js': fs.readFileSync('src/MessageIds.js', 'utf8')
// };

var options = {
  toplevel: true,
  compress: {
      global_defs: {
          "@console.log": "alert"
      },
      passes: 2
  },
  output: {
      beautify: false,
      preamble: "/* uglified webjobs...good luck */"
  }};

var result = UglifyJS.minify(code, options);

console.log(result.error);    // runtime error, `undefined` in this case
console.log(result.warnings); // [ 'Dropping unused variable u [0:1,18]' ]
//console.log(result.code);

fs.writeFileSync('dist/src.js', result.code);

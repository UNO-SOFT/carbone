const 
    fs = require('fs'),
    util = require('util'),
    carbone = require('carbone');

const 
    { argv } = require('node:process'),
    { exit } = require('node:process');

if(argv.length < 2+3) {
    console.log('usage: template.odt result.odt {data}');
    exit(1);
}
let templateFn = '/data/' + argv[2];
let outFn = '/data/' + argv[3];
let data = JSON.parse(argv.slice(4, argv.length).join(' '));
console.log("templateFn=" + templateFn + " outFn=" + outFn + " data=" + util.inspect(data));

// Generate a report using the sample template provided by carbone module
// This LibreOffice template contains "Hello {d.firstname} {d.lastname} !"
// Of course, you can create your own templates!
carbone.render(templateFn, data, function(err, result) {
  if (err) {
    console.log(err);
    exit(2);
  }
  console.log("result: " + util.inspect(result));
  // write the result
  fs.writeFileSync(outFn, result);
});

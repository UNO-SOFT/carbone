// https://stackabuse.com/how-to-start-a-node-server-examples-with-the-most-popular-frameworks/
const 
    crypto = require('crypto'),
    fs = require('fs'),
    http = require('http'),
    os = require('os'),
    path = require('path')
    util = require('util');
const 
    busboy = require('busboy'),
    carbone = require('carbone');

// Create an instance of the http server to handle HTTP requests
let app = http.createServer((req, res) => {
console.log("method:", req.method);
    if (req.method == 'GET') {
        // Set a response type of plain text for the response
        res.writeHead(200, {'Content-Type': 'text/plain'});

        // Send back a response and end the connection
        res.end("curl URL -F template=@template.odt -F data='{data}'\n");
        return;
    }

    var files = {};
    var fields = {};
    // https://www.npmjs.com/package/busboy
    const bb = busboy({ headers: req.headers, limits: {fields: 1, files: 1} });
    bb.on('file', function(fieldname, file, info) {
        const { filename, encoding, mimeType } = info;
        console.log('File [' + fieldname + ']: filename: ' + filename + ', encoding: ' + encoding + ', mimetype: ' + mimeType);
        console.log('File [' + fieldname + '] got ' + file.length + ' bytes');
        var saveTo = path.join(os.tmpdir(), 'template-' + crypto.randomBytes(11).toString('hex') + '-' + path.basename(filename));
        file.pipe(fs.createWriteStream(saveTo));
        files[fieldname] = saveTo;
    });
    bb.on('field', function(fieldname, val, info) {
        console.log('Field [' + fieldname + ']: value: ' + val);
        fields[fieldname] = JSON.parse(val);
    });

    bb.on('finish', function() {
        console.log('Done parsing form!');
        console.log("template: " + files['template'] + ' data: ' + util.inspect(fields['data']));
        //
        // Generate a report using the sample template provided by carbone module
        carbone.render(files['template'], fields['data'], {}, function(err, result) {
            fs.unlink(files['template'], function(err) {
                if (err) {
                    return console.error(err);
                }
                console.log(files['template'] + " deleted successfully!");
            });
            if (err || !result) {
                console.log("ERROR: " + err);
                res.end();
            }
            console.log("result: " + util.inspect(result));
            //carbone.decodeOutputFilename(resultFn)
            res
              .writeHead(200, {
                'Content-Length': Buffer.byteLength(result),
                'Content-Type': 'application/zip'
              })
              .end(result);
        });
    });

    req.pipe(bb);
});

// Start the server on port 3000
app.listen(3000, '127.0.0.1');
console.log('Node server running on port 3000');



/**
 * Module dependencies.
 */
var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var https = require('https');
var fs = require('fs');
var path = require('path');
var jsdom = require("jsdom").jsdom;

var sslkey = fs.readFileSync('ssl-key.pem');
var sslcert = fs.readFileSync('ssl-cert.pem')

var options = {
    key: sslkey,
    cert: sslcert
};

var app = express();


fs.readdir(__dirname+"/MyUploads", function (err, files) { // '/' denotes the root folder
  if (err) throw err;

   files.forEach( function (file) {
     fs.lstat('/'+file, function(err, stats) {
       if (!err && stats.isDirectory()) { //condition for identifying folders
         jsdom.jQueryify(window, 'https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js', function (window, jquery) {
             window.jQuery('ul#foldertree').append('<li class="folder">'+file+'</li>');
          });
       }
       else{
          // window.$('ul#foldertree').append('<li class="file">'+file+'</li>');
          console.log(file);
      }
     });
   });

});

// all environments
app.set('port', process.env.PORT || 8443);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));


// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

app.post('/authenticate', routes.authenticate);
app.get('/authenticate', routes.upload);
//app.get('/success', routes.success);
app.post('/upload',function(req,res)
{
    // console.log(req);
    console.log(req.body);
    console.log(req.files);
    fs.readFile(req.files.displayText.path, function (err, data) {
        // ...
        // console.log('data we have got is: '+data);

        // ...
//        var newPath = __dirname + "/uploads/uploadedFileName";
//        fs.writeFile(newPath, data, function (err) {
//            res.redirect("back");
//        });


        console.log('dir name is: '+__dirname);

        var newPath = __dirname+"/MyUploads";
        console.log('req.files.displayText.originalFilename:: '+req.files.displayText.originalFilename);
        console.log('the path to which the file is to be saved is at: '+newPath+"/"+req.files.displayText.originalFilename);
        if(req.body.statusText)
            fs.writeFile(newPath+"/"+req.body.statusText+'_'+req.files.displayText.originalFilename, data, function (err) {
                res.redirect("back");
            });
        else
            fs.writeFile(newPath+"/"+req.files.displayText.originalFilename, data, function (err) {
                res.redirect("back");
            });
    });
});


https.createServer(options, app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});

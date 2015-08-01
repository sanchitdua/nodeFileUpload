var crypto = require("crypto");
var configuration = require("../configuration");

/*
 * GET home page.
 */

exports.index = function(req, res){
    var testData = require("../test-session-object.json");
    res.render('index', { title: "Test User", signedRequestJson: JSON.stringify(testData) });
};

exports.authenticate = function(req, res){
//    console.log('authenticate is invoked.... we get the request : '+JSON.stringify(req)+' along with the response : '+JSON.stringify(res));
    // console.log('authenticate is invoked.... we get the request : '+req+' along with the response : '+res);
    console.log('the request body is: '+JSON.stringify(req.body));
    var bodyArray = req.body.signed_request.split(".");
    console.log(req.body.signed_request);
    var consumerSecret = bodyArray[0];
    var encoded_envelope = bodyArray[1];
    // console.log('the consumer secret got is:   '+bodyArray[0]);
    // console.log('the encoded_envelop got is: '+bodyArray[1]);
    var check = crypto.createHmac("sha256", process.env.SECRET;).update(encoded_envelope).digest("base64");
    // console.log('check is: '+check);
    if (check === consumerSecret) {
        var envelope = JSON.parse(new Buffer(encoded_envelope, "base64").toString("ascii"));
        req.session.salesforce = envelope;
        console.log("got the session object:");
        console.log(envelope);
        res.render('index', { title: envelope.context.user.userName, signedRequestJson : JSON.stringify(envelope) });
    }
};

exports.upload = function(req, res){ // The request is coming blank because it is the get request
//    console.log('authenticate is invoked.... we get the request : '+JSON.stringify(req)+' along with the response : '+JSON.stringify(res));
    console.log('upload is invoked.... we get the request : '+req+' along with the response : '+res);
    res.render('success', { title:'Express'});
   // console.log('the request.body in upload is:: '+JSON.stringify(req.body));
    // return false;
};
//
//exports.success = function(req, res) {
//    console.log('success invoked.');
//    res.render('success',{title:'Express'});
//};

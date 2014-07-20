```
  88b 88  dP"Yb  8888b.  888888                  
  88Yb88 dP   Yb  8I  Yb 88__                    
  88 Y88 Yb   dP  8I  dY 88""                    
  88  Y8  YbodP  8888Y"  888888                  
  888888 88 88     888888                        
  88__   88 88     88__                          
  88""   88 88  .o 88""                          
  88     88 88ood8 888888                        
  88   88 88""Yb 88      dP"Yb     db    8888b.  
  88   88 88__dP 88     dP   Yb   dPYb    8I  Yb 
  Y8   8P 88"""  88  .o Yb   dP  dP__Yb   8I  dY 
  `YbodP' 88     88ood8  YbodP  dP""""Yb 8888Y"  
```

Version: 1.0 - Released July 20, 2014

*****

Imagine a world where you can write JavaScript to control events in a cloud via JSON Payloads. Yes, I said cloud. Using Salesforce(cloud) we may communicate with a very simple interface to the low level API called Canvas and nForce via Node.js.

### Node Module Dependencies

These will be automatically installed when you use the *npm* installation method below.

1. [express](http://expressjs.com/) - framework
2. [nforce](https://github.com/kevinohara80/nforce) - REST wrapper for force.com
3. [ejs](embeddedjs.com/) - the view engine

**nodeFileUpload** is a [Node JS app for hosting on Force.com Canvas Applications]
*****
## Features

* Simple API
* Signed Request

**Note**: Not all Canvas API functionality is available via the REST API.

## Installation

```bash
$ npm install
```

## Usage

Require **nforce** and **express** in your app and create a client connection to a Salesforce Remote Access Application with the `configuration.js` enabled.

Create a Canvas application in your Salesforce account with the home url: http://localhost:3001/authenticate. Let's name it node_1. After creating the application you will be given the client_id and client_secret which you need to fill in your configuration.js file.

```js
app.post('/authenticate', routes.authenticate);
```

The authenticate endpoint is invoked everytime you open / test the application in Canvas App Previewer which then throws the JSON payload like the following:
```Sample HTTP POST request body from Salesforce
{
    "userId": "005A0000000Hxu7",
    "client": {
        "oauthToken": "123222124124112",
        "instanceId": "_:node_canvas:",
        "targetOrigin": "https://na11.salesforce.com",
        "instanceUrl": "https://na11.salesforce.com"
    },
    "issuedAt": 1778141205,
    "context": {
        "application": {
            "developerName": "node_canvas",
            "referenceId": "09HG0000000Gmez",
            "applicationId": "06PG0000000GnND",
            "canvasUrl": "https://localhost:8443/authenticate",
            "name": "node_canvas",
            "version": "1.0",
            "namespace": null,
            "authType": "SIGNED_REQUEST"
        },
        "organization": {
            "organizationId": "00DA0000000HY7oMAG",
            "currencyIsoCode": "USD",
            "multicurrencyEnabled": false,
            "name": "DocuSign, Inc.",
            "namespacePrefix": null
        },
        "environment": {
            "dimensions": null,
            "locationUrl": "https://na11.salesforce.com/_ui/core/chatter/ui/ChatterPage",
            "displayLocation": "Chatter",
            "uiTheme": "Theme3",
            "version": null,
            "parameters": {}
        },
        "links": {
            "loginUrl": "https://login.salesforce.com/",
            "chatterFeedItemsUrl": "/services/data/v29.0/chatter/feed-items",
            "chatterFeedsUrl": "/services/data/v29.0/chatter/feeds",
            "chatterGroupsUrl": "/services/data/v29.0/chatter/groups",
            "chatterUsersUrl": "/services/data/v29.0/chatter/users",
            "enterpriseUrl": "/services/Soap/c/29.0/00DA0000000HY7o",
            "metadataUrl": "/services/Soap/m/29.0/00DA0000000HY7o",
            "partnerUrl": "/services/Soap/u/29.0/00DA0000000HY7o",
            "queryUrl": "/services/data/v29.0/query/",
            "recentItemsUrl": "/services/data/v29.0/recent/",
            "restUrl": "/services/data/v29.0/",
            "searchUrl": "/services/data/v29.0/search/",
            "sobjectUrl": "/services/data/v29.0/sobjects/",
            "userUrl": "/005A0000000Hxu7IAC"
        },
        "user": {
            "userId": "005A0000000Hxu7IAC",
            "userType": "STANDARD",
            "email": "test@gmail.com",
            "profileId": "00eA0000000UfYe",
            "isDefaultNetwork": true,
            "profilePhotoUrl": "https://c.na11.content.force.com/profilephoto/005/F",
            "networkId": null,
            "currencyISOCode": "USD",
            "siteUrl": null,
            "firstName": "Mike",
            "lastName": "Borozdin",
            "profileThumbnailUrl": "https://c.na11.content.force.com/profilephoto/005/T",
            "roleId": null,
            "siteUrlPrefix": null,
            "accessibilityModeEnabled": false,
            "language": "en_US",
            "timeZone": "America/Los_Angeles",
            "userName": "test@gmail.com",
            "locale": "en_US",
            "fullName": "Mike Borozdin"
        }
    },
    "algorithm": "HMACSHA256" 
  }
```

```js
exports.authenticate = function(req, res){
    var bodyArray = req.body.signed_request.split(".");
    console.log(req.body.signed_request);
    var consumerSecret = bodyArray[0];
    var encoded_envelope = bodyArray[1];
    var check = crypto.createHmac("sha256", configuration.CONSUMER_SECRET).update(encoded_envelope).digest("base64");
    if (check === consumerSecret) {
        var envelope = JSON.parse(new Buffer(encoded_envelope, "base64").toString("ascii"));
        req.session.salesforce = envelope;
        console.log("got the session object:");
        console.log(envelope);
        res.render('index', { title: envelope.context.user.userName, signedRequestJson : JSON.stringify(envelope) });
    }
};
```

The above is invoked in which we are simply checking to see if the request is coming from the correct Salesforce instance by matching the consumer_secret after decrypting the information.


After the above process succeeds we are rendering our application with the home page displaying the Browse option of FileUploading. We have a status box available there in the home page which is whenever filled and the page is submitted we are doing a chatter post in that Salesforce instance. The following javascript code executes after submitting:
```js
  $("#uploadForm").on('submit', function() {

                var statusText = $("#statusId").val();
                console.log('on submit, text = ' + statusText);

                // makes sure you use the "-" instead of "=" because otherwise the JSON
                // is escaped
//                console.log('signedRequestJson is::    '+signedRequestJson);
                var sr = <%- signedRequestJson %>;
                // Save the token
                Sfdc.canvas.oauth.token(sr.oauthToken);
                // Obtain the Sfdc connection here

                var conn = new sf.Connection({
                    instanceUrl : sr.client.targetOrigin,
                    accessToken : sr.oauthToken
                });
                // Create a record in Java_Versions__c object with the fields 
                conn.sobject("Java_Versions__c").create({ Name : 'My Account #1' }, function(err, ret) {
                    if (err || !ret.success) { return console.error(err, ret); }
                    console.log("Created record id : " + ret.id);
                    // ...
                });
                // Reference the Chatter user's URL from Context.Links object.
                var url = sr.context.links.chatterFeedsUrl + "/news/" + sr.context.user.userId + "/feed-items";
                var body = {body: {messageSegments: [
                    {type: "Text", text: statusText }
                ]}};
                Sfdc.canvas.client.ajax(url,
                        {client: sr.client,
                            method: 'POST',
                            contentType: "application/json",
                            data: JSON.stringify(body),
                            success: function (data) {
                                if (201 === data.status) {
                                    console.log("Success");
                                }
                            }
                        });
            });
```

Calling the sfdc.canvas.client.ajax sends the Ajax call to SFDC as a POST request containing our feed to be posted on behalf of this user on the feed items in Chatter.

After you use this application you will see there are no API calls consumed while doing such operations:
1. Posting the Chatter Feed.
2. Interacting with Node JS application infinitely.

The basic motivation behind using this application is to save the API calls and to save the File system storage of our Salesforce account. Alos, this application is serving as a module to my java application which is having a File Watcher to implement further modules of Java application. After submitting the file uploaded it will create a duplicate copy in the MyFolder with a prefix prepended with the status you typed in the status text box followed by '_'.

## Todo

* Indexing of Files uploaded in a Custom object.
* Write tests using nock.
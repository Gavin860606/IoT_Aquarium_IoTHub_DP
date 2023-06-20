'use strict';

const express = require('express');
var ip = require('ip');
var http = require('http'); 
var request = require('request');
var cors = require('cors');
// Constants
const HOST = ip.address();
const PORT = 3999;

// App
const app = express();
var gReqBody = {}
var server = http.createServer(app); 

var eventGridHook = function(req, res) {

  //console.dir(req.body);

  console.log('JavaScript HTTP trigger function begun');
  var validationEventType = "Microsoft.EventGrid.SubscriptionValidationEvent";

  for (var events in req.body) {
      var body = req.body[events];
      console.log('body:' + events);
      //console.dir(body);
      // Deserialize the event data into the appropriate type based on event type
      if (body.data && body.eventType == validationEventType) {
          console.log("Got SubscriptionValidation event data, validation code: " + body.data.validationCode + " topic: " + body.topic);
          // Do any additional validation (as required) and then return back the below response
          var code = body.data.validationCode;
          res.json({ status: 200, body: { "ValidationResponse": code } });
          res.status = 200;
          res.body = { "ValidationResponse": code };
          //appEventBus.emit('appHook', body);

    
          //post back //這是一個必要的動作
          var validationUrl = body.data.validationUrl;
          request(validationUrl, function(error, response, body) {
              console.log('error:', error); // Print the error if one occurred
              console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
              console.log('body:', body); // Print the HTML for the Google homepage.
          });

      } else if (body.data) {
        console.log(body.data.body)
        var msgOutput = Buffer(body.data.body,'base64').toString()
        console.dir(msgOutput);
        //gReqBody = body.data;
        gReqBody = msgOutput;
    }
  }
  res.end();
};

app.use(
  express.urlencoded({
    extended: true
  })
)

app.use(express.json())

app.use(cors());

app.get('/', (req, res) => {
    res.send(gReqBody)
    // res.send('Hello World');
  });
app.post('/api/GavinEdgeX', (req, res) => {
  console.log(req.body);
  gReqBody = req.body;
  res.send(req.body);
})

app.post('/iothub/wemos_d1', eventGridHook);

server.listen(PORT);

console.log(`Running on http://${HOST}:${PORT}`);   

setInterval(() => {
  console.log('heartbeat');
}, 30 * 1000);
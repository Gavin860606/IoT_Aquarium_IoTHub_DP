"use strict";

const express = require("express");
var ip = require("ip");
var http = require("http");
var cors = require("cors");
var moment = require("moment-timezone");
var mqttClient = require('./lib/iothub_client')
moment.tz.setDefault("Asia/Taipei");



// Constants
const HOST = ip.address();
const PORT = 80;

// App
const app = express();
var gReqBody = {};
var server = http.createServer(app);
var eventGridHook = function (req, res) {
  try {

    for (var events in req.body) {
      var body = req.body[events];
      console.log("body:" + events); 
      if (body.data) {
        console.log("body.data", body.data);
        if (body.data.body) {
          var msgOutput = Buffer(body.data.body, "base64").toString();
          console.log("body.data.body", msgOutput);
          gReqBody = JSON.parse(msgOutput);
          gReqBody['last_update'] = moment().format('YYYY-MM-DD HH:mm')
        }
      } else {
        console.log("123:", req);
        console.log("123 toString:", req.toString());
      }
    }
    res.end();
  } catch (error) {
    console.log("wemos_d1 error: ", error);
  }
};

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(express.json());

app.use(cors());

app.get("/", (req, res) => {
  try {
    res.status(200).send(gReqBody);
  } catch (error) {
    console.log("wemos_d1 error: ", error);
  }
});

app.post("/api/changefanspeed", async (req, res) => {
  try {
    let fanspeed = req.body.fanspeed
    let response = await mqttClient.IoTEdge.changeFanspeed(fanspeed)
    console.log(response);
    res.send(response);
  } catch (error) {
    console.log("wemos_d1 error: ", error);
  }
});

app.post("/api/changemode", async (req, res) => {
  try {
    let mode = req.body.mode
    let response = await mqttClient.IoTEdge.changeMode(mode)
    console.log(response);
    res.send(response);
  } catch (error) {
    console.log("wemos_d1 error: ", error);
  }
});


app.post("/iothub/wemos_d1", eventGridHook);

server.listen(PORT);

console.log(`Running on http://${HOST}:${PORT}`);



setInterval(() => {
  console.log("heartbeat");
}, 60 * 1000);

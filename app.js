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
var apiResponse = {};
var server = http.createServer(app);

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
    console.log("WemosD1 DP error:", error);
  }
});


app.post("/api/changefanspeed", async (req, res) => {
  try {
    let fanspeed = req.body.fanspeed
    let response = await mqttClient.IoTEdge.changeFanspeed(fanspeed)
    console.log(response);
    res.send(response);
  } catch (error) {
    console.log("WemosD1 DP error:", error);
  }
});

app.post("/api/changemode", async (req, res) => {
  try {
    let mode = req.body.mode
    let response = await mqttClient.IoTEdge.changeMode(mode)
    console.log(response);
    res.send(response);
  } catch (error) {
    console.log("WemosD1 DP error:", error);
  }
});


app.post("/iothub/wemos_d1", async (req, res) => {
  try {
    let response = await mqttClient.IoTEdge.eventGridHook(req ,apiResponse )
    console.log(response);
    res.send(response);
  } catch (error) {
    console.log("WemosD1 DP error:", error);
  }
});

 
server.listen(PORT);

console.log(`Running on http://${HOST}:${PORT}`);




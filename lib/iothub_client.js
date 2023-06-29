// Copyright (c) Microsoft. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

'use strict';

var Client = require('azure-iothub').Client;

var connectionString = "HostName=GavinIoTHubTest.azure-devices.net;SharedAccessKeyName=iothubowner;SharedAccessKey=9hlW7uYcipnXvIKFGI321kQwoBs3R9ElI2H2Mw6nZmo=";
if (!connectionString) {
  console.log('Please set the IOTHUB_CONNECTION_STRING environment variable.');
  process.exit(-1);
}

var targetDevice = "Aquarium";
if (!targetDevice) {
  console.log('Please give pass a device id as argument to the script (the name of the method called is methodName1 by default and can be edited directly in the script)');
  process.exit(-1);
}

var methodParams ={
    //讓function自己去複寫methodName
    methodName: null,
    payload: null,
    responseTimeoutInSeconds: 15 // set response timeout as 15 seconds
}

class MQTTClient {
    constructor(){
        this.client = Client.fromConnectionString(connectionString);
       
    }
    async cb(respnse){
        return respnse
    }
    async changeFanspeed (speed) {
        methodParams.methodName = 'ChangeFan'
        methodParams.payload = speed
        return new Promise ((resolve, reject) => {
            // invokeDeviceMethod是透過MQTT發送一個topic過去，因此Device端需要針對這個Topic回覆，否則這邊會reject error
            this.client.invokeDeviceMethod(targetDevice, methodParams, function (err, result) {
                if (err) {
                console.error('Failed to invoke method \'' + methodParams.methodName + '\': ' + err.message);
                reject(err)
                } else {
                console.log(methodParams.methodName + ' on ' + targetDevice + ':');
                console.log(JSON.stringify(result, null, 2));
                resolve(JSON.stringify(result, null, 2))
                }
            });
        })
    }
    async changeMode (mode) {
        methodParams.methodName = 'ChangeMode'
        methodParams.payload = mode
        return new Promise ((resolve, reject) => {
            // invokeDeviceMethod是透過MQTT發送一個topic過去，因此Device端需要針對這個Topic回覆，否則這邊會reject error
            this.client.invokeDeviceMethod(targetDevice, methodParams, function (err, result) {
                if (err) {
                console.error('Failed to invoke method \'' + methodParams.methodName + '\': ' + err.message);
                reject(err)
                } else {
                console.log(methodParams.methodName + ' on ' + targetDevice + ':');
                console.log(JSON.stringify(result, null, 2));
                resolve(JSON.stringify(result, null, 2))
                }
            });
        })
    }
}

// var client = Client.fromConnectionString(connectionString);

const IoTEdge = new MQTTClient()
module.exports = {
    IoTEdge
}
/*
 This is the sample send navdata of AR Drone of IBM Watson IoT
 */
var arDrone = require('ar-drone');
//var drone = arDrone.createClient();

var http = require('http');
var fs = require('fs');
var Twitter = require('twitter');
var iotfDevice = require("ibmiotf").IotfDevice;
var Cloudant = require('cloudant');

/*
 Reads the config file for getting the creds for
 1. Watson IoT
 2. Twitter
 3. Cloudant
 */
var configFile = require('./config.json');

// Variables to store the png stream
var lastPng;
var lastNavData;

var iotfConfig = configFile.iotconfig;

var twitClient = new Twitter(configFile.twitConfig);

var cloudantConfig = configFile.cloudantConfig;
var ii=0;

try {
        console.log("Drone controller start");
        console.log(configFile);
    // Initialize the cloudant instance
console.log("Connecting to iot");
    var deviceClient = new iotfDevice(iotfConfig);
//console.log("Connect to Cloudant ="+configFile.cloudantConfig.username);
//    var cloudant = Cloudant({account: cloudantConfig.username, password: cloudantConfig.password});
//console.log("Connecting db "+configFile.cloudantConfig.dbName);
//    var droneDB = cloudant.db.use(configFile.cloudantConfig.dbName);

    //connect Watson IoT
    deviceClient.connect();
    deviceClient.on('reconnect', function(){

    	console.log("Reconnected!!!");
    });

    deviceClient.on('disconnect', function(){
      console.log('Disconnected from IoTF');
    });

    deviceClient.on('error', function (argument) {
    	console.log(argument);
    });

        console.log("Trying to connect to Watson IoT ");

    deviceClient.on("connect", function () {
        console.log("Watson IoT connected")
        deviceClient.publish("connected", "json", JSON.stringify({
            "d": {
                "action":  "connected",
                "ts" : Date.now()
            }
        }));


lastNavData = {
    "isFlying": 0,
    "Battery": 85,
    "flyState": "FLYING_????",
    "controlState": "CTRL_LANDED_TEST",
    "allData": {
      "header": 1432778632,
      "droneState": {
        "flying": 0,
        "videoEnabled": 0,
        "visionEnabled": 0,
        "controlAlgorithm": 0,
        "altitudeControlAlgorithm": 1,
        "startButtonState": 0,
        "controlCommandAck": 0,
        "cameraReady": 1,
        "travellingEnabled": 0,
        "usbReady": 0,
        "navdataDemo": 1,
        "navdataBootstrap": 0,
        "motorProblem": 0,
        "communicationLost": 0,
        "softwareFault": 0,
        "lowBattery": 0,
        "userEmergencyLanding": 0,
        "timerElapsed": 0,
        "MagnometerNeedsCalibration": 0,
        "anglesOutOfRange": 0,
        "tooMuchWind": 0,
        "ultrasonicSensorDeaf": 0,
        "cutoutDetected": 0,
        "picVersionNumberOk": 1,
        "atCodecThreadOn": 1,
        "navdataThreadOn": 1,
        "videoThreadOn": 1,
        "acquisitionThreadOn": 1,
        "controlWatchdogDelay": 0,
        "adcWatchdogDelay": 0,
        "comWatchdogProblem": 0,
        "emergencyLanding": 0
      },
      "sequenceNumber": 25818,
      "visionFlag": 0,
      "demo": {
        "controlState": "CTRL_LANDED",
        "flyState": "FLYING_OK",
        "batteryPercentage": 85,
        "rotation": {
          "frontBack": -0.968,
          "pitch": -0.968,
          "theta": -0.968,
          "y": -0.968,
          "leftRight": -0.277,
          "roll": -0.277,
          "phi": -0.277,
          "x": -0.277,
          "clockwise": 83.594,
          "yaw": 83.594,
          "psi": 83.594,
          "z": 83.594
        },
        "frontBackDegrees": -0.968,
        "leftRightDegrees": -0.277,
        "clockwiseDegrees": 83.594,
        "altitude": 0,
        "altitudeMeters": 0,
        "velocity": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "xVelocity": 0,
        "yVelocity": 0,
        "zVelocity": 0,
        "frameIndex": 0,
        "detection": {
          "camera": {
            "rotation": {
              "m11": 0,
              "m12": 0,
              "m13": 0,
              "m21": 0,
              "m22": 0,
              "m23": 0,
              "m31": 0,
              "m32": 0,
              "m33": 0
            },
            "translation": {
              "x": 0,
              "y": 0,
              "z": 0
            },
            "type": 3
          },
          "tagIndex": 0
        },
        "drone": {
          "camera": {
            "rotation": {
              "m11": 0.11154055595397949,
              "m12": -0.9937372207641602,
              "m13": -0.006707361899316311,
              "m21": 0.993615984916687,
              "m22": 0.11163675785064697,
              "m23": -0.01626209355890751,
              "m31": 0.01690903678536415,
              "m32": -0.004850659519433975,
              "m33": 0.9998452663421631
            },
            "translation": {
              "x": 0,
              "y": 0,
              "z": -236
            }
          }
        }
      },
      "visionDetect": {
        "nbDetected": 0,
        "type": [
          0,
          0,
          0,
          0
        ],
        "xc": [
          0,
          0,
          0,
          0
        ],
        "yc": [
          0,
          0,
          0,
          0
        ],
        "width": [
          0,
          0,
          0,
          0
        ],
        "height": [
          0,
          0,
          0,
          0
        ],
        "dist": [
          0,
          0,
          0,
          0
        ],
        "orientationAngle": [
          0,
          0,
          0,
          0
        ],
        "rotation": [
          {
            "m11": 0,
            "m12": 0,
            "m13": 0,
            "m21": 0,
            "m22": 0,
            "m23": 0,
            "m31": 0,
            "m32": 0,
            "m33": 0
          },
          {
            "m11": 0,
            "m12": 0,
            "m13": 0,
            "m21": 0,
            "m22": 0,
            "m23": 0,
            "m31": 0,
            "m32": 0,
            "m33": 0
          },
          {
            "m11": 0,
            "m12": 0,
            "m13": 0,
            "m21": 0,
            "m22": 0,
            "m23": 0,
            "m31": 0,
            "m32": 0,
            "m33": 0
          },
          {
            "m11": 0,
            "m12": 0,
            "m13": 0,
            "m21": 0,
            "m22": 0,
            "m23": 0,
            "m31": 0,
            "m32": 0,
            "m33": 0
          }
        ],
        "translation": [
          {
            "x": 0,
            "y": 0,
            "z": 0
          },
          {
            "x": 0,
            "y": 0,
            "z": 0
          },
          {
            "x": 0,
            "y": 0,
            "z": 0
          },
          {
            "x": 0,
            "y": 0,
            "z": 0
          }
        ],
        "cameraSource": [
          0,
          0,
          0,
          0
        ]
      }
    }
  };

        setInterval(function () {
          console.log("Checking for drone data every 2sec | Battery =  "+lastNavData.Battery +"| state= "+lastNavData.allData.droneState);
            if (deviceClient.isConnected && lastNavData.allData.droneState) {
                //publish drone event every 2 sec
              //  console.log("Sending data "+JSON.stringify(lastNavData));
                deviceClient.publish("status", "json", JSON.stringify({
                    "d": {
                      lastNavData
                    }
                }));

            }
            // upload a png stream to cloudant every 2 sec to get the live stream
            if (lastPng != null) {
                var time = Math.floor(new Date());
                droneDB.insert({created: time, payload: lastPng}, time.toString(), function (err, body) {
                    if (!err)
                        console.log(body)
                });
            }

            if (ii == 100)
              ii=0;
            ii++;
                  lastNavData.Battery =ii;

        }, 2000);

    });

    //Receive commands from Watson IoT to control the drone
    //act based on the name of the command
    deviceClient.on("command", function (commandName, format, payload, topic) {
console.log("Got a message in "+format);
      console.log(topic);
      msg = JSON.parse(payload);
  console.log(msg);//JSON.stringify(payload));
        if (commandName === "Tweet") {
            console.log("Tweet command received");
                console.log("Tweeting :"+msg.d.message);

          twitClient.post('statuses/update', {status: msg.d.message +" Level="+lastNavData.demo.batteryPercentage},  function(error, tweet, response) {
                  if(error) throw error;
                //  console.log(tweet);  // Tweet body.
              //    console.log(response);  // Raw response object.
                });

          //  tweetPic(payload.toString());
        } else if (commandName === "TakeOff") {
            console.log("Take OFF!!!");

           //  drone.disableEmergency();
          //  drone.takeoff();
        } else if (commandName === "Land") {
            console.log("Land!!!");
            //drone.land();
        } else if (commandName === "Clock") {
            console.log("Turn Clockwise for 1 sec!!!");
            //drone.stop();
            //drone.clockwise(1);
            //drone.after(1000, function () {
            //    this.stop();
            //});
        } else if (commandName === "CounterClock") {
            console.log("Turn CounterClockwise for 1 sec !!!");
            //drone.stop();
            //drone.counterClockwise(1);
            //drone.after(1000, function () {
            //    this.stop();
            //});
        } else {
            console.log("Command not supported.. " + commandName);
        }

    });

    // run a local server to view the image locally
    var server = http.createServer(function (req, res) {
        if (!lastPng) {
            res.writeHead(503);
            res.end('Did not receive any png data yet.');
            return;
        }
        res.writeHead(200, {'Content-Type': 'image/png'});
        res.end(lastPng);
    });

    var PORT = 8080;

    server.listen(PORT, function () {
        console.log("Server listening on: http://localhost:%s", PORT);
    });


    function tweetPic(payload) {

        var msg = payload || 'Tweeted from Drone!!!';

        // Make post request on media endpoint. Pass file data as media parameter
        twitClient.post('media/upload', {media: lastPng}, function (error, media, response) {
            console.log("media upload");
            if (!error) {

                // If successful, a media object will be returned.
                console.log("media upload successful");

                // Lets tweet it
                var status = {
                    status: msg,
                    media_ids: media.media_id_string // Pass the media id string
                }

                twitClient.post('statuses/update', status, function (error, tweet, response) {
                    if (!error) {
                        console.log("Tweet successful");
                        return;
                    } else {
                        console.log("Twitter error status :" + error);
                        return;
                    }
                });

            } else {
                console.log("Twitter error : " + error);
                return;
            }

        });
    }
/* no drone yet
    //drone functions
    drone.on('navdata', function (data) {

        if (data) {
            lastNavData = data;
        }

    });

    drone.config('video:video_channel', 0);

    var pngStream = drone.getPngStream();

    pngStream.on('data', function (data) {
        lastPng = data;
    });
*/

} catch (err) {
  console.log("Error = "+err);
  //  drone.stop();
  //  drone.land();
}

process.on('SIGINT', function () {
    console.log("Disconnecting the client");
    deviceClient.disconnect();
  //  drone.stop();
//    drone.land();
    process.exit();
});

process.on('uncaughtException', function (err) {
    console.log('Caught exception: ' + err);
  //  drone.stop();
//    drone.land();
    process.exit();
});

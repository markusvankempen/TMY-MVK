/*
 This is the sample for controlling AR Drone with IBM Watson IoT

 @author - jeffdare
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

try {
        console.log("Drone controller start");
        console.log(configFile);
    // Initialize the cloudant instance
console.log("Connectind to iot");
    var deviceClient = new iotfDevice(iotfConfig);

//    var cloudant = Cloudant({account: cloudantConfig.user, password: cloudantConfig.password});
console.log("Connect to Cloudant");
//    var droneDB = cloudant.db.use(configFile.cloudantConfig.dbName);

    //connect Watson IoT
    deviceClient.connect();

    deviceClient.on("connect", function () {
        console.log("Watson IoT connected")
        setInterval(function () {
  console.log("Checking IoT connected")
            if (deviceClient.isConnected && lastNavData && lastNavData.droneState && lastNavData.demo) {
                //publish drone event every 2 sec
                deviceClient.publish("status", "json", JSON.stringify({
                    "d": {
                        "isFlying": lastNavData.droneState.flying,
                        "Battery": lastNavData.demo.batteryPercentage,
                        "flyState": lastNavData.demo.flyState,
                        "controlState": lastNavData.demo.controlState
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
        }, 2000);

    });

    //Receive commands from Watson IoT to control the drone
    //act based on the name of the command
    deviceClient.on("command", function (commandName, format, payload, topic) {

        if (commandName === "Tweet") {
            console.log("Tweet command received");
            tweetPic(payload.toString());
        } else if (commandName === "TakeOff") {
            console.log("Take OFF!!!");
            drone.takeoff();
        } else if (commandName === "Land") {
            console.log("Land!!!");
            drone.land();
        } else if (commandName === "Clock") {
            console.log("Turn Clockwise for 1 sec!!!");
            drone.stop();
            drone.clockwise(1);
            drone.after(1000, function () {
                this.stop();
            });
        } else if (commandName === "CounterClock") {
            console.log("Turn CounterClockwise for 1 sec !!!");
            drone.stop();
            drone.counterClockwise(1);
            drone.after(1000, function () {
                this.stop();
            });
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
    drone.stop();
    drone.land();
}

process.on('SIGINT', function () {
    console.log("Disconnecting the client");
    //deviceClient.disconnect();
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

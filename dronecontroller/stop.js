/*
Use this when you want to stop the drone.
Useful when the node module crashes.
 */
var arDrone = require('ar-drone');
var client  = arDrone.createClient();

try {

    console.log("Stopping");

    client.stop();
    client.land();


    client
        .after(1000, function() {
            this.stop();
            this.land();
        });

} catch(err) {
    client.stop();
    client.land();
}
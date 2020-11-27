const dotenv = require('dotenv');
const fs = require('fs');
const mqtt = require('async-mqtt');
const { PushRegisterService, PushClient, HttpService, sleep } = require('eufy-node-client');

dotenv.config();
const USRNAME = process.env.USRNAME;
const PASSWRD = process.env.PASSWRD;
const MQTT_BROKER_URL = process.env.MQTT_BROKER_URL;
if (!USRNAME || !PASSWRD || !MQTT_BROKER_URL) {
  throw new Error(`Please fill in 'USRNAME' & 'PASSWRD' & 'MQTT_BROKER_URL' values in your .env-file!`);
}

const main = async () => {
  console.log('Starting...');

  // Connecting to mqtt
  console.log(`Connecting to: ${MQTT_BROKER_URL}...`);
  const mqttClient = await mqtt.connectAsync(MQTT_BROKER_URL);
  console.log(`MQTT connected!`);

  let credentials = null;
  // Check if credentials are existing
  if (fs.existsSync('credentials.json')) {
    console.log('Credentials found');
    credentials = JSON.parse(fs.readFileSync('credentials.json').toString());
  } else {
    // Register push credentials
    throw new Error("Missing credentials.json. Use eufy-node-client-examples to get this.")
  }

  // Start push client
  const pushClient = await PushClient.init({
    androidId: credentials.checkinResponse.androidId,
    securityToken: credentials.checkinResponse.securityToken,
  });
  pushClient.connect((msg) => {
    console.log('Got push message:', msg);
    payload = JSON.parse(msg.payload.doorbell)
    forwarded = false
    if (payload.event_type == 3102){ //"Someone is at your door"
      data = payload.event_time + "," + payload.pic_url
      topic = "olympus/frontdoor/doorbell/presence"
      mqttClient.publish(topic, data);
      forwarded = true
    }
    else if (payload.event_type == 3103){ //doorbell ring
      data = payload.event_time + "," + payload.pic_url
      topic = "olympus/frontdoor/doorbell/ring"
      mqttClient.publish(topic, data);
      forwarded = true
    }
    if (forwarded){
      console.log("Forwarded push to mqtt", topic, data)
    }
   });

  // Register at eufy
  const fcmToken = credentials.gcmResponse.token;
  const httpService = new HttpService(USRNAME, PASSWRD);
  await httpService.registerPushToken(fcmToken);
  console.log('Registered at eufy with:', fcmToken);

  setInterval(async () => {
    await httpService.pushTokenCheck();
  }, 30 * 1000);
};

main();

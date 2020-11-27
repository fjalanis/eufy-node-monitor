# eufy-node-monitor

This repository focuses on exposing mqtt services for eufy camera hijacking push notifications using https://github.com/JanLoebel/eufy-node-client (based on https://github.com/JanLoebel/eufy-node-client-examples)

## Getting started
```
# Clone the repository
git clone https://github.com/fjalanis/eufy-node-monitor

# Change into the cloned directory
cd eufy-node-monitor

# Install dependencies
npm install

# Create .env-file via example and fill out USRNAME, PASSWD, and MQTT_BROKER_URL
cp .env.example .env

# Create push credentials
node get-push-credentials.js

# Run push notification to mqtt conversions
node push-mqtt.js
```

### push-logging
To receive push notifications we have to simulate an android device and register at FCM/GCM. We should only register once, so the example saves registered credentials and is reusing them on rerun. After we have credentials we can start listening on FCM/GCM and tell eufy to send push notifications for your account to this credentials.

Execute: `node examples/push-logging/index.js` 

### push-mqtt
This example shows how to forward received push messages to a simple mqtt-broker like `eclipse-mosquitto`. Afterwards you can consume this message with another client (e.g. nodered / iobroker / ...). Please provide the mqtt-broker-url in your `.env`-file. Most of the code is equal to the `push-logging`-example.

Execute: `node examples/push-mqtt/index.js` 

**Full credit to https://github.com/JanLoebel**

I just rearranged some files to make it more friendly to run on my server
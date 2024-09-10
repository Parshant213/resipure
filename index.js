import mongoose from 'mongoose';
import EventEmitter from 'events';
import mqtt from 'mqtt';
import dotenv from 'dotenv';
const MONGO_URI = process.env.MONGO_URI;
// Initialize environment variables
dotenv.config();

// Setup event emitter
const event = new EventEmitter();
dotenv.config();

const config = {
    port: process.env.MQTT_PORT,
    clientId: "mqttjs_" + (Math.floor(Math.random() * Date.now() + 1 )),
    username: process.env.MQTT_USER,
    password: process.env.MQTT_USER_PASS,
};
var mqttClient = mqtt.connect(process.env.MQTT_URL,config);
mqttClient.on('connect', function(){
    console.log('<----MQTT Server Connected---->');
  });
  mqttClient.on("message", async function (topic, message) {
      event.emit(topic, message.toString());
  });
export const handler = async (event)=>{

    const payload = json.stringify(event);
   
    
    try {
        // const  mongoDb = await mongoose.connect(MONGO_URI,{
        //     useNewUrlParser: true,
        //     useUnifiedTopology: true,
        // });
 
        // if(mongoDb){
        //     console.log('Connected to MongoDB');
        // }
        const pulishTopic = 'resipureControls';
        mqttClient.pulish(pulishTopic ,payload,(err)=>{
            if(err) console.error(err);
            else console.log(`Message published to ${pulishTopic}`);
        });
        
        mqttClient.subscribe(pulishTopic);
        const mqttResponse = eventWithTimeout(event, subscribeTopic, 3000)
        .then((data) => {
            console.log('Promise resolved with data');
            return data;
        })
        .catch((error) => {
            console.error('Promise rejected with error:', error);
            return JSON.stringify(error);
        });
        const response = await mqttResponse;
        const apiRes = {
            statusCode:200,
            body:response
        }
        return apiRes;
    } catch (error) {
        console.log(error);
    }
}

function eventWithTimeout(event, topic, timeout) {
    return new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
            reject({msg: 'Timeout: No data received within the specified time'});
        }, timeout);

        event.once(topic, (data) => {
            clearTimeout(timer); // Clear the timeout to prevent the rejection
            resolve(data);
        });
    });
}

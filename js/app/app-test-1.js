const err = require('ModuleAppError');
require('ModuleAppMath').is();

const ClassMiddleActuator = require('ModuleActuator');
const ClassServo          = require('ModuleServo');

const act_props = {
    id: "id-servo-0",
    name: "Servo",
    type: "actuator",
    channelNames: ["position"],
    typeInSignal: ["analog"],
    quantityChannel: 1,
    busTypes: []
};

const servo = new ClassServo(act_props, { pins: [P2], range:180, minPulse: 0.5, maxPulse:2.5 }).GetChannel(0);

let flag = false;
setInterval(() => {
    let pos = flag ? 0 : 1;
    flag = !flag;

    servo.On(pos);
}, 2000);
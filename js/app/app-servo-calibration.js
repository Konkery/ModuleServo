const input = (str) => str;

function getAngleOffset(N) {
    let offsets = new Array(N);
    let real_angle = undefined;     
    let pos = 0;                    //начальная позиция
    for (let i = 1; i <= N; i++) {
        servo.On(pos);
        // TODO: проверить нужен ли тут таймаут
        // ввод значения фактического угла
        console.log('Put real angle value to "real_angle" variable');
        while (!real_angle) {       
            offsets.push(pos * servo._Range - real_angle);
            real_angle = undefined;
            console.log(`${i}. input: ${real_angle}`);
        }
        pos = pos + 0.5 >= 1 ? 0 : pos + 0.5; //следующая позиция
    }
    // расчет среднего арифметического оффсета
    return offsets.reduce((pr, curr) => pr+curr, 0)/offsets.length;
}
function angleToUs(pos) {
    return proportion(pos, 0, opts.range, opts.minPulse, opts.maxPulse);
}
//Настройка передаваемых объектов
let servoProps = {
    name: "FT5519M",
    type: "actuator",
    channelNames: ["angle"],
    typeInSignals: ["digital"],
    quantityChannel: 1,
    manufacturingData: {
        IDManufacturing: [
            { "Adafruit": "" }  
        ],
        IDsupplier: [
            { "Adafruit": "" }  
        ],
        HelpSens: "Servo"
    }
};

const opts = {
    pins: [P2],     
    range: 120,
    minPulse: 0.9,  
    maxPulse: 2.1, 
    startPos: 0     
}
/************************* Main ************************* */
const ClassAppError       = require('ModuleAppError.min.js');
const ClassMiddleActuator = require('ModuleActuator.min');
const ClassServo          = require('ModuleServo.min.js');
let servo = new ClassServo(opts, servoProps).GetChannel(0);
let N = undefined;
//ввести количество итераций N
while (typeof N !== 'number' || N <= 0) { }
let offset = getAngleOffset(N);
let us_offset = opts.minPulse - angleToUs(Math.abs(offset));
console.log(`calculated offset: ${us_offset}`);


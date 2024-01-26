function testPulseDur(pin, pulseDur) {
    let interval_period = 20;
    let int = setInterval(() => {
        digitalPulse(pin, 1, pulseDur)
    }, interval_period);

    setTimeout(() => {
        clearInterval(int)
    }, 800);
}

function startCalibration(pin, minPulse, maxPulse) {
    if (typeof minPulse !== 'number' || minPulse <= 0) { 
        console.log('Given min pulse value is negative or not a number at all');
        return;
    }
    if (typeof maxPulse !== 'number' || maxPulse <= 0) { 
        console.log('Given max pulse value is negative or not a number at all');
        return;
    }
    testPulseDur(pin, minPulse);
    console.log('Servo in min position');
    setTimeout(() => {
        testPulseDur(pin, (maxPulse+minPulse)/2);
        console.log('Servo in mid position');
    }, 3000);
    setTimeout(() => {
        testPulseDur(pin, maxPulse);
        console.log('Servo in max position');
    }, 6000);
    setTimeout(() => {
        console.log('Done! Call "startCalibration" method again to try another pulse dur values');
    }, 9000);
}

/************************* Main ************************* */
// don't forget to assign appropriate values to variables below 
let pin = P2;               
let min_pulse = 0.9;
let max_pulse = 0.21;

startCalibration(pin, min_pulse, max_pulse);

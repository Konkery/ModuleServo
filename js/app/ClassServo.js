/**
 * @class
 * Класс предназначен для обеспечения управления различными моделями сервоприводов с удержанием угла. Позволяет осуществлять инициализацию и управление сервоприводом в соответствии с его характеристиками: возмоные углы поворота, мин. и макс. длины импульса, положение по-умолчанию.   
 */
class ClassServo extends ClassMiddleActuator {
    /**
     * @constructor
     * @param {ActuatorPropsType} _opts 
     * @param {ActuatorOptsType} _opts
     */
    constructor(_actuatorProps, _opts) {
        ClassMiddleActuator.call(this, _actuatorProps, _opts);
        /******************** Validation and init ********************** */
        if (typeof _opts.maxRange !== 'number' || 
            typeof _opts.maxPulse !== 'number' ||
            typeof _opts.minPulse !== 'number') throw new Error('Some args are missing');
        if (_opts.minRange && typeof _opts.minRange !== 'number' ||
            _opts.minRange >= _opts.maxRange ||
            _opts.minPulse >= _opts.maxPulse ||
            _opts.startPos && typeof _opts.startPos !== 'number' ||
            _opts.startPos < _opts.minRange || 
            _opts.startPos > _opts.maxRange) throw new Error('Invalid arg');

        this._MinRange = _opts.minRange || 0;   
        this._MaxRange = _opts.maxRange;
        this._MaxPulse = _opts.maxPulse;
        this._MinPulse = _opts.minPulse;
        this._StartPos = _opts.startPos || this._MinRange;
        this._LastInput = undefined;
        this.Reset();
        /******************** Modifying channel *************************** */
        let channel = this.GetChannel(0);
        // Инициализация геттера, который возвращает положение сервопривода в углах
        Object.defineProperty(channel, 'Position', {
            get: () => this._LastInput
        });
    }

    On(_chNum, _deg) {
        if (typeof _deg !== 'number') throw new Error('Invalid arg');

        let deg = E.clip(_deg, this._MinRange, this._MaxRange);
        if (_deg !== deg) throw new Error('Invalid degree value');
        //функция преобразует число, пропорционально приводя его к одного диапазона к другому
        //пример: proportion(5, 0, 10, 10, 20) -> 15 
        const proportion = (x, in_low, in_high, out_low, out_high) => {
            return (x - in_low) * (out_high - out_low) / (in_high - in_low) + out_low;
        }
        const freq = 50;    //частота ШИМа
        const msec = proportion(deg, this._MinRange, this._MaxRange, this._MinPulse, this._MaxPulse);   //градусы -> длина импульса в мс
        const val = proportion(msec, 0, 20, 0, 1);  //мс -> число [0 : 1] (на практике приблизительно [0.027 : 0.12])
        
        this._IsChOn[0] = true;
        analogWrite(this._Pins[0], val, { freq: freq, soft: false });   //ШИМ
        this._LastInput = deg;  //сохраняется последний корректный ввод
    }
    Off() {
        digitalWrite(this._Pins[0], 1);     //прерывание ШИМа
        this._IsChOn[0] = false;
    }
    Reset() {
        this.On(this._StartPos);      //установка сервопривода в стандартное положение
    }
}
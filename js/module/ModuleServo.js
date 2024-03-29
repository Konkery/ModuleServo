/**
 * @class
 * Класс предназначен для обеспечения управления различными моделями сервоприводов с удержанием угла. Позволяет осуществлять инициализацию и управление сервоприводом в соответствии с его характеристиками: возможные углы поворота, мин. и макс. длины импульса, положение по-умолчанию.   
 */
class ClassServo extends ClassMiddleActuator {
    /**
     * @constructor
     * @param {ActuatorPropsType} _actuatorProps 
     * @param {ActuatorOptsType} _opts
     */
    constructor(_actuatorProps, _opts) {
        ClassMiddleActuator.call(this, _actuatorProps, _opts);
        /******************** Validation and init ********************** */
        if (typeof _opts.range !== 'number' || 
            typeof _opts.maxPulse !== 'number' ||
            typeof _opts.minPulse !== 'number') throw new Error('Some args are missing');
        if (_opts.range < 0 ||
            _opts.minPulse >= _opts.maxPulse ||
            _opts.startPos && typeof _opts.startPos !== 'number' ||
            _opts.startPos < 0 || 
            _opts.startPos > _opts.range) throw new Error('Invalid arg');

        this._Range = _opts.range;
        this._MaxPulse = _opts.maxPulse;
        this._MinPulse = _opts.minPulse;
        this._StartPos = _opts.startPos || 0;
        this._Position = undefined;

        // this.Reset();
    }

    On(_chNum, _pos) {
        if (typeof _pos !== 'number') throw new Error('Invalid arg');

        let pos = E.clip(_pos, 0, 1);
        if (_pos !== pos) throw new Error('Invalid degree value');
        //функция преобразует число, пропорционально приводя его к одного диапазона к другому
        //пример: proportion(5, 0, 10, 10, 20) -> 15 
        const proportion = (x, in_low, in_high, out_low, out_high) => {
            return (x - in_low) * (out_high - out_low) / (in_high - in_low) + out_low;
        }
        const freq = 50;    //частота ШИМа
        const msec = proportion(pos, 0, 1, this._MinPulse, this._MaxPulse);   //процент -> длина импульса в мс
        const val = proportion(msec, 0, 20, 0, 1);  //мс -> число [0 : 1] (на практике приблизительно [0.027 : 0.12])
        
        this._IsChOn[0] = true;
        analogWrite(this._Pins[0], val, { freq: freq, soft: false });   //ШИМ
        this._Position = pos;               //значение позиции записывается в поле класса
    }
    Off() {
        digitalWrite(this._Pins[0], 1);     //прерывание ШИМа
        this._IsChOn[0] = false;
    }
    Reset() {
        this.On(0, this._StartPos);            //установка сервопривода в стандартное положение
    }
    /**
     * @method
     * Метод возвращает объект, содержащий информацию о текущей позиции сервопривода
     * Примечание: метод возвращает данные, зависящие от последней команды, полученной сервоприводом; потому если он не был надлежащим образом откалиброван, либо его положение было изменено в обход методов, представленных в ModuleServo, полученные значения вероятно не будут соответствовать действительности
     * @returns 
     */
    GetInfo() {
        return ({
            currPos: this._Position, 
            currPosAngle: this._Position * this._Range
        });
    }
}
exports = ClassServo
<div style = "font-family: 'Open Sans', sans-serif; font-size: 16px">

# ModuleServo

<div style = "color: #555">
    <p align="center">
    <img src="./res/logo.png" width="400" title="hover text">
    </p>
</div>

## Лицензия

<div style = "color: #555">

В разработке
</div>

## Описание
<div style = "color: #555">

Модуль предназначен для прикладной работы с PDW сервоприводами в рамках фреймворка EcoLight и обеспечивает следующий функционал:
- Инициализацию и идентификацию различных моделей сервоприводов в соответствии с их характеристиками;
- Управление положением сервопривода, путём поворота его вала на допустимый угол;
Примечание: корректная инициализация модуля в соответствии с характеристиками используемого сервопривода гарантирует, что недопустимые команды будут отклоняться;
- Хранение информации о текущей позиции сервопривода;
- Возврат вала сервопривода в стандартное положение, заданное пользователем.

Модуль разработан в соответствии с [архитектурой актуаторов](https://github.com/Konkery/ModuleActuator/blob/main/README.md), соответственно, *ClassServo* наследует и реализует является функционал *ClassMiddleActuator*, а прикладная работа с данным модулем выполняется через *ClassChannelActuator*, который обеспечивает унифицированный интерфейс.

</div>

## Конструктор
<div style = "color: #555">

В соответствии с подходом, заложенным ModuleActuator, конструктор принимает 1 объект типа **ActuatorOptsType** и 1 объект типа **ActuatorPropsType** (подробнее по [ссылке](https://github.com/Konkery/ModuleActuator/blob/fork-nikita/README_ANCESTOR.md#%D0%BA%D0%BE%D0%BD%D1%81%D1%82%D1%80%D1%83%D0%BA%D1%82%D0%BE%D1%80)).
Пример *_actuatorProps* типа [**ActuatorOptsType**](https://github.com/Konkery/ModuleActuator/blob/main/README.md):
```js
let _actuatorProps = {
    name: "FS90",
    type: "actuator",
    channelNames: ["position"],
    typeInSignals: ["analog"],
    quantityChannel: 1,
    manufacturingData: {
        IDManufacturing: [
            { "Feetech": "unknown" }  
        ],
        IDsupplier: [
            { "Robotehnika": "14000615" }  
        ],
        HelpSens: "PWM servo"
    }
};
```
Пример *_opts* типа [**ActuatorOptsType**](https://github.com/Konkery/ModuleActuator/blob/main/README.md):
```js
const _opts = {
    pins: [P2],       //массив пинов
    range: 180,       //диапазон поворота вала сервопривода
    minPulse: 0.544,  //мин. импульс
    maxPulse: 2.4,    //макс. импульс
    startPos: 0       //начальная позиция
}
```

Важнейшими параметрами здесь являются величины minPulse и maxPulse, равные длине импульса, который необходимо подавать на пин для удержания сервопривода в минимальном и максимальном положении. Эти значения можно найти в спецификации (даташите) конкретной модели сервопривода, однако они часто расходятся с фактическими мин. и макс. значениями импульсов. 

Для быстрого и удобного определения корректных minPulse и maxPulse можно воспользоваться [программой](./js/app/app-servo-calibration-1.js) для калибровки, которая покажет как работает сервопривод при разных значениях minPulse и maxPulse. Необходимо просто постепенно изменять предполагаемый диапазон этих величин пока вал сервопривода не начнет точно попадать в нулевое, максимальное и среднее между ними возможные положения.       


</div>

### Поля
<div style = "color: #555">

- <mark style="background-color: lightblue">_Range</mark> - диапазон работы сервопривода. Также соответствует максимальному углу, который который может занять актуатор;
- <mark style="background-color: lightblue">_MinPulse</mark> - длина импульса, задающего минимальное положение вала;
- <mark style="background-color: lightblue">_MaxPulse</mark> - длина импульса, задающего максимальное положение вала;
- <mark style="background-color: lightblue">_DefaultPos</mark> - величина в градусах, определяющая стандартное положение вала;
- <mark style="background-color: lightblue">_Position</mark> - последняя позиция, принятая сервоприводом.
</div>

### Методы
<div style = "color: #555">

- <mark style="background-color: lightblue">On(_chNum, _pos)</mark> - выполняет поворот вала сервопривода в указанное положение. При работе через канал, аргумент *_chNum* пропускается;
- <mark style="background-color: lightblue">Off()</mark> - прекращает удержание угла сервоприводом;
- <mark style="background-color: lightblue">Reset()</mark> - устанавливает вал сервопривода его в начальное положение, заданное через конструктор либо определяемое минимальной величиной из диапазона *_Range*;
- <mark style="background-color: lightblue">GetPosition()</mark> - возвращает объект, содержащий информацию о текущей позиции сервопривода. 
Примечание: метод возвращает данные, которые определяются последней командой, полученной модулем, а тк же характеристиками, указанными при инициализации. Поэтому если положение вала сервопривода было изменено в обход методов, представленных в ModuleServo, полученные значения вероятно не будут соответствовать действительности.

</div>

### Примеры
<div style = "color: #555">
Пример программы c управлением сервоприводом:

```js
//Подключение необходимых модулей
const ClassAppError       = require('ModuleAppError.min.js');
const ClassMiddleActuator = require('ModuleActuator.min');
const ClassServo          = require('ModuleServo.min.js');

//Настройка передаваемых объектов
let servoProps = {
    name: "FS90",
    type: "actuator",
    channelNames: ["position"],
    typeInSignals: ["analog"],
    quantityChannel: 1,
    manufacturingData: {
        IDManufacturing: [
            { "Feetech": "unknown" }  
        ],
        IDsupplier: [
            { "Robotehnika": "14000615" }  
        ],
        HelpSens: "PWM servo"
    }
};

const opts = {
    pins: [P2],       
    range: 180,       
    minPulse: 0.544,  
    maxPulse: 2.4,    
    startPos: 0       
}
//Создание объекта класса
//Так как у серво только один канал, сразу сохраняем ссылку на него
let servo = new ClassServo(opts, servoProps).GetChannel(0);

//Смена положения с 0° до 180° и обратно по интервалу  
let flag = false;
setInterval(() => {
    let pos = flag ? 0 : 1;
    flag = !flag;

    servo.On(pos);
}, 2000);
```
В результате выполнения программы сервопривод начнет менять положение от минимального до максимального с интервалом в секунды.

<!-- <div align='center'>
    <img src='./res/example-1.png'>
</div> -->

</div>

### Зависимости
<div style = "color: #555">

- <mark style="background-color: lightblue">[ModuleActuator](https://github.com/Konkery/ModuleActuator/blob/main/README.md)</mark>
- <mark style="background-color: lightblue">[ClassAppError](https://github.com/Konkery/ModuleAppError/blob/main/README.md)</mark>
</div>

</div>

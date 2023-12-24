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
- Управления положением сервопривода, путём поворота его вала на допустимый угол.
Примечание: корректная инициализация модуля в соответствии с характеристиками используемого сервопривода гарантирует, что команды, которые могут навредить прибору, будут отклоняться;
- Хранение информации о текущей позиции сервопривода;
- Перезагрузку актуатора, возвращением его вала в стандартное положение.
Модуль разработан в соответствии с [архитектурой актуаторов](https://github.com/Konkery/ModuleActuator/blob/main/README.md) и является потомком класса *ClassMiddleActuator*.

</div>

## Конструктор
<div style = "color: #555">

В соответствии с подходом, заложенным ModuleActuator, конструктор принимает 1 объект типа **ActuatorOptsType** и 1 объект типа **ActuatorPropsType** (подробнее по [ссылке](https://github.com/Konkery/ModuleActuator/blob/fork-nikita/README_ANCESTOR.md#%D0%BA%D0%BE%D0%BD%D1%81%D1%82%D1%80%D1%83%D0%BA%D1%82%D0%BE%D1%80)).
Пример *_actuatorProps* типа [**ActuatorOptsType**](https://github.com/Konkery/ModuleActuator/blob/main/README.md):
```js
let _actuatorProps = {
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
```
Пример *_opts* типа [**ActuatorOptsType**](https://github.com/Konkery/ModuleActuator/blob/main/README.md):
```js
const _opts = {
    pins: [A0],     //массив пинов
    minRange: 0,    //мин. угол
    maxRange: 120,  //макс. угол
    minPulse: 0.9,  //мин. импульс
    maxPulse: 2.1,  //макс. импульс
    startPos: 0     //начальная позиция
}

```

</div>

### Поля
<div style = "color: #555">

- <mark style="background-color: lightblue">_MinRange</mark> - минимальный угол, на который может поворачиваться вал сервопривода. По-умолчанию равен 0;
- <mark style="background-color: lightblue">_MaxRange</mark> - максимальный угол, который который может занять вал;
- <mark style="background-color: lightblue">_MinPulse</mark> - длина импульса, задающего минимальное положение вала;
- <mark style="background-color: lightblue">_MaxPulse</mark> - длина импульса, задающего максимальное положение вала;
- <mark style="background-color: lightblue">_DefaultPos</mark> - величина в градусах, определяющая стандартное положение вала;
- <mark style="background-color: lightblue">_LastInput</mark> - последнее значение, переданное в метод On(_deg). Внутреннее свойство модуля, не предназначенное для того, чтобы пользователь работал с ним напрямую.
</div>

### Методы
<div style = "color: #555">

- <mark style="background-color: lightblue">On(_chNum, _deg)</mark> - выполняет поворот вала сервопривода в указанное положение. При работе через канал, аргумент *_chNum* пропускается;
- <mark style="background-color: lightblue">Off()</mark> - прекращает удержание угла сервоприводом;
- <mark style="background-color: lightblue">Reset()</mark> - устанавливает вал сервоприпода его в начальное положение, заданное через конструктор либо равное мин.возможному.
</div>

### Примеры
<div style = "color: #555">
Пример программы для:

```js
//Подключение необходимых модулей
const ClassAppError       = require('ModuleAppError.min.js');
const ClassMiddleActuator = require('ModuleActuator.min');
const ClassServo          = require('ModuleServo.min.js');

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
    minRange: 0, 
    maxRange: 120,
    minPulse: 0.9,  
    maxPulse: 2.1, 
    startPos: 0     
}
//Создание объекта класса
//Так как у серво только один канал, сразу сохраняем ссылку на него
let servo = new ClassServo(servo, sensor_props).GetChannel(0);

//Смена положения с 25° до 110° и обратно по интервалу  
let flag = false;
setInterval(() => {
    let angle = flag ? 25 : 110;
    flag = !flag;

    servo.On(angle)
}, 2000);
```
Результат выполнения:
<div align='center'>
    <img src='./res/example-1.png'>
</div>

</div>

### Зависимости
<div style = "color: #555">

- <mark style="background-color: lightblue">[ModuleActuator](https://github.com/Konkery/ModuleActuator/blob/main/README.md)</mark>
- <mark style="background-color: lightblue">[ClassAppError](https://github.com/Konkery/ModuleAppError/blob/main/README.md)</mark>
</div>

</div>

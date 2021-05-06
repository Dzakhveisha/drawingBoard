const canvas = document.getElementById("board");  // поиск нужного канваса
const ctx = canvas.getContext("2d");  // присваиваем контекст

let shapeType = "lineByPen";
let shapesArray = [];
let tempElement;

let colorWell;
let curColor = "#000000";
window.addEventListener("load", startup, false);

const sendBtn = document.querySelector('#send');
const messages = document.querySelector('#messages');
const messageBox = document.querySelector('#messageBox');
let ws;


//////////////////////////////////////////////chat//////////////////////////////////////////////////////////////////////
function showMessage(message) {
    let div = document.createElement('div');
    div.className = "sms notMy";
    let p = document.createElement('p');
    p.className = "smsContent";
    p.innerHTML = `${message}`;
    div.appendChild(p);
    messages.append(div);
    messages.scrollTop = messages.scrollHeight;
    messageBox.value = '';
}

function showMyMessage(message) {
    let div = document.createElement('div');
    div.className = "sms my";
    let p = document.createElement('p');
    p.className = "smsContent";
    p.innerHTML = `${message}`;
    div.appendChild(p);
    messages.append(div);
    messages.scrollTop = messages.scrollHeight;
    messageBox.value = '';
}

function init() {
    if (ws) {
        ws.onerror = ws.onopen = ws.onclose = null;
        ws.close();
    }
    ws = new WebSocket('ws://localhost:6969');
    ws.onopen = () => {
        console.log('Connection opened!');
    }
    ws.onmessage = ({ data }) => {
        let dataType = data.slice(0, data.indexOf('.') + 1);  //определяем тип данных
        data = data.slice(data.indexOf('.') + 1);

        if (dataType === "sms."){
            showMessage(data);     // сообщение в чат
        } else {
            let color = data.slice(0, data.indexOf('.'));  // выделение цвета
            data = data.slice(data.indexOf('.') + 1);

            switch (dataType) {
                case "rectangle.": {
                    let x1 = parseInt(data.slice(0, data.indexOf('.')));  // выделение координат
                    data = data.slice(data.indexOf('.') + 1);
                    let y1 = parseInt(data.slice(0, data.indexOf('.')));
                    data = data.slice(data.indexOf('.') + 1);
                    let x2 = parseInt(data.slice(0, data.indexOf('.')));
                    data = data.slice(data.indexOf('.') + 1);
                    let y2 = parseInt(data.slice(0, data.indexOf('.')));
                    data = data.slice(data.indexOf('.') + 1);

                    shapesArray.push(new Rectangle(x1, y1, x2, y2, color));
                    }
                    break;
                case "circle.": {
                    let x1 = parseInt(data.slice(0, data.indexOf('.')));  // выделение координат
                    data = data.slice(data.indexOf('.') + 1);
                    let y1 = parseInt(data.slice(0, data.indexOf('.')));
                    data = data.slice(data.indexOf('.') + 1);
                    let x2 = parseInt(data.slice(0, data.indexOf('.')));
                    data = data.slice(data.indexOf('.') + 1);
                    let y2 = parseInt(data.slice(0, data.indexOf('.')));
                    data = data.slice(data.indexOf('.') + 1);

                    shapesArray.push(new Circle(x1, y1, x2, y2, color));
                    }
                    break;
                case "line.":
                    let x1 = parseInt(data.slice(0, data.indexOf('.')));  // выделение координат
                    data = data.slice(data.indexOf('.') + 1);
                    let y1 = parseInt(data.slice(0, data.indexOf('.')));
                    data = data.slice(data.indexOf('.') + 1);
                    let x2 = parseInt(data.slice(0, data.indexOf('.')));
                    data = data.slice(data.indexOf('.') + 1);
                    let y2 = parseInt(data.slice(0, data.indexOf('.')));
                    data = data.slice(data.indexOf('.') + 1);

                    shapesArray.push(new Line(x1, y1, x2, y2, color));
                    break;
                case "lineByPen.": {
                    let x = parseInt(data.slice(0, data.indexOf('.')));  // выделение координат
                    data = data.slice(data.indexOf('.') + 1);
                    let y = parseInt(data.slice(0, data.indexOf('.')));  // выделение координат
                    data = data.slice(data.indexOf('.') + 1);
                    let tmpLine = new LineByPen(x,y,color);
                    while (data.length !== 0) {
                          let x = parseInt(data.slice(0, data.indexOf('.')));  // выделение координат
                          data = data.slice(data.indexOf('.') + 1);
                          let y = parseInt(data.slice(0, data.indexOf('.')));  // выделение координат
                          data = data.slice(data.indexOf('.') + 1);
                          tmpLine.addPoint(x,y);
                        }
                      shapesArray.push(tmpLine);
                     }
                    break;
            }
        }
    };
    ws.onclose = function() {
        ws = null;
    }
}

document.getElementById('forSend').onsubmit = function(evt) {
    evt.preventDefault();  // отмена автоматической отправки формы
};
function sendMSG() {
    if (!ws) {
        alert("No WebSocket connection :(");
        return ;
    }
    ws.send("sms." + messageBox.value);
    showMyMessage(messageBox.value);
}
init();

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function startup() {
    colorWell = document.querySelector("#colorPick");
    colorWell.addEventListener("input", updateFirst, false);
    colorWell.select();
}
function updateFirst(event) {
    curColor = event.target.value;
}

class Shape {                      // общий класс какой-либо фигуры
    constructor(x1,y1, x2, y2, color) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        this.color = color;
    }
    draw(){
    }
}

class Rectangle extends Shape{  //прямоугольник, наследующийся от Shape
    draw(){
        let highY;
        let leftX;
        if (this.y1 < this.y2) {
            highY = this.y1
        }
            else {
            highY = this.y2;
        }
        if (this.x1 < this.x2) {
            leftX = this.x1
        }
        else{
            leftX = this.x2;
        }
        ctx.strokeStyle = this.color;
        ctx.fillStyle = this.color;
        ctx.fillRect(leftX, highY, Math.abs(this.x2 - this.x1), Math.abs(this.y2 - this.y1));
    }
}
class Circle extends Shape{  //круг, наследующийся от Shape
    draw(){
        let highY;
        let leftX;
        if (this.y1 < this.y2) {
            highY = this.y1
        }
        else {
            highY = this.y2;
        }
        if (this.x1 < this.x2) {
            leftX = this.x1
        }
        else{
            leftX = this.x2;
        }
        ctx.strokeStyle = this.color;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(leftX + Math.abs(this.x2 - this.x1)/2 , highY + Math.abs(this.y2 - this.y1)/2, Math.abs(this.x2 - this.x1)/2, 0 ,Math.PI*2); // Внешняя окружность
        ctx.fill();
        ctx.stroke();
    }
}
class Line extends Shape{  //прямая, наследующийся от Shape
    draw(){
        ctx.strokeStyle = this.color;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.moveTo(this.x1,this.y1);
        ctx.lineTo(this.x2,this.y2);
        ctx.stroke();
    }
}

class  LineByPen{
    constructor(x, y, color) {
        this.pointsArray = new Array();
        this.pointsArray.push(x);
        this.pointsArray.push(y);
        this.color = color;
    }
    draw(){
        ctx.strokeStyle = this.color;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.moveTo(this.pointsArray[0], this.pointsArray[1] );
        let i = 2;
        while ( i < this.pointsArray.length  )
        {
            ctx.lineTo(this.pointsArray[i], this.pointsArray[i+1]);
            i += 2
        }
        ctx.stroke();
        ctx.closePath();
    }
    addPoint(x, y){
        this.pointsArray.push(x);
        this.pointsArray.push(y);
    }
}

// requestAnimationFrame
(function() {
    var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
        window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
    window.requestAnimationFrame = requestAnimationFrame;
})();
function repaintBoard() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let shape of shapesArray) {
        shape.draw();
    }
    if (tempElement != null) {
        tempElement.draw();
    }
    requestAnimationFrame(repaintBoard);
}
window.requestAnimationFrame(repaintBoard);


function drawRectangle(){
    shapeType = "rectangle"
}
function drawCircle(){
    shapeType = "circle"
}
function drawLine(){
    shapeType = "line"
}
function drawByPen(){
    shapeType = "lineByPen"
}
function drawText(){
    shapeType = "Text"
}
function drawImage(){
    shapeType = "Image"
}

canvas.addEventListener("mousedown", ev => {
    switch (shapeType){
        case "rectangle":
            tempElement = new Rectangle(ev.pageX - canvas.offsetLeft,ev.pageY - canvas.offsetTop, ev.pageX - canvas.offsetLeft, ev.pageY - canvas.offsetTop, curColor);
            break;
        case "circle":
            tempElement = new Circle(ev.pageX - canvas.offsetLeft,ev.pageY - canvas.offsetTop, ev.pageX - canvas.offsetLeft, ev.pageY - canvas.offsetTop, curColor);
            break;
        case "line":
            tempElement = new Line(ev.pageX - canvas.offsetLeft,ev.pageY - canvas.offsetTop, ev.pageX - canvas.offsetLeft, ev.pageY - canvas.offsetTop, curColor);
            break;
        case "lineByPen":
            tempElement = new LineByPen(ev.pageX - canvas.offsetLeft,ev.pageY - canvas.offsetTop, curColor);
            break;
    }
})
canvas.addEventListener("mousemove", ev => {
    if (tempElement != null) {
        if (tempElement instanceof Shape) {
            tempElement.x2 = ev.pageX - canvas.offsetLeft;
            tempElement.y2 = ev.pageY - canvas.offsetTop;
        }
        else{
            tempElement.addPoint( ev.pageX - canvas.offsetLeft,  ev.pageY - canvas.offsetTop);
        }
    }
})
canvas.addEventListener("mouseup", ev => {
    if (tempElement != null) {
        if (tempElement instanceof Shape) {
            tempElement.x2 = ev.pageX - canvas.offsetLeft;
            tempElement.y2 = ev.pageY - canvas.offsetTop;
        }
        else{
            tempElement.addPoint( ev.pageX - canvas.offsetLeft,  ev.pageY - canvas.offsetTop);
        }
        shapesArray.push(tempElement);

        if (!ws) {
            alert("No WebSocket connection :(");
        }
        else{
            let data = shapeType +"." + tempElement.color + ".";
            if (shapeType === "lineByPen") {
                tempElement.pointsArray.forEach( function each(x){
                    data += x + ".";
                })

            }
            else{
                data += tempElement.x1 + "." + tempElement.y1 + "." + tempElement.x2 + "." + tempElement.y2 + ".";
            }
            ws.send(data);
        }

        tempElement = null;
    }
})

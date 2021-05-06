const canvas = document.getElementById("board");  // поиск нужного канваса
const ctx = canvas.getContext("2d");  // присваиваем контекст

let shapeType = "lineByPen";
let shapesArray = [];
let tempElement;

let colorWell;
let curColor = "#000000";

window.addEventListener("load", startup, false);
function startup() {
    colorWell = document.querySelector("#colorPick");
    colorWell.addEventListener("input", updateFirst, false);
    colorWell.select();
}
function updateFirst(event) {
    curColor = event.target.value;
}

class Shape {     // общий класс какой-либо фигуры
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

class  LineByPen{      // линия из точек
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


function drawRectangle(){          //выбор текущей рисуемой фигуры
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

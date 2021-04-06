const canvas = document.getElementById("board");  // поиск нужного канваса
const ctx = canvas.getContext("2d");  // присваиваем контекст

let shapeType = "lineByPen";
let shapesArray = [];
let tempElement;

let  colorWell;
let curColor = "#000000";
window.addEventListener("load", startup, false);

let socket = new WebSocket("wss://");

function startup() {
    colorWell = document.querySelector("#colorPick");
    colorWell.addEventListener("input", updateFirst, false);
    colorWell.select();
}
function updateFirst(event) {
    curColor = event.target.value;
}

class Shape {                      // общий класс какой-либо фигуры
    constructor(x1,y1, x2, y2) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        this.color = curColor;
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
        ctx.moveTo(this.x1,this.y1);
        ctx.lineTo(this.x2,this.y2);
        ctx.stroke();
    }
}

class  LineByPen{
    constructor(x, y) {
        this.pointsArray = new Array();
        this.pointsArray.push(x);
        this.pointsArray.push(y);
        this.color = curColor;
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
function drawEllipse(){
    shapeType = "ellipse"
}
function drawLine(){
    shapeType = "line"
}
function drawByPen(){
    shapeType = "lineByPen"
}

canvas.addEventListener("mousedown", ev => {
    switch (shapeType){
        case "rectangle":
            tempElement = new Rectangle(ev.pageX - canvas.offsetLeft,ev.pageY - canvas.offsetTop, ev.pageX - canvas.offsetLeft, ev.pageY - canvas.offsetTop);
            break;
        case "ellipse":
            tempElement = new Circle(ev.pageX - canvas.offsetLeft,ev.pageY - canvas.offsetTop, ev.pageX - canvas.offsetLeft, ev.pageY - canvas.offsetTop);
            break;
        case "line":
            tempElement = new Line(ev.pageX - canvas.offsetLeft,ev.pageY - canvas.offsetTop, ev.pageX - canvas.offsetLeft, ev.pageY - canvas.offsetTop);
            break;
        case "lineByPen":
            tempElement = new LineByPen(ev.pageX - canvas.offsetLeft,ev.pageY - canvas.offsetTop);
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
        tempElement = null;
    }
})

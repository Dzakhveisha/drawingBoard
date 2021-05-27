import * as connect from './socketConnection.js';

const canvas = document.getElementById("board");  // поиск нужного канваса
const ctx = canvas.getContext("2d");  // присваиваем контекст
ctx.font = "30px Verdana";
export let textX;
export let textY;
export let imgX;
export let imgY;


let shapeType = "lineByPen";
export let shapesArray = [];
let tempElement;

let colorWell;
export let curColor = "#000000";

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
    constructor(x1, y1, x2, y2, color) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        this.color = color;
    }

    draw() {
    }
}

export class MyText {
    constructor(text, x, y, color) {
        this.x = x;
        this.y = y;
        this.text = text;
        this.color = color;
        this.type = "text";
    }

    draw() {
        ctx.strokeStyle = this.color;
        ctx.strokeText(this.text, this.x, this.y);
    }
}

export class MyImg {
    constructor(img, x, y) {
        this.x = x;
        this.y = y;
        this.img = img;
        this.type = "image";
    }

    draw() {
        ctx.drawImage(this.img, this.x, this.y)
    }
}

class Rectangle extends Shape {  //прямоугольник, наследующийся от Shape
    draw() {
        this.type = "rectangle";
        let highY;
        let leftX;
        if (this.y1 < this.y2) {
            highY = this.y1
        } else {
            highY = this.y2;
        }
        if (this.x1 < this.x2) {
            leftX = this.x1
        } else {
            leftX = this.x2;
        }
        ctx.strokeStyle = this.color;
        ctx.fillStyle = this.color;
        ctx.fillRect(leftX, highY, Math.abs(this.x2 - this.x1), Math.abs(this.y2 - this.y1));
    }
}

class Circle extends Shape {  //круг, наследующийся от Shape
    draw() {
        this.type = "circle";
        let highY;
        let leftX;
        if (this.y1 < this.y2) {
            highY = this.y1
        } else {
            highY = this.y2;
        }
        if (this.x1 < this.x2) {
            leftX = this.x1
        } else {
            leftX = this.x2;
        }
        ctx.strokeStyle = this.color;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(leftX + Math.abs(this.x2 - this.x1) / 2, highY + Math.abs(this.y2 - this.y1) / 2, Math.abs(this.x2 - this.x1) / 2, 0, Math.PI * 2); // Внешняя окружность
        ctx.fill();
        ctx.stroke();
    }
}

class Line extends Shape {  //прямая, наследующийся от Shape
    draw() {
        this.type = "line";
        ctx.strokeStyle = this.color;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.moveTo(this.x1, this.y1);
        ctx.lineTo(this.x2, this.y2);
        ctx.stroke();
    }
}

class LineByPen {      // линия из точек
    constructor(x, y, color) {
        this.pointsArray = new Array();
        this.pointsArray.push(x);
        this.pointsArray.push(y);
        this.color = color;
        this.type = "lineByPen";
    }

    draw() {
        ctx.strokeStyle = this.color;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.moveTo(this.pointsArray[0], this.pointsArray[1]);
        let i = 2;
        while (i < this.pointsArray.length) {
            ctx.lineTo(this.pointsArray[i], this.pointsArray[i + 1]);
            i += 2
        }
        ctx.stroke();
        ctx.closePath();
    }

    addPoint(x, y) {
        this.pointsArray.push(x);
        this.pointsArray.push(y);
    }
}

// requestAnimationFrame
(function () {
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

document.querySelector('#drawRectangle').onclick = function () {         //выбор текущей рисуемой фигуры
    shapeType = "rectangle"
}

document.querySelector('#drawCircle').onclick = function () {
    shapeType = "circle"
}

document.querySelector('#drawLine').onclick = function () {
    shapeType = "line"
}

document.querySelector('#drawByPen').onclick = function () {
    shapeType = "lineByPen"
}

document.querySelector('#drawText').onclick = function () {
    shapeType = "text"
}

document.querySelector('#drawImage').onclick = function () {
    shapeType = "image"
}

canvas.addEventListener("mousedown", ev => {
    switch (shapeType) {
        case "rectangle":
            tempElement = new Rectangle(ev.pageX - canvas.offsetLeft, ev.pageY - canvas.offsetTop, ev.pageX - canvas.offsetLeft, ev.pageY - canvas.offsetTop, curColor, "rectangle");
            break;
        case "circle":
            tempElement = new Circle(ev.pageX - canvas.offsetLeft, ev.pageY - canvas.offsetTop, ev.pageX - canvas.offsetLeft, ev.pageY - canvas.offsetTop, curColor, "circle");
            break;
        case "line":
            tempElement = new Line(ev.pageX - canvas.offsetLeft, ev.pageY - canvas.offsetTop, ev.pageX - canvas.offsetLeft, ev.pageY - canvas.offsetTop, curColor, "line");
            break;
        case "lineByPen":
            tempElement = new LineByPen(ev.pageX - canvas.offsetLeft, ev.pageY - canvas.offsetTop, curColor, "lineByName");
            break;
        case "text":
            textX = (ev.pageX - canvas.offsetLeft);
            textY = (ev.pageY - canvas.offsetTop);
            document.getElementById("modalForText").showModal();
            break;
        case "image":
            imgX = (ev.pageX - canvas.offsetLeft);
            imgY = (ev.pageY - canvas.offsetTop);
            document.getElementById("modalForImage").showModal();
            break;

    }
})

canvas.addEventListener("mousemove", ev => {
    if (tempElement != null) {
        if (tempElement instanceof Shape) {
            tempElement.x2 = ev.pageX - canvas.offsetLeft;
            tempElement.y2 = ev.pageY - canvas.offsetTop;
        } else if (tempElement instanceof LineByPen) {
            tempElement.addPoint(ev.pageX - canvas.offsetLeft, ev.pageY - canvas.offsetTop);
        }
    }
})

canvas.addEventListener("mouseup", ev => {
    if (tempElement != null && !(tempElement instanceof MyText)) {
        if (tempElement instanceof Shape) {
            tempElement.x2 = ev.pageX - canvas.offsetLeft;
            tempElement.y2 = ev.pageY - canvas.offsetTop;
        } else if (tempElement instanceof LineByPen) {
            tempElement.addPoint(ev.pageX - canvas.offsetLeft, ev.pageY - canvas.offsetTop);
        }
        shapesArray.push(tempElement);

        let data = JSON.stringify(tempElement);
            switch (shapeType) {
                case "rectangle":
                    connect.socket.emit("rectangle", data);
                    break;
                case "circle":
                    connect.socket.emit("circle", data);
                    break;
                case "line":
                    connect.socket.emit("line", data);
                    break;
                case "lineByPen":
                    connect.socket.emit("lineByPen", data);
                    break;
    }

    tempElement = null;
}
})

connect.socket.on('rectangle', (data) => {
    let dataAr = JSON.parse(data);
    shapesArray.push(new Rectangle(parseInt(dataAr["x1"]), parseInt(dataAr["y1"]), parseInt(dataAr["x2"]),
        parseInt(dataAr["y2"]), dataAr["color"]));
});
connect.socket.on('circle', (data) => {
    let dataAr = JSON.parse(data);
    shapesArray.push(new Circle(parseInt(dataAr["x1"]), parseInt(dataAr["y1"]), parseInt(dataAr["x2"]),
        parseInt(dataAr["y2"]), dataAr["color"]));
});
connect.socket.on('line', (data) => {
    let dataAr = JSON.parse(data);
    shapesArray.push(new Line(parseInt(dataAr["x1"]), parseInt(dataAr["y1"]), parseInt(dataAr["x2"]),
        parseInt(dataAr["y2"]), dataAr["color"]));
});
connect.socket.on('lineByPen', (data) => {
    let dataAr = JSON.parse(data);
    let pointsArray = dataAr["pointsArray"];
    let tmpLine = new LineByPen(pointsArray[0], pointsArray[1], dataAr["color"]);
    for (let i = 2; i < (pointsArray.length - 2); i += 2) {
        tmpLine.addPoint(pointsArray[i], pointsArray[i + 1]);
    }
    shapesArray.push(tmpLine);
})
connect.socket.on("text", (data) => {
    let dataAr = JSON.parse(data);
    shapesArray.push(new MyText(dataAr["text"], parseInt(dataAr["x"]), parseInt(dataAr["y"]), dataAr["color"]));
})
connect.socket.on("image", (data) => {
    let dataAr = JSON.parse(data);
    let image = new Image();
    image.src = "data:image/png;base64," + dataAr["img"];
    shapesArray.push(new MyImg(image,dataAr["x"],dataAr["y"]));
})

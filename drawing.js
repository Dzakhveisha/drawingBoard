const canvas = document.getElementById("board");  // поиск нужного канваса
const ctx = canvas.getContext("2d");  // присваиваем контекст

let shapesArray = [];
let tempElement;

class Shape {                      // общий класс какой-либо фигуры
    constructor(x1,y1, x2, y2) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
    }
    draw(){
    }
}

class Rectangle extends Shape{  //прямоугольник, наследующийся от Shape
    draw(){
        super.draw();
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
        ctx.fillRect(leftX, highY, Math.abs(this.x2 - this.x1), Math.abs(this.y2 - this.y1));
    }
}

function repaintBoard(){   // функция перерисовки доски
    ctx.clearRect(0,0, 1000, 500); // clear
    for (let shape of shapesArray) {
        shape.draw();
    }
    if (tempElement != null) {
        tempElement.draw();
    }
}


canvas.addEventListener("mousedown", ev => {
    tempElement = new Rectangle(ev.pageX - canvas.offsetLeft,ev.pageY - canvas.offsetTop, ev.pageX - canvas.offsetLeft, ev.pageY - canvas.offsetTop);
})

canvas.addEventListener("mousemove", ev => {
    if (tempElement != null) {
        tempElement.x2 = ev.pageX - canvas.offsetLeft;
        tempElement.y2 = ev.pageY - canvas.offsetTop;
        repaintBoard();
    }
})

canvas.addEventListener("mouseup", ev => {
    tempElement.x2 = ev.pageX - canvas.offsetLeft;
    tempElement.y2 = ev.pageY - canvas.offsetTop;

    shapesArray.push(tempElement);
    tempElement = null;
    repaintBoard();
})
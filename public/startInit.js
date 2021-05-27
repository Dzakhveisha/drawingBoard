import * as connect from './socketConnection.js';
import * as drawing from './drawing.js';

let NAME;

document.getElementById("modalForInit").showModal();

window.onunload = () => {
    connect.socket.emit("exit", JSON.stringify({name: NAME, id: id}));
}

document.getElementById('getName').onsubmit = function (evt) {
    evt.preventDefault();  // отмена автоматической отправки формы
};
document.getElementById('getText').onsubmit = function (evt) {
    evt.preventDefault();  // отмена автоматической отправки формы
};
document.getElementById('getImage').onsubmit = function (evt) {
    evt.preventDefault();  // отмена автоматической отправки формы
};

document.querySelector('#setName').onclick = function () {
    NAME = document.getElementById("nameInput").value;
    if (NAME === "") {
        NAME = "anonymous";
    }
    document.getElementById("modalForInit").close();
    connect.socket.emit("new", (JSON.stringify({name: NAME})));
};

document.querySelector('#setText').onclick = function (ev) {
    let text = document.getElementById("textInput").value;
    let textObj = new drawing.MyText(text, drawing.textX, drawing.textY, drawing.curColor);
    drawing.shapesArray.push(textObj);
    let data = JSON.stringify(textObj);
    connect.socket.emit("text", data);
    document.getElementById("modalForText").close();
};

document.querySelector('#cancelText').onclick = function () {
    document.getElementById("modalForText").close();
};


document.querySelector('#setImage').onclick = function (e) {
    let file = document.getElementById("imageInput").files[0];
    let img = new Image;
    let reader = new FileReader();

    img.onload = function () {
        let imgObj = new drawing.MyImg(img, drawing.imgX, drawing.imgY);
        drawing.shapesArray.push(imgObj);
    }
    img.src = URL.createObjectURL(file);

    reader.onload = function (event) {
        let data = event.target.result.replace("data:" + file.type + ";base64,", '');
        connect.socket.emit("image",JSON.stringify({ x: drawing.imgX, y: drawing.imgY, img: data}));
    }
    reader.readAsDataURL(file);

    document.getElementById("modalForImage").close();
};

document.querySelector('#cancelImage').onclick = function () {
    document.getElementById("modalForImage").close();
};
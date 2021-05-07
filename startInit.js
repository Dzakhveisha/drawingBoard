let NAME;


document.getElementById("modalForInit").showModal();

window.onunload = () => {
    ws.send(JSON.stringify({type: "exit", name: NAME}));
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
    ws.send(JSON.stringify({type: "new", name: NAME}));
};

document.querySelector('#setText').onclick = function (ev) {
    let text = document.getElementById("textInput").value;
    let textObj = new MyText(text, textX, textY, curColor);
    shapesArray.push(textObj);
    if (!ws) {
        alert("No WebSocket connection :(");
    } else {
        let data = JSON.stringify(textObj);
        ws.send(data);
    }
    document.getElementById("modalForText").close();
};

document.querySelector('#cancelText').onclick = function () {
    document.getElementById("modalForText").close();
};




document.querySelector('#setImage').onclick = function (e) {
    let file = document.getElementById("imageInput").files[0];
    let img = new Image;
    let  reader = new FileReader();

    img.onload = function() {
        let imgObj = new MyImg(img, imgX,imgY);
        shapesArray.push(imgObj);
    }
    img.src = URL.createObjectURL(file);

    reader.onload = function(event) {
        let data = event.target.result.replace("data:" + file.type + ";base64,", '');
        if (!ws) {
            alert("No WebSocket connection :(");
        } else {
            ws.send(JSON.stringify({type: "image", x: imgX,  y: imgY, img: data}));
        }
    }
    reader.readAsDataURL(file);

    document.getElementById("modalForImage").close();
};

document.querySelector('#cancelImage').onclick = function () {
    document.getElementById("modalForImage").close();
};
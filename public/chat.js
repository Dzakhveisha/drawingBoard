const messages = document.querySelector('#messages');
const messageBox = document.querySelector('#messageBox');
let ws;
let id;
let isFirst;

document.getElementById('forSend').onsubmit = function (evt) {
    evt.preventDefault();  // отмена автоматической отправки формы
};
initWS(); //инициализация веб-сокетов


function sendMSG() {
    if (!ws) {
        alert("No WebSocket connection :(");
        return;
    }
    ws.send(JSON.stringify({type: "sms", sender: NAME, text: messageBox.value}));
    showMyMessage(messageBox.value);
}

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

function showMessageAbout(message, str) {
    let div = document.createElement('div');
    div.style.margin = "5px";
    let p = document.createElement('p');
    p.className = "smsContent";
    p.innerHTML = `${message}` + str;
    div.appendChild(p);
    messages.append(div);
    messages.scrollTop = messages.scrollHeight;
    messageBox.value = '';
}

function initWS() {
    if (ws) {
        ws.onerror = ws.onopen = ws.onclose = null;
        ws.close();
    }
    ws = new WebSocket('ws://localhost:6969');
    ws.onopen = () => {
        console.log('Connection opened!');
    }
    ws.onmessage = ({data}) => {
        let dataAr = JSON.parse(data);
        let dataType = dataAr["type"];  //определяем тип данных

        switch (dataType) {
            case "sms":
                showMessage(dataAr["sender"] + ": " + dataAr["text"]);
                break;
            case "new":
                showMessageAbout(dataAr["name"], " joined.");
                break;
            case "newId":
                id = dataAr["id"];
                if (dataAr["members"].length === 0){
                    createRoom(id);
                }
                else {
                    joinRoom(id);
                }
                break;
            case "exit":
                showMessageAbout(dataAr["name"], " left site.");
                document.getElementById("video" + id).remove();
                break;
            case "rectangle":
                shapesArray.push(new Rectangle(parseInt(dataAr["x1"]), parseInt(dataAr["y1"]), parseInt(dataAr["x2"]),
                    parseInt(dataAr["y2"]), dataAr["color"]));
                break;
            case "circle":
                shapesArray.push(new Circle(parseInt(dataAr["x1"]), parseInt(dataAr["y1"]), parseInt(dataAr["x2"]),
                    parseInt(dataAr["y2"]), dataAr["color"]));
                break;
            case "line":
                shapesArray.push(new Line(parseInt(dataAr["x1"]), parseInt(dataAr["y1"]), parseInt(dataAr["x2"]),
                    parseInt(dataAr["y2"]), dataAr["color"]));
                break;
            case "lineByPen": {
                let pointsArray = dataAr["pointsArray"];
                let tmpLine = new LineByPen(pointsArray[0], pointsArray[1], dataAr["color"]);
                for (let i = 2; i < (pointsArray.length - 2); i += 2) {
                    tmpLine.addPoint(pointsArray[i], pointsArray[i + 1]);
                }
                shapesArray.push(tmpLine);
                }
                break;

            case "text":
                shapesArray.push(new MyText(dataAr["text"], parseInt(dataAr["x"]), parseInt(dataAr["y"]), dataAr["color"]));
                break;
            case "image": {
                let image = new Image();
                image.src = "data:image/png;base64," + dataAr["img"];
                shapesArray.push(new MyImg(image,dataAr["x"],dataAr["y"]));

            }
                break;
        }
    };
    ws.onclose = function () {
        ws = null;
    }

}

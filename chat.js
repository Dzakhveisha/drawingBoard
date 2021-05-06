const messages = document.querySelector('#messages');
const messageBox = document.querySelector('#messageBox');
let ws;

document.getElementById('forSend').onsubmit = function(evt) {
    evt.preventDefault();  // отмена автоматической отправки формы
};
initWS(); //инициализация веб-сокетов



function sendMSG() {
    if (!ws) {
        alert("No WebSocket connection :(");
        return ;
    }
    ws.send("sms." + messageBox.value);
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

function initWS() {
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

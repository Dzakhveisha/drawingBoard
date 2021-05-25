//https://video-chat.basscord.co/1
const room_id = "main";
const getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
let local_stream;


function createRoom() {
    console.log("Creating Room")
    let peer = new Peer(room_id)
    peer.on('open', (id) => {
        console.log("Peer Connected with ID: ", id)
        getUserMedia({video: true, audio: false}, (stream) => {
            local_stream = stream;
            setLocalStream(local_stream)
        }, (err) => {
            console.log(err)
        })
        notify("Waiting for peer to join.")
    })
    peer.on('call', (call) => {
        call.answer(local_stream, id);
        call.on('stream', (stream, id) => {
            setRemoteStream(stream, id)
        })
    })
}

function setLocalStream(stream) {
    let video = document.getElementById("local-video");
    video.id = "MyVideo";
    video.srcObject = stream;
    video.muted = true;
    video.play();
}

function setRemoteStream(stream, membId) {

    let video = document.createElement('video');
    video.id = "video" + membId ;
    video.setAttribute('width', '200px');
    video.setAttribute('height', '180px');

    let videoDiv = document.getElementById("remote-video");
    videoDiv.appendChild(video)
    video.srcObject = stream;
    video.play();
}

function notify(msg) {
    let notification = document.getElementById("notification")
    notification.innerHTML = msg
    notification.hidden = false
    setTimeout(() => {
        notification.hidden = true;
    }, 3000)
}

function joinRoom() {
    console.log("Joining Room")
    let peer = new Peer()
    peer.on('open', (id) => {
        console.log("Connected with Id: " + id)
        getUserMedia({video: true, audio: false}, (stream) => {
            local_stream = stream;
            setLocalStream(local_stream)
            notify("Joining peer")
            let call = peer.call(room_id, stream)
            call.on('stream', (stream) => {
                setRemoteStream(stream);
            })
        }, (err) => {
            console.log(err)
        })

    })
}
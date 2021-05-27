import * as connect from './socketConnection.js';

const localVideo = document.getElementById('local_video');
const peerConnections = {};

let localStream;

connect.socket.on('full_room', (room) => {
    alert('Room ' + room + ' is full')
});

connect.socket.on('ready', async (socketId) => {
    const peerConnection = new RTCPeerConnection(connect.stunServers);
    peerConnections[socketId] = peerConnection;
    peerConnection.addStream(localVideo.srcObject);
    const offer = await peerConnection.createOffer();
    peerConnection.setLocalDescription(offer)
        .then(() => connect.socket.emit('offer', socketId, peerConnection.localDescription));

    peerConnection.onaddstream = (event) => {
        remoteStreamAddHandler(event.stream, socketId)
    };

    peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
            connect.socket.emit('candidate', socketId, event.candidate)
        }
    }
});

connect.socket.on('offer', (socketId, description) => {
    const peerConnection = new RTCPeerConnection(connect.stunServers);
    peerConnections[socketId] = peerConnection;
    peerConnection.addStream(localVideo.srcObject);
    peerConnection
        .setRemoteDescription(description)
        .then(() => peerConnection.createAnswer())
        .then((sdp) => peerConnection.setLocalDescription(sdp))
        .then(() => {
            connect.socket.emit('answer', socketId, peerConnection.localDescription)
        });

    peerConnection.onaddstream = (event) =>
        remoteStreamAddHandler(event.stream, socketId);

    peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
            connect.socket.emit('candidate', socketId, event.candidate)
        }
    }
});


connect.socket.on('answer', (id, description) => {
    peerConnections[id].setRemoteDescription(description)
});


connect.socket.on('candidate', (id, candidate) => {
    peerConnections[id]
        .addIceCandidate(new RTCIceCandidate(candidate))
        .catch((e) => console.error(e))
});

connect.socket.on('end', (socketId) => {
    if (peerConnections[socketId]) {
        peerConnections[socketId].close();
        delete peerConnections[socketId];
        document.getElementById("remote_videos").removeChild(
            document.getElementById(socketId)
        )
    }
});

window.onunload = async () => {
    connect.socket.close()
};


async function start() {
    connect.socket.emit('join');
    localVideo.srcObject = localStream = await navigator.mediaDevices.getUserMedia(connect.mediaStreamConfig);
    localVideo.play();
    connect.socket.emit('ready');
}

start();

function remoteStreamAddHandler(stream, id) {
    const remoteVideo = document.createElement('video');
    remoteVideo.setAttribute("id", id);
    remoteVideo.classList.add('remote_video');
    remoteVideo.srcObject = stream;
    remoteVideo.setAttribute('playsinline', 'true');
    remoteVideo.setAttribute('autoplay', 'true');
    document.getElementById("remote_videos").append(remoteVideo);
}
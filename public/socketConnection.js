export const socket = io('127.0.0.1:5000');

export const stunServers = {
    iceServers: [
        {urls: 'stun:stun.l.google.com:19302'},
        {urls: 'stun:stun1.l.google.com:19302'},
        {urls: 'stun:stun2.l.google.com:19302'},
        {urls: 'stun:stun3.l.google.com:19302'},
    ],
};

export const mediaStreamConfig = {
    audio: false,
    video: true
};
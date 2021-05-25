const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const port = 6969;
const server = http.createServer(express);
const wss = new WebSocket.Server({ server })

let idCounter = 0;
let members = [];

wss.on('connection', function connection(wsClient) {
    idCounter++;
    let isFirst = false;
    if (members.length === 0){
        isFirst = true;
    }
    wsClient.send(JSON.stringify({type: 'newId', id: idCounter, isFirst: isFirst}));
    members.push(idCounter);
    wsClient.on('message', function incoming(data) {
        let dataAr = JSON.parse(data);
        if (dataAr["type"] === "exit"){
            members.splice(members.indexOf(dataAr["id"]), 1);
        }
        wss.clients.forEach(function each(client) {
             if (client !== wsClient && client.readyState === WebSocket.OPEN) {
                client.send(data);
             }
        })
    })
})

server.listen(port, function() {
    console.log(`Server is listening on ${port}!`)
})



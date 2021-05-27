const express = require('express');
const app = express();
const http = require('http');

const port = 5000;
const server = http.createServer(app);

let idCounter = 0;

app.use(express.static("public"));


const io = require('socket.io')(server);

// const rooms = io.of('/').adapter.rooms;
const room = "mainRoom";


io.sockets.on('connection', (socket) => {
    idCounter++;
    socket.emit('newId', JSON.stringify({id: idCounter}));
    socket.on('message', function incoming(data) {
        socket.clients.forEach(function each(client) {
            if (client !== socket && client.readyState === WebSocket.OPEN) {
                client.send(data);
            }
        })
    })

    socket.on('join', () => {

        socket.on('ready', () => {
            socket.to(room).emit('ready', socket.id)
        });

        socket.on('offer', (id, message) => {
            console.log("offer" + id);
            socket.to(id).emit('offer', socket.id, message)
        });

        socket.on('answer', (id, message) => {
            socket.to(id).emit('answer', socket.id, message)
        });

        socket.on('candidate', (id, message) => {
            socket.to(id).emit('candidate', socket.id, message)
        });

        socket.on('end_session', () => {
            // console.log(rooms)
        });

        socket.on('disconnect', () => {
            socket.to(room).emit('end', socket.id)
        });

        socket.join(room);
        // console.log(rooms)
    })

    socket.on('sms', (data) => {
        socket.to(room).emit('sms', data)
    });
    socket.on('rectangle', (data) => {
        socket.to(room).emit('rectangle', data)
    });
    socket.on('new', (data) => {
        socket.to(room).emit('new', data)
    });
    socket.on('newId', (data) => {
        socket.to(room).emit('newId', data)
    });
    socket.on('exit', (data) => {
        socket.to(room).emit('exit', data)
    });
    socket.on('circle', (data) => {
        socket.to(room).emit('circle', data)
    });
    socket.on('line', (data) => {
        socket.to(room).emit('line', data)
    });
    socket.on('lineByPen', (data) => {
        socket.to(room).emit('lineByPen', data)
    });
    socket.on('text', (data) => {
        socket.to(room).emit('text', data)
    });
    socket.on('image', (data) => {
        socket.to(room).emit('image', data)
    });
});

io.sockets.on('error', (e) => {
    console.error(e)
});


server.listen(port, function () {
    console.log(`Server is listening on ${port}`)
})



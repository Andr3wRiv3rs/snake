let express = require('express');
let app = express();
let http = require('http').Server(app);
let io = require('socket.io')(http);
let config = require('./config.json');

app.use(express.static(__dirname + '/client'));

let sessions = {};

io.on('connection', socket => {
    sessions[socket.id] = socket;
    console.log(`Client ${socket.id} connected from ${socket.request.connection.remoteAddress}.`);

    socket.on('disconnect', () => {
        delete sessions[socket.id]
        console.log(`Client ${socket.id} disconnected.`);
    });

    socket.on('log', data => {
        console.log(data);
    });
});


http.listen(config.port, () => {
    console.log('Server listening on port '+config.port)
});
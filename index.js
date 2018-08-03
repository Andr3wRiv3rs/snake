let express = require('express');
let fs = require('fs');
let app = express();
let http = require('http').Server(app);
let io = require('socket.io')(http);
let config = require('./config.json');

eval(fs.readFileSync('./client/scripts/snake.js'));

app.use(express.static(__dirname + '/client'));

let sessions = {};

io.on('connection', socket => {
    sessions[socket.id] = {
        alive:true,
        x:12,
        y:12,
        units:[3,3,3,3],
        direction:3,
        socket:socket
    };
    console.log(`Client ${socket.id} connected from ${socket.request.connection.remoteAddress}.`);

    socket.on('disconnect', () => {
        delete sessions[socket.id]
        console.log(`Client ${socket.id} disconnected.`);
    });

    socket.on('log', data => {
        console.log(data);
    });

    socket.on('update', data => {
        
    });
});

http.listen(config.port, () => {
    console.log('Server listening on port '+config.port)
});

let gameLoop = setInterval(()=>{
    let keys = Object.keys(sessions);
    for(let i in keys){

    }
},1000);

/*
POSITION:
    Emit random start position to client with direction right.
    Store base client coordinates and direction and a UTC timestamp in the sessions object.
    Recieve [direction,[coordinates]] from client.
    Compare unit length * speed to get frame delay to calculate distance.
    If distance is within threshold, broadcast new direction+position to clients at given timestamp.
    If test fails, emit old direction+position to client.

VIEWPORT:
    Calculate client viewport based on snake data using interval.
    Compare units array and snakes in session object to find all data in the approximate viewport.
    Emit data to client.

DEATH:
    Compare all snake data to find overlapping positions in grid.
    If collision, broadcast event.
*/
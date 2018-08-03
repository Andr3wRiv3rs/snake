let socket = io();
let $ = e => (document.querySelector(e));

let global = {
    fps: 60
};

let viewport = {
    width: 43
};

// Initialize layers.

let layers = [$('#canvas-view')];
let camera = layers[0];

for (let i in layers) {
    let l = layers[i];
    l.ctx = layers[i].getContext('2d');
    l.draw = {
        square: (x,y,w,h,c) => {
            l.ctx.fillStyle = c;
            l.ctx.fillRect(x,y,w,h);
        },
        point: (x,y,c) => {
            l.draw.square(x,y,1,1,c);
        } 
    };

    l.clear = {
        square: (x,y,w,h) => {
            l.ctx.clearRect(x,y,w,h);
        },
        point: (x,y) => {
            l.ctx.clearRect(x,y,1,1);
        } 
    };
}

// Initialize step events.

let step = {
    begin: [],
    mid: [],
    end: []
};

// Used for better global drawing.

let draw = [];
let clear = [];

// Game loop.

let gameLoop = setInterval(()=>{

    // Adjust camera dimensions.

    camera.width = viewport.width; 
    camera.height = viewport.width / (camera.clientWidth/camera.clientHeight);

    updateGamepads(); // Polls gamepads and formats input.

    // Execute step events.
    
    for (let i in clear) {
        camera.clear.point(clear[i][0],clear[i][1]);
    };

    for (let i in step.begin) {
        step.begin[i]();
    }

    for (let i in step.mid) {
        step.mid[i]();
    }

    for (let i in step.end) {
        step.end[i]();
    }

    for (let i in draw) {
        camera.draw.point(draw[i][0],draw[i][1],draw[i][2]);
    };

    clear = [];
    draw = [];

    clearPress(); // Clears press events for the current frame.

}, 1000/global.fps);

// Snake object, handles drawing and pushing events to gameLoop.

let Snake = function ( options ) {
    options = options || {};

    if ( (typeof options != 'object' ) || Array.isArray(options) ) {
        throw '[Snake] options paramater must be an object.'
    }

    this.color = '#ff66fc';
    this.direction = 0;
    this.layer = options.layer || 0;
    this.x = options.x || Math.floor(camera.width/2);
    this.y = options.y || Math.floor(camera.height/2);
    this.frame = 0;

    this.cors = [];

    this.units = [2,2,2,2];

    this.step = () => {
        this.frame++;

        this.clear(this.cors);
        if(this.frame == Math.floor(this.units.length/16)+3){
            try{options.step()}catch(e){}; // Needs changing, used to ignore "undefined" errors.

            let data = updateSnake(this.x,this.y,this.direction,this.units, options.player);

            if(!options.player){
                this.x=data.x;
                this.y=data.y;
            } else {
                this.x = options.x || Math.floor(camera.width/2);
                this.y = options.y || Math.floor(camera.height/2);
            }

            this.cors = data.cors
            
            // if(data.collision[0]){

            // };
            
            this.frame = 0;
        }
        this.draw(this.cors);
    };

    this.draw = (cors) => {
        for(let i in cors){
            draw.push([cors[i][0],cors[i][1],this.color]);
        }
    };

    this.clear = (cors) => {
        for(let i in cors){
            clear.push([cors[i][0],cors[i][1]]);
        }
    };

    this.emit = () => {
        socket.emit('update', {
            x:this.x,
            y:this.y,
            units:this.units
        });
    };
    
    this.create = () => {
        try{options.create()}catch(e){};
        step.mid.push(this.step); // Pushes step event to gameLoop.
        this.emitInterval = setInterval(() => {
            this.emit();
        },250);
    };

    this.create();
}

// Array of coordinates for collision.

let cols = [];

// Enemy snake object.

let snakes = {};
let activeSnakes = [];

// Scattered units, "bits".

let bits = [];

// Create player snake.

let player = new Snake({
    player: true,
    step: () => {
        player.direction = input.direction;
    }
});

// Main update function for game loop.

socket.on('update', data => {
    bits = data.bits;
    let keys = Object.keys(data.snakes);
    for (let i in keys) {
        snakes[keys[i]]=data.snakes[keys[i]];
        if(activeSnakes.indexOf(keys[i])==-1){
            activeSnakes.push(keys[i]);

            /*
                Create new snake here.
            */

            console.log(activeSnakes,snakes);
        }
    }
});
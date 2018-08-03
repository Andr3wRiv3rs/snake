let socket = io();
let $ = e => (document.querySelector(e));

let global = {
    fps: 20
};

let viewport = {
    width: 32
};

// Initialize layers.

let layers = [$('#canvas-view'), document.createElement('canvas')];
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

// Game loop.

let gameLoop = setInterval(()=>{

    // Adjust camera dimensions.

    camera.width = viewport.width; 
    camera.height = viewport.width / (camera.clientWidth/camera.clientHeight);

    updateGamepads(); // Polls gamepads and formats input.

    // Execute step events.
    
    for (let i in step.begin) {
        step.begin[i]();
    }

    for (let i in step.mid) {
        step.mid[i]();
    }

    for (let i in step.end) {
        step.end[i]();
    }

    clearPress(); // Clears press events for the current frame.

}, 1000/global.fps);

// Snake object, handles drawing and pushing events to gameLoop.

let Snake = function ( options ) { 

    options = options || {};

    if ( (typeof options != 'object' ) || Array.isArray(options) ) {
        throw '[Snake] options paramater must be an object.'
    }

    this.color = 'white';
    this.direction = 0;
    this.layer = options.layer || 0;
    this.x = options.x || 12;
    this.y = options.y || 12;

    this.cors = [];

    this.units = [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2];

    this.step = () => {
        this.clear(this.cors);

        try{options.step()}catch(e){}; // Needs changing, used to ignore "undefined" errors.
        let data = updateSnake(this.x,this.y,this.direction,this.units, [/* Put collision coordinates here. */]);

        this.x=data.x;
        this.y=data.y;

        this.draw(data.cors);
        this.cors = data.cors

    };

    this.draw = (cors) => {
        for (let i in cors) {
            layers[this.layer].draw.point(cors[i][0],cors[i][1],this.color);
        };
    };

    this.clear = (cors) => {
        for (let i in cors) {
            layers[this.layer].clear.point(cors[i][0],cors[i][1]);
        };
    };

    this.create = () => {
        try{options.create()}catch(e){};
        step.mid.push(this.step); // Pushes step event to gameLoop.
    };

    this.create();
}

let player = new Snake({step: () => {
    player.direction = input.direction;
}});
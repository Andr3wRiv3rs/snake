let socket = io();
let $ = e => (document.querySelector(e));

let layers = [$('#canvas-view'), document.createElement('canvas')];

let camera = layers[0];

let global = {
    fps: 20
};

let viewport = {
    width: 32
};

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

let step = {
    begin: [],
    mid: [],
    end: []
};

let gameLoop = setInterval(()=>{
    let keys = Object.keys(step);
    camera.width = viewport.width; 
    camera.height = viewport.width / (camera.clientWidth/camera.clientHeight);

    updateGamepads();
    for (let i in step.begin) {
        step.begin[i]();
    }

    for (let i in step.mid) {
        step.mid[i]();
    }

    for (let i in step.end) {
        step.end[i]();
    }
    clearPress();
}, 1000/global.fps);

let Snake = function ( options ) { 
    options = options || {};

    this.layer = options.layer || 0;
    this.x = options.x || 12;
    this.y = options.y || 12;

    this.color = 'white';

    this.directions = {
        up: [0,-1],
        down: [0,1],
        left: [-1,0],
        right: [1,0]
    } 

    this.direction = 0;

    let dw = ['up','down','left','right'];

    this.units = [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2];

    if ( (typeof options != 'object' ) || Array.isArray(options) ) {
        throw '[Snake] options paramater must be an object.'
    }

    this.step = () => {
        this.clear()
        try{options.step()}catch(e){};

        this.direction = input.direction;

        let d = this.directions[dw[this.units[0]]];
        let m = this.directions[dw[this.direction]];
        this.x+=m[0];
        this.y+=m[1];
        this.units.splice(this.units.length-1,1);
        this.units.reverse();
        this.units.push(this.direction);
        this.units.reverse();
        this.draw();
    };

    this.draw = () => {
        let pos = [this.x,this.y];
        for (let i in this.units) {
            let m = this.directions[dw[this.units[i]]];
            pos[0] -= m[0];
            pos[1] -= m[1];
            layers[this.layer].draw.point(pos[0],pos[1],this.color);
        };
    };

    this.clear = () => {
        let pos = [this.x,this.y];
        for (let i in this.units) {
            let m = this.directions[dw[this.units[i]]];
            layers[this.layer].clear.point(this.x-m[0],this.y-m[1],this.color);
        };
    };

    this.create = () => {
        try{options.create()}catch(e){};
        step.mid.push(this.step);
    };

    this.create();
}

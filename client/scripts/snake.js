let updateSnake = (x,y,direction,units,player) => {
    let directions = {
        up: [0,-1],
        down: [0,1],
        left: [-1,0],
        right: [1,0]
    }

    let collision = [false, false]; // [is colliding, head colliding]

    let dw = ['up','down','left','right'];
    
    // Update units

    units.splice(units.length-1,1);
    units.reverse();
    units.push(direction);
    units.reverse();

    // Find coordinates

    let m = directions[dw[direction]];

    let cors = [];
    let pos = [x,y];

    if(!player){
        pos = [x+m[0],y+m[1]];
    }

    for (let i in units) {
        let d = directions[dw[units[i]]];

        cors.push([pos[0],pos[1]]);

        pos[0] = pos[0] - d[0];
        pos[1] = pos[1] - d[1];
    };

    return {
        x: x+m[0],
        y: y+m[1],
        units: units,
        cors: cors
    }
};

// Test collision.

let snakeCollide = (cors,cols) => {
    let collision = [false,false];
    for(let i in cors){
        for(let z in cols){
            if(cors[i][0]==cols[z][0] && cors[i][1]==cols[z][1]){
                collision = [true,false];
                if(i==0){
                    collision = [true,true];
                }
            }
        }
    }

    return collision;
};
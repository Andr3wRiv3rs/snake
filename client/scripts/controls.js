input = {
    direction: 0,
    press: {},
    down: {},
    pads: {},
    pcheck: []
};

let gamepadHandler = (e, connecting) => {
    let gamepad = e.gamepad;
  
    if (connecting) {
        input.pads[gamepad.id] = {
            press: [],
            down: [],
            axes: [],
            pad: gamepad
        };
    } else {
        delete gamepads[gamepad.index];
    }
}

let updateGamepads = () => {
    let pads = navigator.getGamepads();
    let keys = Object.keys(pads);
    for (let i in keys){
        
        if(pads[keys[i]] != null){
            let gp = input.pads[pads[keys[i]].id];
            try{
                for (let z in gp.pad.buttons){
                    let p = gp.pad.buttons[z].pressed;
                    
                    if(gp.press == undefined){
                        gp.press=p;
                    } 
                    
                    if (!p && gp.press) {
                        delete gp.press;
                    }

                    gp.down=p
                }
            } catch(e) {
                // console.warn(e);
            }
        }
    }
};

let keypress = (which) => {
    let k = which.toLowerCase();
    if (input.press[k]){
        input.pcheck.push(k);
        return true;
    }
}

let clearPress = () => {
    for (let i in input.pcheck) {
        if(input.press[input.pcheck[i]] != undefined){
            input.press[input.pcheck[i]] = false;
        }
    }
    input.pckech = [];
};

let keydown = (which) => (input.down[which.toLowerCase()]);


window.addEventListener("gamepadconnected", e => gamepadHandler(e, true), false);
window.addEventListener("gamepaddisconnected", e => gamepadHandler(e, false), false);

window.addEventListener('keydown', e => {
    let k = e.key.toLowerCase();
    input.down[k] = true;

    if(input.press[k] == undefined){
        input.press[k] = true;
    }

    switch(k){
        case 'w':
        case 'arrowup':
            input.direction=0;
            break;
        case 's':
        case 'arrowdown':
            input.direction=1;
            break;
        case 'a':
        case 'arrowleft':
            input.direction=2;
            break;
        case 'd':
        case 'arrowright':
            input.direction=3;
            break;
    }
});

window.addEventListener('keyup', e => {
    let k = e.key.toLowerCase();
    delete input.down[k];
    delete input.press[k];
});
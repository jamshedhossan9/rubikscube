

var ready = (callback) => {
    if (document.readyState != "loading") callback();
    else document.addEventListener("DOMContentLoaded", callback);
}

  
ready(() => { 
    var windowWidth = window.innerWidth;
    var windowHeight = window.innerHeight;
    var holdSliceRotation = false;
    var cubeWidth = 240;
    var transitionTime = 500;
    var transitionTimeDelay = 50;
    var holdUserAction = false;
    var playing = false;
    
    var lastMouseX = 0,
        lastMouseY = 0;
    var rotX = -20,
        rotY = -20;
    var cubeClass = ".cube-box";
    var cubeContainer = document.querySelector('.cube-container');
    var cubeBox = cubeContainer.querySelector(cubeClass);
    var sliceCon = cubeBox.querySelector('.slice-con');
    var alterIds = [];
    var sideColor = {
        // 'f' : '#873ea7',
        'f' : '#dfd6e3',
        'r' : '#0278b7',
        'b' : '#f1c409',
        'l' : '#55af00',
        'u' : '#ff7200',
        'd' : '#d62e10',
    };
    var sides = {};
    var sideAngles = {}; // 'f-1': {pillar:[0, 0, 0], slice: [0, 0, 0], pos: [0, 0], sij: ['', 0, 0]},

    var sliceMoveTo = {
        'f-1':{		'right' : 'r-1',	            'left' : 'l-1',		            'up' : 'u-1',	            'down' : 'd-1',		            'clock' : 'f-3',	'counterClock' : 'f-7', 	},
        'f-2':{		'right' : 'r-2',	            'left' : 'l-2',		            'up' : 'u-2',	            'down' : 'd-2',		            'clock' : 'f-6',	'counterClock' : 'f-4',		},
        'f-3':{		'right' : 'r-3',	            'left' : 'l-3',		            'up' : 'u-3',	            'down' : 'd-3',		            'clock' : 'f-9',	'counterClock' : 'f-1',		},
        'f-4':{		'right' : 'r-4',	            'left' : 'l-4',		            'up' : 'u-4',	            'down' : 'd-4',		            'clock' : 'f-2',	'counterClock' : 'f-8',		},
        'f-5':{		'right' : 'r-5',	            'left' : 'l-5',		            'up' : 'u-5',	            'down' : 'd-5',		            'clock' : 'f-5',	'counterClock' : 'f-5',		},
        'f-6':{		'right' : 'r-6',	            'left' : 'l-6',		            'up' : 'u-6',	            'down' : 'd-6',		            'clock' : 'f-8',	'counterClock' : 'f-2',		},
        'f-7':{		'right' : 'r-7',	            'left' : 'l-7',		            'up' : 'u-7',	            'down' : 'd-7',		            'clock' : 'f-1',	'counterClock' : 'f-9',		},
        'f-8':{		'right' : 'r-8',	            'left' : 'l-8',		            'up' : 'u-8',	            'down' : 'd-8',		            'clock' : 'f-4',	'counterClock' : 'f-6',		},
        'f-9':{		'right' : 'r-9',	            'left' : 'l-9',		            'up' : 'u-9',	            'down' : 'd-9',		            'clock' : 'f-7',	'counterClock' : 'f-3',		},

        'r-1':{		'right' : 'b-1',	            'left' : 'f-1',		            'up' : ['u-7', 'left'],	    'down' : ['d-3', 'left'],		'clock' : 'r-3',	'counterClock' : 'r-7', 	},
        'r-2':{		'right' : 'b-2',	            'left' : 'f-2',		            'up' : ['u-4', 'left'],	    'down' : ['d-6', 'left'],		'clock' : 'r-6',	'counterClock' : 'r-4',		},
        'r-3':{		'right' : 'b-3',	            'left' : 'f-3',		            'up' : ['u-1', 'left'],	    'down' : ['d-9', 'left'],		'clock' : 'r-9',	'counterClock' : 'r-1',		},
        'r-4':{		'right' : 'b-4',	            'left' : 'f-4',		            'up' : ['u-8', 'left'],	    'down' : ['d-2', 'left'],		'clock' : 'r-2',	'counterClock' : 'r-8',		},
        'r-5':{		'right' : 'b-5',	            'left' : 'f-5',		            'up' : ['u-5', 'left'],	    'down' : ['d-5', 'left'],		'clock' : 'r-5',	'counterClock' : 'r-5',		},
        'r-6':{		'right' : 'b-6',	            'left' : 'f-6',		            'up' : ['u-2', 'left'],	    'down' : ['d-8', 'left'],		'clock' : 'r-8',	'counterClock' : 'r-2',		},
        'r-7':{		'right' : 'b-7',	            'left' : 'f-7',		            'up' : ['u-9', 'left'],	    'down' : ['d-1', 'left'],		'clock' : 'r-1',	'counterClock' : 'r-9',		},
        'r-8':{		'right' : 'b-8',	            'left' : 'f-8',		            'up' : ['u-6', 'left'],	    'down' : ['d-4', 'left'],		'clock' : 'r-4',	'counterClock' : 'r-6',		},
        'r-9':{		'right' : 'b-9',	            'left' : 'f-9',		            'up' : ['u-3', 'left'],	    'down' : ['d-7', 'left'],		'clock' : 'r-7',	'counterClock' : 'r-3',		},

        'b-1':{		'right' : 'l-1',	            'left' : 'r-1',		            'up' : ['u-9', 'down'],	    'down' : ['d-9', 'up'],		    'clock' : 'b-3',	'counterClock' : 'b-7', 	},
        'b-2':{		'right' : 'l-2',	            'left' : 'r-2',		            'up' : ['u-8', 'down'],	    'down' : ['d-8', 'up'],		    'clock' : 'b-6',	'counterClock' : 'b-4',		},
        'b-3':{		'right' : 'l-3',	            'left' : 'r-3',		            'up' : ['u-7', 'down'],	    'down' : ['d-7', 'up'],		    'clock' : 'b-9',	'counterClock' : 'b-1',		},
        'b-4':{		'right' : 'l-4',	            'left' : 'r-4',		            'up' : ['u-6', 'down'],	    'down' : ['d-6', 'up'],		    'clock' : 'b-2',	'counterClock' : 'b-8',		},
        'b-5':{		'right' : 'l-5',	            'left' : 'r-5',		            'up' : ['u-5', 'down'],	    'down' : ['d-5', 'up'],		    'clock' : 'b-5',	'counterClock' : 'b-5',		},
        'b-6':{		'right' : 'l-6',	            'left' : 'r-6',		            'up' : ['u-4', 'down'],	    'down' : ['d-4', 'up'],		    'clock' : 'b-8',	'counterClock' : 'b-2',		},
        'b-7':{		'right' : 'l-7',	            'left' : 'r-7',		            'up' : ['u-3', 'down'],	    'down' : ['d-3', 'up'],		    'clock' : 'b-1',	'counterClock' : 'b-9',		},
        'b-8':{		'right' : 'l-8',	            'left' : 'r-8',		            'up' : ['u-2', 'down'],	    'down' : ['d-2', 'up'],		    'clock' : 'b-4',	'counterClock' : 'b-6',		},
        'b-9':{		'right' : 'l-9',	            'left' : 'r-9',		            'up' : ['u-1', 'down'],	    'down' : ['d-1', 'up'],		    'clock' : 'b-7',	'counterClock' : 'b-3',		},

        'l-1':{		'right' : 'f-1',	            'left' : 'b-1',		            'up' : ['u-3', 'right'],	'down' : ['d-7', 'right'],		'clock' : 'l-3',	'counterClock' : 'l-7', 	},
        'l-2':{		'right' : 'f-2',	            'left' : 'b-2',		            'up' : ['u-6', 'right'],	'down' : ['d-4', 'right'],		'clock' : 'l-6',	'counterClock' : 'l-4',		},
        'l-3':{		'right' : 'f-3',	            'left' : 'b-3',		            'up' : ['u-9', 'right'],	'down' : ['d-1', 'right'],		'clock' : 'l-9',	'counterClock' : 'l-1',		},
        'l-4':{		'right' : 'f-4',	            'left' : 'b-4',		            'up' : ['u-2', 'right'],	'down' : ['d-8', 'right'],		'clock' : 'l-2',	'counterClock' : 'l-8',		},
        'l-5':{		'right' : 'f-5',	            'left' : 'b-5',		            'up' : ['u-5', 'right'],	'down' : ['d-5', 'right'],		'clock' : 'l-5',	'counterClock' : 'l-5',		},
        'l-6':{		'right' : 'f-6',	            'left' : 'b-6',		            'up' : ['u-8', 'right'],	'down' : ['d-2', 'right'],		'clock' : 'l-8',	'counterClock' : 'l-2',		},
        'l-7':{		'right' : 'f-7',	            'left' : 'b-7',		            'up' : ['u-1', 'right'],	'down' : ['d-9', 'right'],		'clock' : 'l-1',	'counterClock' : 'l-9',		},
        'l-8':{		'right' : 'f-8',	            'left' : 'b-8',		            'up' : ['u-4', 'right'],	'down' : ['d-6', 'right'],		'clock' : 'l-4',	'counterClock' : 'l-6',		},
        'l-9':{		'right' : 'f-9',	            'left' : 'b-9',		            'up' : ['u-7', 'right'],	'down' : ['d-3', 'right'],		'clock' : 'l-7',	'counterClock' : 'l-3',		},

        'u-1':{		'right' : ['r-3', 'down'],	    'left' : ['l-7', 'down'],		'up' : ['b-9', 'down'],	    'down' : 'f-1',		            'clock' : 'u-3',	'counterClock' : 'u-7',		},
        'u-2':{		'right' : ['r-6', 'down'],	    'left' : ['l-4', 'down'],		'up' : ['b-8', 'down'],	    'down' : 'f-2',		            'clock' : 'u-6',	'counterClock' : 'u-4',		},
        'u-3':{		'right' : ['r-9', 'down'],	    'left' : ['l-1', 'down'],		'up' : ['b-7', 'down'],	    'down' : 'f-3',		            'clock' : 'u-9',	'counterClock' : 'u-1',		},
        'u-4':{		'right' : ['r-2', 'down'],	    'left' : ['l-8', 'down'],		'up' : ['b-6', 'down'],	    'down' : 'f-4',		            'clock' : 'u-2',	'counterClock' : 'u-8',		},
        'u-5':{		'right' : ['r-5', 'down'],	    'left' : ['l-5', 'down'],		'up' : ['b-5', 'down'],	    'down' : 'f-5',		            'clock' : 'u-5',	'counterClock' : 'u-5',		},
        'u-6':{		'right' : ['r-8', 'down'],	    'left' : ['l-2', 'down'],		'up' : ['b-4', 'down'],	    'down' : 'f-6',		            'clock' : 'u-8',	'counterClock' : 'u-2',		},
        'u-7':{		'right' : ['r-1', 'down'],	    'left' : ['l-9', 'down'],		'up' : ['b-3', 'down'],	    'down' : 'f-7',		            'clock' : 'u-1',	'counterClock' : 'u-9',		},
        'u-8':{		'right' : ['r-4', 'down'],	    'left' : ['l-6', 'down'],		'up' : ['b-2', 'down'],	    'down' : 'f-8',		            'clock' : 'u-4',	'counterClock' : 'u-6',		},
        'u-9':{		'right' : ['r-7', 'down'],	    'left' : ['l-3', 'down'],		'up' : ['b-1', 'down'],	    'down' : 'f-9',		            'clock' : 'u-7',	'counterClock' : 'u-3',		},

        'd-1':{		'right' : ['r-7', 'up'],	    'left' : ['l-3', 'up'],		    'up' : 'f-1',	            'down' : ['b-9', 'up'],		    'clock' : 'd-3',	'counterClock' : 'd-7',		},
        'd-2':{		'right' : ['r-4', 'up'],	    'left' : ['l-6', 'up'],		    'up' : 'f-2',	            'down' : ['b-8', 'up'],		    'clock' : 'd-6',	'counterClock' : 'd-4',		},
        'd-3':{		'right' : ['r-1', 'up'],	    'left' : ['l-9', 'up'],		    'up' : 'f-3',	            'down' : ['b-7', 'up'],		    'clock' : 'd-9',	'counterClock' : 'd-1',		},
        'd-4':{		'right' : ['r-8', 'up'],	    'left' : ['l-2', 'up'],		    'up' : 'f-4',	            'down' : ['b-6', 'up'],		    'clock' : 'd-2',	'counterClock' : 'd-8',		},
        'd-5':{		'right' : ['r-5', 'up'],	    'left' : ['l-5', 'up'],		    'up' : 'f-5',	            'down' : ['b-5', 'up'],		    'clock' : 'd-5',	'counterClock' : 'd-5',		},
        'd-6':{		'right' : ['r-2', 'up'],	    'left' : ['l-8', 'up'],		    'up' : 'f-6',	            'down' : ['b-4', 'up'],		    'clock' : 'd-8',	'counterClock' : 'd-2',		},
        'd-7':{		'right' : ['r-9', 'up'],	    'left' : ['l-1', 'up'],		    'up' : 'f-7',	            'down' : ['b-3', 'up'],		    'clock' : 'd-1',	'counterClock' : 'd-9',		},
        'd-8':{		'right' : ['r-6', 'up'],	    'left' : ['l-4', 'up'],		    'up' : 'f-8',	            'down' : ['b-2', 'up'],		    'clock' : 'd-4',	'counterClock' : 'd-6',		},
        'd-9':{		'right' : ['r-3', 'up'],	    'left' : ['l-7', 'up'],		    'up' : 'f-9',	            'down' : ['b-1', 'up'],		    'clock' : 'd-7',	'counterClock' : 'd-3',		},
    };

    var sliceMoveLine = {
        'x-1' : { 'regular': ['f-1', 'f-2', 'f-3'], 'surface' : ['u-1','u-2']},
        'x-2' : { 'regular': ['f-4', 'f-5', 'f-6'], 'surface' : []},
        'x-3' : { 'regular': ['f-7', 'f-8', 'f-9'], 'surface' : ['d-1','d-2']},
        
        'y-1' : { 'regular': ['f-1', 'f-4', 'f-7'], 'surface' : ['l-1','l-2']},
        'y-2' : { 'regular': ['f-2', 'f-5', 'f-8'], 'surface' : []},
        'y-3' : { 'regular': ['f-3', 'f-6', 'f-9'], 'surface' : ['r-1','r-2']},
        
        'z-1' : { 'regular': ['u-7', 'u-8', 'u-9'], 'surface' : ['f-1','f-2']},
        'z-2' : { 'regular': ['u-4', 'u-5', 'u-6'], 'surface' : []},
        'z-3' : { 'regular': ['u-1', 'u-2', 'u-3'], 'surface' : ['b-1','b-2']},
    };
    var sliceMoveTrack = {};

    cubeBox.style.transform = "rotateX( " + rotX + "deg) rotateY(" + rotY + "deg)";

    function documentMousedown(ev){
        ev.preventDefault();
        if(!ev.target.closest(cubeClass)){
            if(ev.type == 'touchstart'){
                lastMouseX = ev.touches[0].clientX;
                lastMouseY = ev.touches[0].clientY;
            }
            else{
                lastMouseX = ev.clientX;
                lastMouseY = ev.clientY;
            }
            document.addEventListener("mousemove", documentMouseMoved);
            document.addEventListener("touchmove", documentMouseMoved);
        }
    }
    function documentMouseUp(ev){
        document.removeEventListener("mousemove", documentMouseMoved);
        document.removeEventListener("touchmove", documentMouseMoved);
    }
    function documentMouseMoved(ev) {
        ev.preventDefault();
        if(ev.type == 'touchmove'){
            var deltaX = ev.touches[0].pageX - lastMouseX;
            var deltaY = ev.touches[0].pageY - lastMouseY;
            lastMouseX = ev.touches[0].pageX;
            lastMouseY = ev.touches[0].pageY;
        }
        else{
            var deltaX = ev.pageX - lastMouseX;
            var deltaY = ev.pageY - lastMouseY;
            lastMouseX = ev.pageX;
            lastMouseY = ev.pageY;
        }

        rotY -= deltaX * -0.1;
        rotX += deltaY * -0.1;

        cubeBox.style.transform = "rotateX( " + rotX + "deg) rotateY(" + rotY + "deg)";
    }
    document.addEventListener("mousedown", documentMousedown);
    document.addEventListener("touchstart", documentMousedown);

    document.addEventListener("mouseup", documentMouseUp);
    document.addEventListener("touchend", documentMouseUp);

    function checkScreenSize(){
        windowWidth = window.innerWidth;
        windowHeight = window.innerHeight;
        if(windowWidth < 600 || windowHeight < 600){
            transitionTime = 400;
            transitionTimeDelay = 40;
            cubeBox.closest('.cube-box-wrapper').classList.add('is-small-device');
            cubeBox.classList.add('transition-small-device');
        }
        else{
            transitionTime = 500;
            transitionTimeDelay = 50;
            cubeBox.closest('.cube-box-wrapper').classList.remove('is-small-device');
            cubeBox.classList.remove('transition-small-device');
        }
    }
    
    function transition(add){
        if(typeof add === "undefined") add = true;
        if(add) cubeBox.classList.add('has-transition');
        else cubeBox.classList.remove('has-transition');
    }

    function transitionLow(bool){
        if(typeof bool === "undefined") bool = true;
        if(bool){
            transitionTime = 200;
            transitionTimeDelay = 20;
            cubeBox.classList.add('transition-low');
        }
        else{
            transitionTime = 500;
            transitionTimeDelay = 50;
            if(windowWidth < 600){
                transitionTime = 400;
                transitionTimeDelay = 40;
            }
            cubeBox.classList.remove('transition-low');
        }
    }

    function _parseInt(num){
        num = num.toString().trim();
        num = parseInt(num);
        if(isNaN(num)){
            num = 0;
        }
        return num;
    }

    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    for(let x in sideColor){
        if(sideColor.hasOwnProperty(x)){
            sides[x] = [[x+'-1', x+'-2', x+'-3'], [x+'-4', x+'-5', x+'-6'], [x+'-7', x+'-8', x+'-9']];
        }
    }

    for(let x in sides){
        if(sides.hasOwnProperty(x)){
            for(let [i, item1] of sides[x].entries()){
                for(let [j, item2] of item1.entries()){
                    let pos = [0, 0]; // x,y,z x,y,z top,left
                    let sij = [x, i, j];
                    pos[0] = i * (cubeWidth/3);
                    pos[1] = j * (cubeWidth/3);

                    let pillar = [0,0,0];
                    let slice = [0,0,0];
                    if(x == 'f'){

                    }
                    else if(x == 'r'){
                        pillar[1] += 90;
                    }
                    else if(x == 'b'){
                        pillar[1] += 180;
                    }
                    else if(x == 'l'){
                        pillar[1] += 270;
                    }
                    else if(x == 'u'){
                        slice[0] += 90;
                    }
                    else if(x == 'd'){
                        slice[0] -= 90;
                    }
                    sideAngles[item2] = {};
                    sideAngles[item2].pos = pos;
                    sideAngles[item2].pillar = pillar;
                    sideAngles[item2].slice = slice;
                    sideAngles[item2].sij = sij;
                }
                
            }
            
        }
    }

    function sliceMoveTowardsAnother(id, dir, currentMatrix){
        var pillarDom = sliceCon.querySelector(`.slice-single-pillar[data-id="${id}"]`);
        if(pillarDom){
            var side = pillarDom.getAttribute('data-current-side');
            var i = pillarDom.getAttribute('data-current-pos-i');
            var j = pillarDom.getAttribute('data-current-pos-j');
            i = _parseInt(i);
            j = _parseInt(j);

            var pillar = currentMatrix.pillar;
            var slice = currentMatrix.slice;
            var surfaceCenter = null;
            var surfaceMatrix = null;
            if(i == 0 && j == 0){
                if(dir == 'clock' || dir == 'counterClock'){
                    surfaceCenter = sliceCon.querySelector(`.slice-single-pillar[data-id="${side}-5"] .slice-single`);
                    surfaceMatrix = JSON.parse(JSON.stringify(sideAngles[`${side}-5`]));
                    if(dir == "clock"){
                        surfaceMatrix.slice[2] += 90;
                    }
                    if(dir == "counterClock"){
                        surfaceMatrix.slice[2] -= 90;
                    }
                }
            }
            // right, left, up, down, clock, counterClock
            if(dir == 'right'){
                if((slice[0] / 90) % 2){
                    slice[1] += 90;
                }
                else{
                    pillar[1] += 90;
                }
            }
            else if(dir == 'left'){
                if((slice[0] / 90) % 2){
                    slice[1] -= 90;
                }
                else{
                    pillar[1] -= 90;
                }
            }
            else if(dir == 'up'){
                slice[0] += 90;
            }
            else if(dir == 'down'){
                slice[0] -= 90;
            }
            else if(dir == 'clock'){
                slice[2] += 90;
            }
            else if(dir == 'counterClock'){
                slice[2] -= 90;
            }

            if(surfaceCenter){
                surfaceCenter.style.transform = `rotateX(${surfaceMatrix.slice[0]}deg) rotateY(${surfaceMatrix.slice[1]}deg) rotateZ(${surfaceMatrix.slice[2]}deg)`;
            }
            
            var pillarTransform = `rotateX(${pillar[0]}deg) rotateY(${pillar[1]}deg) rotateZ(${pillar[2]}deg)`;
            var sliceTransform = `rotateX(${slice[0]}deg) rotateY(${slice[1]}deg) rotateZ(${slice[2]}deg)`;

            pillarDom.style.transform = pillarTransform;
            pillarDom.querySelector('.slice-single').style.transform = sliceTransform;
        }
    }

    function initSides(){
        for(let x in sides){
            if(typeof sliceMoveTrack[x] === "undefined"){
                sliceMoveTrack[x] = [];
            }
            if(sides.hasOwnProperty(x)){
                for(let [i, item1] of sides[x].entries()){
                    if(typeof sliceMoveTrack[x][i] === "undefined"){
                        sliceMoveTrack[x][i] = [];
                    }
                    for(let [j, item2] of item1.entries()){
                        var pillar = sliceCon.querySelector(`.slice-single-pillar[data-id="${item2}"]`);
                        var pillarTransform = `rotateX(${sideAngles[item2].pillar[0]}deg) rotateY(${sideAngles[item2].pillar[1]}deg) rotateZ(${sideAngles[item2].pillar[2]}deg)`;
                        var sliceTransform = `rotateX(${sideAngles[item2].slice[0]}deg) rotateY(${sideAngles[item2].slice[1]}deg) rotateZ(${sideAngles[item2].slice[2]}deg)`;
                        if(typeof sliceMoveTrack[x][i][j] === "undefined"){
                            sliceMoveTrack[x][i][j] = x;
                        }
                        if(pillar){
                            pillar.setAttribute('data-current-side', x);
                            pillar.setAttribute('data-current-pos-i', i);
                            pillar.setAttribute('data-current-pos-j', j);
                            pillar.style.transform = pillarTransform;
                            pillar.querySelector('.slice-single').style.transform = sliceTransform;
                            pillar.querySelector('.slice-single .slice').style.top = sideAngles[item2].pos[0]+'px';
                            pillar.querySelector('.slice-single .slice').style.left = sideAngles[item2].pos[1]+'px';
                            pillar.querySelector('.slice-single .slice .slice-move').style.top = '0px';
                            pillar.querySelector('.slice-single .slice .slice-move').style.left = '0px';
                            pillar.querySelector('.slice-single .slice-back').style.top = sideAngles[item2].pos[0]+'px';
                            pillar.querySelector('.slice-single .slice-back').style.left = sideAngles[item2].pos[1]+'px';
                            sliceMoveTrack[pillar.getAttribute('data-org-side')][i][j] = x;
                        }
                        else{
                            let tempHtml = `
                                    <div class="slice-single" style="transform: ${sliceTransform};">
                                        <div class="slice" style="top:${sideAngles[item2].pos[0]}px;left:${sideAngles[item2].pos[1]}px;">
                                            <div class="slice-move" style="background:${sideColor[x]};">
                                                ${i},${j}
                                            </div>
                                            <div class="slice-move-helper" data-pos="up"></div>
                                            <div class="slice-move-helper" data-pos="down"></div>
                                            <div class="slice-move-helper" data-pos="left"></div>
                                            <div class="slice-move-helper" data-pos="right"></div>
                                        </div>
                                        <div class="slice-back" style="top:${sideAngles[item2].pos[0]}px;left:${sideAngles[item2].pos[1]}px;">
                                            <div class="slice-back-child slice-back-f"></div>
                                            <div class="slice-back-child slice-back-r"></div>
                                            <div class="slice-back-child slice-back-b"></div>
                                            <div class="slice-back-child slice-back-l"></div>
                                            <div class="slice-back-child slice-back-u"></div>
                                            <div class="slice-back-child slice-back-d"></div>
                                        </div>
                                    </div>`;

                            let temp = document.createElement('div');
                            temp.classList.add('slice-single-pillar');
                            temp.setAttribute('data-id' , item2);
                            temp.setAttribute('data-org-side' , x);
                            temp.setAttribute('data-current-side' , x);
                            temp.setAttribute('data-org-pos-i' , i);
                            temp.setAttribute('data-org-pos-j' , j);
                            temp.setAttribute('data-current-pos-i' , i);
                            temp.setAttribute('data-current-pos-j' , j);
                            temp.style.transform = pillarTransform;
                            temp.innerHTML = tempHtml;

                            sliceCon.appendChild(temp);
                            cubeContainer.querySelectorAll('.command-btns .command-btn[data-side="'+x+'"]').forEach(btn => { btn.style.backgroundColor = sideColor[x]; });
                        }
                    }
                }
            }
        }
    }

    function sliceMoveToExecute(id, dir, initial, i){
        if(id == initial && i > 0){
            return;
        }
        let nextStep = sliceMoveTo[id][dir];
        let nextDir = dir;
        if(typeof nextStep === "object"){
            nextDir = nextStep[1];
            nextStep = nextStep[0];
        }
        sliceMoveTowardsAnother(id, dir, JSON.parse(JSON.stringify(sideAngles[id])));
        alterIds.push({
            dom: sliceCon.querySelector('.slice-single-pillar[data-id="'+id+'"]'),
            nextStepDom: sliceCon.querySelector('.slice-single-pillar[data-id="'+nextStep+'"]'),
            id: id,
            nextStep: nextStep,
        });
        
        i++;
        sliceMoveToExecute(nextStep, nextDir, initial, i);
    }

    function rotateSliceMoveLine(axis, no, dir, releaseUserAction){
        if(typeof releaseUserAction === "undefined"){
            releaseUserAction = true;
        }
        var line = sliceMoveLine[`${axis}-${no}`];
        var surfaceDir = 'clock';
        if(
            ( axis == 'x' && no == 1 && dir == 'right' ) || 
            ( axis == 'x' && no == 3 && dir == 'left' ) || 
            ( axis == 'y' && no == 1 && dir == 'up' ) || 
            ( axis == 'y' && no == 3 && dir == 'down' ) || 
            ( axis == 'z' && no == 1 && dir == 'left' ) || 
            ( axis == 'z' && no == 3 && dir == 'right' )
        ){ surfaceDir = 'counterClock' };
        var regular = line.regular;
        var surface = line.surface;
        alterIds = [];

        for(let item of regular){
            sliceMoveToExecute(item, dir, item, 0);
        }
        for(let item of surface){
            sliceMoveToExecute(item, surfaceDir, item, 0);
        }
        initSidesDelay(releaseUserAction);
    }

    function initSidesDelay(releaseUserAction){
        if(typeof releaseUserAction === "undefined"){
            releaseUserAction = true;
        }
        setTimeout(function(){
            transition(false);
            setTimeout(function(){
                for(let item of alterIds){
                    item.dom.setAttribute('data-id', item.nextStep);
                }
                alterIds = [];
                initSides();
                setTimeout(function(){
                    transition(true);
                    if(releaseUserAction){
                        setTimeout(function(){
                            adjustCommandBtnColor();
                            checkSliceMoveTrack();
                            holdUserAction = false;
                        }, transitionTimeDelay);
                    }
                }, transitionTimeDelay);
            }, transitionTimeDelay);
            
        }, transitionTime + transitionTimeDelay);
    }

    var commandQueue = [];

    function processCommandQueue(){
        if(!holdUserAction){
            if(commandQueue.length){
                let currentCommand = commandQueue.shift();
                if(currentCommand == 'slow' || currentCommand == 'fast' || currentCommand == 'hold' || currentCommand == 'free'){
                    if(currentCommand == 'hold'){
                        holdSliceRotation = true;
                    }
                    else if(currentCommand == 'free'){
                        holdSliceRotation = false;
                    }
                    else if(currentCommand == 'slow'){
                        transitionLow(false);
                    }
                    else if(currentCommand == 'fast'){
                        transitionLow(true);
                    }
                }
                else{
                    command(currentCommand);
                }
            }
        }
        setTimeout(processCommandQueue, (transitionTime + (transitionTimeDelay * 4)));
    }

    function command(name){
        if(!holdUserAction){
            holdUserAction = true;
            var double = false;
            let axis = null;
            let no = 0;
            let dir = null;
            if(name == "F-clock")               { axis = 'z';     no = 1;     dir = 'right';    double = false; }
            else if(name == "F-counterClock")   { axis = 'z';     no = 1;     dir = 'left';     double = false; }
            else if(name == "F-2")              { axis = 'z';     no = 1;     dir = 'right';    double = true; }
            else if(name == "B-clock")          { axis = 'z';     no = 3;     dir = 'left';     double = false; }
            else if(name == "B-counterClock")   { axis = 'z';     no = 3;     dir = 'right';    double = false; }
            else if(name == "B-2")              { axis = 'z';     no = 3;     dir = 'left';     double = true; }
            else if(name == "R-clock")          { axis = 'y';     no = 3;     dir = 'up';       double = false; }
            else if(name == "R-counterClock")   { axis = 'y';     no = 3;     dir = 'down';     double = false; }
            else if(name == "R-2")              { axis = 'y';     no = 3;     dir = 'up';       double = true; }
            else if(name == "L-clock")          { axis = 'y';     no = 1;     dir = 'down';     double = false; }
            else if(name == "L-counterClock")   { axis = 'y';     no = 1;     dir = 'up';       double = false; }
            else if(name == "L-2")              { axis = 'y';     no = 1;     dir = 'down';     double = true; }
            else if(name == "U-clock")          { axis = 'x';     no = 1;     dir = 'left';     double = false; }
            else if(name == "U-counterClock")   { axis = 'x';     no = 1;     dir = 'right';    double = false; }
            else if(name == "U-2")              { axis = 'x';     no = 1;     dir = 'left';     double = true; }
            else if(name == "D-clock")          { axis = 'x';     no = 3;     dir = 'right';    double = false; }
            else if(name == "D-counterClock")   { axis = 'x';     no = 3;     dir = 'left';     double = false; }
            else if(name == "D-2")              { axis = 'x';     no = 3;     dir = 'right';    double = true; }
            else if(name == "Z-M-clock")        { axis = 'z';     no = 2;     dir = 'right';    double = false; }
            else if(name == "Z-M-counterClock") { axis = 'z';     no = 2;     dir = 'left';     double = false; }
            else if(name == "Z-M-2")            { axis = 'z';     no = 2;     dir = 'right';    double = true; }
            else if(name == "X-M-clock")        { axis = 'x';     no = 2;     dir = 'left';     double = false; }
            else if(name == "X-M-counterClock") { axis = 'x';     no = 2;     dir = 'right';    double = false; }
            else if(name == "X-M-2")            { axis = 'x';     no = 2;     dir = 'left';     double = true; }
            else if(name == "Y-M-clock")        { axis = 'y';     no = 2;     dir = 'up';       double = false; }
            else if(name == "Y-M-counterClock") { axis = 'y';     no = 2;     dir = 'down';     double = false; }
            else if(name == "Y-M-2")            { axis = 'y';     no = 2;     dir = 'up';       double = true; }

            if(axis && no && dir ){
                rotateSliceMoveLine(axis, no, dir, !double);
                if(double){
                    setTimeout(function(){
                        rotateSliceMoveLine(axis, no, dir, double);
                    }, transitionTime + (transitionTimeDelay * 4));
                }
            }
            else{
                holdUserAction = false;
            }
        }
    }

    function adjustCommandBtnColor(){
        cubeContainer.querySelectorAll(".command-btns .command-btn").forEach(el => {
            var side = el.getAttribute('data-side');
            var sideCenter = sliceCon.querySelector('.slice-single-pillar[data-current-side="'+side+'"][data-current-pos-i="1"][data-current-pos-j="1"]');
            el.style.backgroundColor = sideColor[sideCenter.getAttribute('data-org-side')]
        });
    }

    function checkSliceMoveTrack(){
        var seq = [];
        if(playing){
            for(var x in sliceMoveTrack){
                if(sliceMoveTrack.hasOwnProperty(x)){
                    let tempSeq = '';
                    for(var item of sliceMoveTrack[x]){
                        tempSeq += item.join('');
                    }
                    seq.push(tempSeq);
                }
            }
            seq.sort();
            if(seq.join('-') == 'bbbbbbbbb-ddddddddd-fffffffff-lllllllll-rrrrrrrrr-uuuuuuuuu'){
                playing = false;
                alert('Congratulation, you have solved the Qube');
            }
        }
        return seq;
    }

    function scrumble(){
        var moves = [
            'F-clock','F-counterClock',
            'R-clock','R-counterClock',
            'L-clock','L-counterClock',
            'B-clock','B-counterClock',
            'U-clock','U-counterClock',
            'D-clock','D-counterClock',
        ];
        var seq = ['hold', 'fast'];
        var totalRotate = getRandomInt(10,15);
        for(var i = 0; i < totalRotate; i++){
            seq.push(moves[getRandomInt(0, moves.length-1)]);
        }
        seq.push('slow', 'free');
        playing = true;
        commandQueue = seq;
        processCommandQueue();
    }

    checkScreenSize();
    initSides();
    transition();
    setTimeout(processCommandQueue, (transitionTime + (transitionTimeDelay * 4)));

    document.querySelectorAll('.command-btns .command-btn').forEach(el => {
        el.addEventListener('click', function(e){
            e.preventDefault();
            if(!holdSliceRotation){
                // console.log('command', Date.now())
                var c = el.getAttribute('data-command');
                commandQueue.push(c);
                processCommandQueue();
            }
        });
    });

    document.querySelector('.command-btns .scrumble').addEventListener('click', function(e){
        e.preventDefault();
        scrumble();
    });

    var currentMovingSlice = null;
    function cubeMouseUp(event){
        currentMovingSlice = null;
        sliceCon.removeEventListener('mousemove', cubeMouseMove);
        sliceCon.removeEventListener('touchmove', cubeMouseMove);
        sliceCon.querySelectorAll('.slice-move-helper').forEach(el => {
            el.style.display = "none";
        })
        sliceCon.querySelectorAll('.slice-move.moving').forEach(el => {
            el.classList.remove('moving');
        })
    }

    function cubeMouseMove(event){
        event.preventDefault();
        if(currentMovingSlice && !holdUserAction){
            if(event.type == 'touchmove'){
                var topElement = document.elementFromPoint(event.touches[0].pageX, event.touches[0].pageY);
            }
            else{
                var topElement = document.elementFromPoint(event.pageX, event.pageY);
            }
            if(!topElement || !topElement.classList.contains('slice-move-helper')){
                topElement = null;
            }
            if(topElement){
                let dir = topElement.getAttribute('data-pos');
                let currentMovingSliceParent = currentMovingSlice.closest('.slice-single-pillar');
                let currentSide = currentMovingSliceParent.getAttribute('data-current-side');
                let currentPosi = _parseInt(currentMovingSliceParent.getAttribute('data-current-pos-i')) + 1;
                let currentPosj = _parseInt(currentMovingSliceParent.getAttribute('data-current-pos-j')) + 1;

                sliceCon.removeEventListener('mousemove', cubeMouseMove);
                sliceCon.removeEventListener('touchmove', cubeMouseMove);
                cubeMouseUp();

                function swalPosIJ(pos){
                    if(pos == 3) return 1;
                    else if(pos == 1) return 3;
                    
                    return 2;
                }
                if(currentSide == 'f'){
                    if(dir == 'right' || dir == 'left'){ axis = 'x'; no = currentPosi; }
                    else if(dir == 'up' || dir == 'down'){ axis = 'y'; no = currentPosj; }
                }
                else if(currentSide == 'b'){
                    if(dir == 'right' || dir == 'left'){ axis = 'x'; no = currentPosi; }
                    else if(dir == 'up' || dir == 'down'){ 
                        axis = 'y'; 
                        no = swalPosIJ(currentPosj); 
                        if(dir == 'up') dir = 'down';
                        else dir = 'up';
                    }
                }
                else if(currentSide == 'l'){
                    if(dir == 'right' || dir == 'left'){ axis = 'x'; no = currentPosi; }
                    else if(dir == 'up' || dir == 'down'){ 
                        axis = 'z'; 
                        no = swalPosIJ(currentPosj); 
                        if(dir == 'up') dir = 'right';
                        else dir = 'left';
                    }
                }
                else if(currentSide == 'r'){
                    if(dir == 'right' || dir == 'left'){ axis = 'x'; no = currentPosi; }
                    else if(dir == 'up' || dir == 'down'){ 
                        axis = 'z'; 
                        no = currentPosj; 
                        if(dir == 'up') dir = 'left';
                        else dir = 'right';
                    }
                }
                else if(currentSide == 'u'){
                    if(dir == 'right' || dir == 'left'){ axis = 'z'; no = swalPosIJ(currentPosi); }
                    else if(dir == 'up' || dir == 'down'){ axis = 'y'; no = currentPosj; }
                }
                else if(currentSide == 'd'){
                    if(dir == 'right' || dir == 'left'){ 
                        axis = 'z'; 
                        no = currentPosi; 
                        if(dir == 'left') dir = 'right';
                        else dir = 'left';
                    }
                    else if(dir == 'up' || dir == 'down'){ axis = 'y'; no = currentPosj; }
                }
                holdUserAction = true;
                rotateSliceMoveLine(axis, no, dir);
            }
        }
    }

    function cubeMouseDown(event){
        // console.log(event.type, event.which)
        event.preventDefault();
        if(event.type == 'mousedown' && event.which != 1){
            return;
        }
        if(!holdSliceRotation){
            var el = this;
            el.classList.add('moving');
            currentMovingSlice = el;
            var parent = el.closest('.slice');
            parent.querySelectorAll('.slice-move-helper').forEach(el => {
                el.style.display = 'block';
            });
            sliceCon.addEventListener('mousemove', cubeMouseMove);
            sliceCon.addEventListener('touchmove', cubeMouseMove);
            document.addEventListener('mouseup', cubeMouseUp);
            document.addEventListener('mouseup', cubeMouseUp);
        }
    }

    sliceCon.querySelectorAll('.slice-move').forEach(el => {
        el.addEventListener('mousedown', cubeMouseDown);
        el.addEventListener('touchstart', cubeMouseDown);
    });

    window.addEventListener('resize', function(event) {
        checkScreenSize();
    }, true);
});


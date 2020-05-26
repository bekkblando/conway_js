var counter = 1
var width, height, total
var executions = []
var stepper = 1
var window_width = window.innerWidth
var window_height = window.innerHeight
var playing = false
var rewinding = false
var intervalID
var rewindID
var speed = 500
var container_history = []
var hist_id = 0

var save_dead_cells = () => {
    container_history.push(Array.from(document.getElementsByClassName('dead')).map((element) => {
        return element.id
    }))
}

var load_state = (data) => {
    Array.from(document.getElementsByClassName('cell')).map((cell) => {
        live = !document.getElementById(cell.id).classList.contains('dead')
        if(data.includes(cell.id) && live){
            cell.classList.toggle('dead')
        }else if((!data.includes(cell.id)) && !live){
            cell.classList.toggle('dead')
        }
    })
}

var back = () => {
    if(hist_id < 1){
        window.clearInterval(rewindID)
        hist_id = 0
        return;
    }
    hist_id -= 1
    load_state(container_history[hist_id])
    container_history.length = hist_id
    return false;
}

var rewind = () => {
    speed = document.getElementById("speed").value
    rewinding = rewinding ? false : true
    console.log(hist_id)
    if(rewinding && hist_id > 0) { 
        rewindID = window.setInterval(back, speed) 
    }else window.clearInterval(rewindID);
    return false;
}



var random_state = () => {
    stepper = 1
    const percent = document.getElementById("percent").value
    apply_random_state(percent)
}

var apply_random_state = (percent) => {
    if(stepper <= total){
        random_number = Math.ceil(Math.random() * 100)
        if(random_number <= percent){
            birth(stepper);
        }
        stepper++;
        apply_random_state(percent);
    }
}


var calculate_board = () => {
    dets = document.getElementById('cellContainer').getBoundingClientRect()
    window_width =  dets.width;
    window_height = dets.height;
    width = parseInt((65 * window_width)/1440)
    height = parseInt(window_height/20)
    total = (width * height)
    return width, height, total
}



// Whatever the width is needs to be divisible by 21 and 


render = () => {
    counter = 1
    width, height, total = calculate_board()

    var createDiv = () => {

        if(counter <= total){
            var newDiv = document.createElement('div')
            newDiv.classList.add('cell')
            newDiv.classList.add('dead')
            newDiv.setAttribute("id", counter)
            newDiv.addEventListener('click', function (event) {
                event.target.classList.toggle('dead')
                });
            document.getElementById("cellContainer").appendChild(newDiv)
            counter++
            createDiv()
        }

    }

    createDiv(); // Runs height*width times

}

render()

// DEBUG
var debugCell = -1


var checkLiveNeighbors = (cell) => {
    // We need to check: if(top) { if(left)}, if()
    // Check MiTop if not on top
    onTop = cell <= width
    onLeftBar = !((cell - 1)%width)
    onRightBar = !(cell%width)
    onBottom = cell >= (total - width)

    var live = 0
    if(!onTop){
            if(cell === debugCell) console.log("Top: ", !document.getElementById(cell - width).classList.contains('dead'));
            if(!document.getElementById(cell - width).classList.contains('dead')) live++
    }

    if(!onBottom){
            if(cell === debugCell) console.log("Bottom: ", !document.getElementById(cell + width).classList.contains('dead'));
            if(!document.getElementById(cell + width).classList.contains('dead')) live++
    }

    if(!onLeftBar){
        if(cell === debugCell) console.log("Not on Left Bar");
        if(!document.getElementById(cell - 1).classList.contains('dead')) live++
        if(!onTop){
            if(!document.getElementById(cell - 1 - width).classList.contains('dead')) live++
        }
        
        if(!onBottom){
            if(cell === debugCell) console.log("Bottom Left: ", !document.getElementById(cell - 1 + 65).classList.contains('dead'));
            if(!document.getElementById(cell - 1 + width).classList.contains('dead')) live++
        }
    }


    if(!onRightBar){
        if(cell === debugCell) console.log("Not on Right Bar");
        if(!document.getElementById(cell + 1).classList.contains('dead')) live++
        if(!onTop){
            if(!document.getElementById(cell + 1 - width).classList.contains('dead')) live++
        }
        
        if(!onBottom){
            if(cell === debugCell) console.log("Bottom Right: ", !document.getElementById(cell + 1 + 65).classList.contains('dead'));
            if(!document.getElementById(cell + 1 + width).classList.contains('dead')) live++
        }
    }

    if(cell === debugCell) console.log("Living cells surrounding: ", live)
    return live;
}

// Vars


var applyRules = () => {

    if(stepper <= total){
    if(stepper === debugCell) console.log("This is the stepper input: ", stepper);
    executions.push(liveOrDie(checkLiveNeighbors(stepper), stepper))
        stepper++
        applyRules()
    }

}

var step = () => {
    stepper = 1
    executions = []
    applyRules()
    save_dead_cells()
    hist_id++;
    executions.map((func) => func())
    return false;
}

var kill = (cell) => {
    document.getElementById(cell).classList.toggle('dead')
}

var birth = (cell) => {
    document.getElementById(cell).classList.toggle('dead')
}

var liveOrDie = (liveCells, cell) => {
    if(cell === debugCell) console.log("This is liveCells in the rules", liveCells);
    live = !document.getElementById(cell).classList.contains('dead')
    // 1: Check for Under Population
    if(liveCells < 2 && live) return () => { kill(cell) };
    // 2: Check for Over Population
    if(liveCells > 3 && live) return () => { kill(cell) };

    // 4: Check for birth
    if(liveCells === 3 && !live) return () => { birth(cell) };

    // 3: Check for Survive
    return () => {}

}




var togglePlay = () => {
    speed = document.getElementById("speed").value
    playing = playing ? false : true
    if(playing) { 
        intervalID = window.setInterval(step, speed) 
    }else window.clearInterval(intervalID);
    return false;
}

var clearCells = () => {
    var cellContainer = document.getElementById("cellContainer");
    while (cellContainer.firstChild) {
        cellContainer.removeChild(cellContainer.firstChild);
    }
}

// Reload Page
window.onresize = () => {
    if(Math.abs(window_width - window.innerWidth) < 30) return;
    if(Math.abs(window_height - window.innerHeight) < 30) return;
    clearCells()
    render()
}
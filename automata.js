var counter = 1
var calculate_board = () => {
    width = parseInt((screen.width - 75)/21)
    height = screen.height/20
    total = (width * height)
    return width, height, total
}

var width, height, total = calculate_board()

var createDiv = () => {

  if(counter <= total){
    var newDiv = document.createElement('div')
    newDiv.classList.add('cell')
    newDiv.classList.add('dead')
    newDiv.setAttribute("id", counter)
    newDiv.addEventListener('click', function (event) {
          event.target.classList.toggle('dead')
        });
    document.body.appendChild(newDiv)
    counter++
    createDiv()
  }

}

createDiv(); // Runs 100 times


var checkLiveNeighbors = (cell) => {
    // We need to check: if(top) { if(left)}, if()
    // Check MiTop if not on top
    onTop = cell <= 65
    onLeftBar = !((cell - 1)%65)
    onRightBar = !(cell%65)
    onBottom = cell >= 2860

    var live = 0
    var debugCell = -1
    if(!onTop){
        if(!document.getElementById(cell - 65).classList.contains('dead')) live++
    }

    if(!onBottom){
        if(!document.getElementById(cell + 65).classList.contains('dead')) live++
    }

    if(!onLeftBar){
        if(cell === debugCell) console.log("Not on Left Bar");
        if(!document.getElementById(cell - 1).classList.contains('dead')) live++
        if(!onTop){
            if(!document.getElementById(cell - 1 - 65).classList.contains('dead')) live++
        }
        
        if(!onBottom){
            if(cell === debugCell) console.log("Bottom Left: ", !document.getElementById(cell - 1 + 65).classList.contains('dead'));
            if(!document.getElementById(cell - 1 + 65).classList.contains('dead')) live++
        }
    }


    if(!onRightBar){
        if(cell === debugCell) console.log("Not on Right Bar");
        if(!document.getElementById(cell + 1).classList.contains('dead')) live++
        if(!onTop){
            if(!document.getElementById(cell + 1 - 65).classList.contains('dead')) live++
        }
        
        if(!onBottom){
            if(cell === debugCell) console.log("Bottom Right: ", !document.getElementById(cell + 1 + 65).classList.contains('dead'));
            if(!document.getElementById(cell + 1 + 65).classList.contains('dead')) live++
        }
    }

    return live;
}

// Vars
var executions = []
var stepper = 1;

var applyRules = () => {

    if(stepper <= total){
        executions.push(liveOrDie(checkLiveNeighbors(stepper), stepper))
        stepper++
        applyRules()
    }

}

var step = () => {
    stepper = 1
    executions = []
    applyRules()
    executions.map((func) => func())
}

var kill = (cell) => {
    document.getElementById(cell).classList.toggle('dead')
}

var birth = (cell) => {
    document.getElementById(cell).classList.toggle('dead')
}

var liveOrDie = (liveCells, cell) => {
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

var playing = false;
var intervalID;
var speed = 500
var togglePlay = () => {
    speed = document.getElementById("speed").value
    playing = playing ? false : true
    if(playing) { 
        intervalID = window.setInterval(step, speed) 
    }else window.clearInterval(intervalID);
}



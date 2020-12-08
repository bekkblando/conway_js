
// Defined in automata.js
width, height, total = calculate_board()
console.log(width, height, total)
window.AudioContext = window.AudioContext||window.webkitAudioContext;




  const soundToBoard = (bufferClip) => {
      console.log("Sound: ", bufferClip)
  }

  const process = (Data) => {
    const context = new AudioContext();
    source = context.createBufferSource(); // Create Sound Source
    context.decodeAudioData(Data, function(buffer){
      source.buffer = buffer;
      console.log("First Buffer: ", buffer)
      const processor = context.createScriptProcessor(256, buffer.numberOfChannels, buffer.numberOfChannels);
      var lastCells = [];
      
      processor.onaudioprocess = (audioProcessingEvent) => { 
        //   console.log(context.currentTime)
        //   console.log(buffer)
        // The input buffer is the song we loaded earlier
        var inputBuffer = audioProcessingEvent.inputBuffer;

        // The output buffer contains the samples that will be modified and played
        var outputBuffer = audioProcessingEvent.outputBuffer;
        // Loop through the output channels (in this case there is only one)
        var inputData0 = inputBuffer.getChannelData(0);
        var outputData0 = outputBuffer.getChannelData(0);
        var inputData1 = inputBuffer.getChannelData(1);
        var outputData1 = outputBuffer.getChannelData(1);
        // console.log("New Channel")
        // Loop through the 4096 samples
        if(!(lastCells.length%40)){
            lastCells.forEach((cell) => cell.setAttribute("class", 'cell dead'))
            lastCells = []
        }
        for (var sample = 0; sample < inputBuffer.length; sample++) {
            // make output equal to the same as the input

            if(!sample%4){
                const normalizedX = Math.round(inputData0[sample]*(width/2))
                const normalizedY = Math.round(inputData1[sample]*(height/2))
                const cell = document.querySelector(`[x="${normalizedX}"][y="${normalizedY}"]`)
                // console.log(inputData0[sample], inputData1[sample], normalizedX, normalizedY, cell)
                if(cell){
                    if(cell.classList.contains('dead'))
                        cell.classList.toggle('dead');
                    lastCells.push(cell)
                }

            }
            outputData0[sample] = inputData0[sample];
            outputData1[sample] = inputData1[sample];

        }
      }
      source.onended = () => {
        source.disconnect(processor);
        processor.disconnect(audioCtx.destination);
      }
      source.connect(processor);
      processor.connect(context.destination); 
      source.start(context.currentTime);
  })
}


const loadSound = () => {
  const videoId = document.getElementById('youtube').value
    var request = new XMLHttpRequest();
    request.open("GET", `http://localhost:8080/youtube/${videoId}`, true); 
    request.responseType = "arraybuffer"; 
  
    request.onload = function() {
        var Data = request.response;
        console.log("Data Recieved: ", Data)
        process(Data);
    };
    console.log("Get sound")
    request.send();
  }
  

  document.getElementById('sound').addEventListener('click', loadSound)
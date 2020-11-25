
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
      var lastCells = 0;
      
      processor.onaudioprocess = (audioProcessingEvent) => { 
          console.log("Money Running")
        //   console.log(context.currentTime)
        //   console.log(buffer)
        // The input buffer is the song we loaded earlier
        var inputBuffer = audioProcessingEvent.inputBuffer;

        // The output buffer contains the samples that will be modified and played
        var outputBuffer = audioProcessingEvent.outputBuffer;
        // Loop through the output channels (in this case there is only one)
        for (var channel = 0; channel < outputBuffer.numberOfChannels; channel++) {
            var inputData = inputBuffer.getChannelData(channel);
            var outputData = outputBuffer.getChannelData(channel);
            // console.log("New Channel")
            // Loop through the 4096 samples
            for (var sample = 0; sample < inputBuffer.length; sample++) {
                // make output equal to the same as the input
                if(!sample%4){
                    const normalizedY = Math.abs(inputData[sample])*height
                    const cellId = ~~(Math.floor(sample%width + normalizedY*width))
                    document.getElementById(cellId).classList.toggle('dead')
                    if(lastCells.length && !sample%5){
                        lastCells.forEach((cellId) => document.getElementById(cellId).classList.toggle('dead'))
                    }
                    lastCells.push(cellId)
                }


                outputData[sample] = inputData[sample];
            }
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
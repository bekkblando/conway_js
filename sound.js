fetch('localhost:3000').then((response) => {
    console.log(response)
})


document.getElementById('sound').addEventListener('click', function() {
    var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    var analyser = audioCtx.createAnalyser();
    
    analyser.fftSize = 2048;
    var bufferLength = analyser.frequencyBinCount;
    var dataArray = new Uint8Array(bufferLength);
    analyser.getByteFrequencyData(dataArray);
    intervalID = window.setInterval(() => console.log(dataArray), 1000) 
});

class VisualProcessor extends window.AudioWorkletProcessor {
    constructor() {
        console.log('Constructing myworkletprocessor');
        super();
    }

    process(inputs, outputs, parameters) {
        console.log(`current time: ${currentTime}`, inputs, outputs, parameters);
        // True to keep running
        return true;
    }
}

registerProcessor('visual-processor', VisualProcessor)
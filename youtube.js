var express = require('express')
var app = express()

const decoder = require('lame').Decoder
var youtubeStream = require('youtube-audio-stream')


var getAudio = function (videoId) {
    var requestUrl = 'http://youtube.com/watch?v=' + videoId
    try {
        youtubeStream(requestUrl).pipe(decoder())
    } catch (exception) {
        return(exception)
    }
}



app.get('/', function (req, res) {
  exception = getAudio("34aQNMvGEZQ")
  res.status(500).send(exception)
})

app.listen(3000)
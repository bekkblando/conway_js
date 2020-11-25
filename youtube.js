const { exception } = require('console')
var express = require('express')
var app = express()
var fs = require('fs')
var path = require('path');


// const decoder = require('lame').Decoder

const ytdl = require('ytdl-core');
// const decode = (sound) => {
//     console.log("Sound Data: ", sound)
//     decoder.decode(sound)
// }

// var getAudio = function (videoId) {
//     try {
//         return .on('readable', () => {
//             console.log("Reading Stream", readableStream.read())
//           })
//     } catch (exception) {
//         console.log("Exception: ", exception)
//         return exception
//     }
// }

const getVideo = (videoId) => {
    console.log("Processing: ", videoId)
    const vid = ytdl(`http://www.youtube.com/watch?v=${videoId}`)
    console.log("Video Format", vid, vid.videoFormat, vid.videoInfo)
    return vid
}

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


app.get('/youtube/:id', (req, res) => {
    const videoId = req.params.id
    const vid = getVideo(videoId)
    vid.pipe(res);
    console.log("Completed Request")
  })


// Constants
const PORT = 8080;
const HOST = '0.0.0.0';
const staticFolder = path.join(__dirname, '/public')
console.log("Static Folder: ", staticFolder)
app.use('/public', express.static(staticFolder))
app.listen(PORT, HOST)
console.log(`Running on http://${HOST}:${PORT}`);

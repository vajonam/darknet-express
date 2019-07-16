var express = require('express')
var multer = require('multer')
var upload = multer({ dest: 'uploads/' })
var fs = require('fs')
require('log-timestamp');

var app = express()

const { Darknet } = require('../darknet');

const darknet = new Darknet({
    weights: 'yolov3.weights',
    config: 'yolov3.cfg',
    namefile: 'coco.names'
});

const darknet_tiny = new Darknet({
    weights: 'yolov3-tiny.weights',
    config: 'yolov3-tiny.cfg',
    namefile: 'coco.names'
});

app.post('/yolo', upload.single('photo'), function (req, res, next) {
  var filename = `./${req.file.destination}${req.file.filename}`
  console.log(`-- yolo received --: ${filename}`)
  var predictions = "";
  try {
	console.time("Detection");
      predictions = darknet.detect(filename);
	console.timeEnd("Detection");

}  catch (err)  {
  console.log(`-- yolo: --:${err.message}`);
} 
  var result = "";

predictions.forEach(function (prediction) {
	
  	result += prediction.name + ":" + prediction.prob.toFixed(2) + ","; 


});
	console.log(`-- yolo: predictions --: ${result}`);
  res.json(predictions);
  fs.unlink(filename, d => {})
  console.log(`-- yolo processed  --: ${filename}`)

})


app.post('/yolo-tiny', upload.single('photo'), function (req, res, next) {
  var filename = `./${req.file.destination}${req.file.filename}`
  console.log(`-- yolo-tiny received --: ${filename}`)
  var predictions = "";
  try { 
	console.time("Detection");
      predictions = darknet_tiny.detect(filename);
	console.timeEnd("Detection");

}  catch (err)  {
  console.log(`-- yolo-tiny: --:${err.message}`);
}
  var result = "";
  
predictions.forEach(function (prediction) {

        result += prediction.name + ":" + prediction.prob.toFixed(2) + ",";


});

	console.log(`-- yolo: predictions --: ${result}`);
  res.json(predictions);
  fs.unlink(filename, d => {})
  console.log(`-- yolo-tiny processed  --: ${filename}`)

})

app.listen(3000, function () {
  console.log('darknet app listening on port :3000')
})

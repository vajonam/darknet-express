var express = require('express')
var multer = require('multer')
var upload = multer({ dest: 'uploads/' })
var fs = require('fs')
require('log-timestamp');

var app = express()

const { Darknet } = require('darknet');

const darknet = new Darknet({
  weights: 'yolov4.weights',
  config: 'yolov4.cfg',
  namefile: 'coco.names'
});

app.post('/yolo', upload.single('photo'), function (req, res, next) {
  var filename = `./${req.file.destination}${req.file.filename}`
  console.log(`-- yolo received --: ${filename}`)
  if (req.file.size < 100) {
    fs.unlink(filename, d => { })
    console.log(`-- invalid file`);
    res.json({});
    return;
      
  }
  
  var predictions = "";
  try {
    console.time("Detection");
    predictions = darknet.detect(filename);
    console.timeEnd("Detection");

  } catch (err) {
    console.log(`-- yolo: --:${err.message}`);
  }
  var result = "";

  const { createCanvas, loadImage } = require('canvas')


  loadImage(filename).then((image) => {

    const canvas = createCanvas(image.width, image.height);
    const ctx = canvas.getContext('2d')
    ctx.drawImage(image, 0, 0)
    ctx.strokeStyle = 'rgba(255,0,0,1)';
    ctx.lineWidth = 2;
    predictions.forEach(function (prediction) {
      var result = prediction.name + " : " +  (Math.ceil(prediction.prob*20 - 0.5)/20).toFixed(2) + "%";
      ctx.lineWidth = 2;
      ctx.fillStyle = 'rgba(255,0,0,0.20)';
      ctx.fillRect(prediction.box.x-prediction.box.w/2, prediction.box.y-prediction.box.h/2, prediction.box.w, prediction.box.h);
      ctx.lineWidth = 1;
      ctx.font = '40px';
      ctx.fillStyle = 'rgba(255,255,255,1)';
      ctx.fillText(result, (prediction.box.x-prediction.box.w/2)+10,  (prediction.box.y-prediction.box.h/2)+20);
    });
    fs.writeFileSync('/tmp/test.png', canvas.toBuffer());
    var retrunValue = {};

    retrunValue.predictions = predictions;
    retrunValue.image = canvas.toDataURL("image/jpeg");
    console.log(`-- yolo: predictions start :`);
    console.log(retrunValue.predictions);
    console.log(`-- yolo: predictions end :`);
    res.json(retrunValue);
    fs.unlink(filename, d => { })
    console.log(`-- yolo processed  --: ${filename}`)
  

  });


  })

app.listen(3000, function () {
  console.log('darknet app listening on port :3000')
})

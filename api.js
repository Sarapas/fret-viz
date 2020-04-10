const { createCanvas, loadImage } = require('canvas')
const canvas = createCanvas(1942, 372)
const ctx = canvas.getContext('2d')
const fs = require('fs')

var stringTop1 = 92;
var stringBottom1 = 286;
var stringTop12 = 66;
var stringBottom12 = 310;

var frets = [ 162, 200, 190, 178, 170, 158, 152, 137, 134, 122, 120, 112]

var drawNote = (ctx, fret, string, isRoot, text) => {
  var black = "#000000";
  var red = "#FF0000";
  var white = "#FFFFFF"
  ctx.lineWidth = 1;
  ctx.strokeStyle = black;
  ctx.fillStyle = isRoot ? red : black;

  var fretPos = 0;
  for (var f = 0; f <= fret; fretPos += frets[f++]);

  var stringTop = stringTop1 - (stringTop1 - stringTop12) / 12 * fret;
  var stringBottom = stringBottom1 + (stringBottom12 - stringBottom1) / 12 * fret;
  var stringPos = stringTop + (stringBottom - stringTop) / 5 * string

  var R = 18;

  ctx.beginPath()
  ctx.arc(fretPos, stringPos, R, 0, Math.PI * 2, true)
  ctx.stroke()
  ctx.fill()

  ctx.beginPath()
  ctx.font = 'normal 20px Tahoma, serif'
  ctx.lineWidth = 1

  var m = ctx.measureText(text);

  var textX = fretPos - m.width / 2;
  var textY = stringPos + 8;

  ctx.strokeStyle = white;
  ctx.fillStyle = white;
  ctx.strokeText(text, textX, textY)
  ctx.fillStyle = white;
  ctx.fillText(text, textX, textY)
}

loadImage('./src/assets/fretboard-large.png').then((image) => {
  ctx.drawImage(image, 0, 0);

  for (var fret = 0; fret < 12; fret++) {
    for (var string = 0; string < 6; string++) {
      drawNote(ctx, fret, string, false, 'M7');
    }
  }

  const out = fs.createWriteStream(__dirname + '/out.png')
  const stream = canvas.createPNGStream()
  stream.pipe(out)
  out.on('finish', () =>  console.log('The PNG file was created.'))
})
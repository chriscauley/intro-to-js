var canvas = document.getElementById("canvas");
var WIDTH = canvas.width;
var HEIGHT = canvas.height;

// Keyboard Input
//-----------------
var rightDown = false;
var leftDown = false;

//set rightDown or leftDown if the right or left keys are down
function onKeyDown(event) {
  if (event.keyCode == 39) rightDown = true;
  else if (event.keyCode == 37) leftDown = true;
}

//and unset them when the right or left key is released
function onKeyUp(event) {
  if (event.keyCode == 39) rightDown = false;
  else if (event.keyCode == 37) leftDown = false;
}

document.addEventListener("keydown",onKeyDown);
document.addEventListener("keyup",onKeyUp);

// Mouse Input
//-------------------

function onMouseMove(event) {
  paddle.x = event.layerX-paddle.w/2;
}
canvas.addEventListener("mousemove",onMouseMove);

// Accelerometer 
//-----------------
function tilt(bg) {
  var max_angle = 60;
  var angle = bg[1]+max_angle/2;
  paddle.x = angle/max_angle*WIDTH;
  paddle.x = Math.min(paddle.x,WIDTH - paddle.w);
  paddle.x = Math.max(paddle.x,0);
}

if (window.DeviceOrientationEvent) {
    window.addEventListener("deviceorientation", function () {
        tilt([event.beta, event.gamma]);
    }, true);
} else if (window.DeviceMotionEvent) {
    window.addEventListener('devicemotion', function () {
        tilt([event.acceleration.x * 2, event.acceleration.y * 2]);
    }, true);
} else {
    window.addEventListener("MozOrientation", function () {
        tilt([orientation.x * 50, orientation.y * 50]);
    }, true);
}

// Drawing functions
//-----------------
var context = canvas.getContext("2d");
function rect(r) {
  context.fillStyle = r.color;
  context.beginPath();
  context.rect(r.x, r.y, r.w, r.h);
  context.fill();
  context.closePath();
}

function circle(c) {
  context.fillStyle = c.color;
  context.beginPath();
  context.arc(c.x, c.y, c.r, 0, Math.PI*2, true);
  context.fill();
  context.closePath();
}

function clear() { context.clearRect(0,0,WIDTH,HEIGHT); }

var brick_sprites = document.createElement("img");
brick_sprites.src = "brick_sprites.png";
function draw_brick(b) {
  context.drawImage(brick_sprites,b.sx,b.sy,b.sw,b.sh,b.x,b.y,b.w,b.h);
}

// Sound Functions
//-----------------
function Sound(src,repeat) {
  var elements = [];
  for (var i=0;i<repeat;i++) {
    var audio = document.createElement("audio");
    var mp3 = document.createElement("source");
    mp3.src = src + ".mp3";
    audio.appendChild(mp3);
    var wav = document.createElement("source");
    wav.src = src + ".wav";
    audio.appendChild(wav);
    elements.push(audio);
  }
  var last_played = 0;
  function play() {
    last_played +=1;
    if (last_played == repeat) {
      last_played = 0;
    }
    elements[last_played].play();
  }
  function stop() { elements[last_played].stop(); }
  function set_volume(level) {
    for (var i=0;i<elements.length;i++) { elements[i].volume=level; }
  }
  return {
    play: play,
    stop: stop,
    set_volume: set_volume
  }
}

var beep = new Sound("beep",8);
beep.set_volume(0.5);

// Initialize game variables
//-----------------
var paddle = {
  w: 60,
  h: 15,
  y: HEIGHT - 30,
  color: "white"
}

//where paddle is defined, give the paddle a dx
paddle.dx = 200;

paddle.x = WIDTH/2 - paddle.w/2;

var ball = {
  r: 10,
  y: HEIGHT - 45,
  dx: 150, // speed is in pixels per second
  dy: -150, // up is negative!
  color: "white"
}
ball.x = WIDTH/2;// arc is already centered!

var fps = 100;

function createBricks(o) {
  var out = [], x, y, col_max, color;
  var sw = 16;
  var sh = 8;
  var sprite_rows = [0,1,2,3,4,5,6,7];
  for (var row=0; row<o.rows; row++) {
    console.log(row)
    col_max = Math.floor(o.canvas.width / (o.w+o.separation));
    if (row%2 == 0) { col_max -=1; }
    y = (row+3)*(o.h + o.separation) + o.separation;
    for (var col=0; col<col_max; col++) {
      x = col*(o.separation + o.w) + o.separation;
      if (row%2 == 0) { x += o.w/2; }
      var sprite_row = sprite_rows[Math.floor((row+col)%sprite_rows.length)];
      sprite_col = Math.floor(Math.random()*5);
      var brick = {
        sx: sprite_col*sw,
        sy: sprite_row*sh,
        sw: sw,
        sh: sh,
        x: x, y: y, w: o.w, h: o.h, broken: false //old options
      };
      out.push(brick);
    }
  }
  return out;
}

var brick_options = {w: 40, h: 15, separation: 5, canvas: canvas, rows: 4};
var bricks = createBricks(brick_options);

function collide(ball,brick) {
  var out = { x: false, y: false };
  var d_left = ball.x - brick.x+ball.r;
  var d_right = brick.x + brick.w - ball.x+ball.r;
  var d_top = ball.y - brick.y+ball.r;
  var d_bot = brick.y + brick.h - ball.y+ball.r;
  if (d_left > 0 && d_right > 0 && d_top > 0 && d_bot > 0) {
    beep.play();
    if (Math.min(d_left,d_right) > Math.min(d_top,d_bot)) {
      out.y = true;
    }
    else {
      out.x = true;
    }
  }
  return out;
}

function collisions() {
  for (var i=0;i<bricks.length;i++) {
    var _b = bricks[i];
    if (!_b.broken) {
      var _c = collide(ball,_b);
      if (_c.x || _c.y) {
        _b.broken = true;
        if (_c.x) { ball.dx = -ball.dx }
        if (_c.y) { ball.dy = -ball.dy }
        continue;
      }
    }
  }

  _c = collide(ball,paddle);
  if (_c.x || _c.y) {
    ball.dy = - ball.dy;
  }
}

// Game Controller
//-----------------
function move() {
  // move ball
  if (ball.x < ball.r || ball.x > WIDTH - ball.r) { ball.dx = -ball.dx }
  if (ball.y < ball.r || ball.y > HEIGHT - ball.r) { ball.dy = -ball.dy }
  ball.x += ball.dx*elapsed_time;
  ball.y += ball.dy*elapsed_time;

  // move padle
  if (leftDown) {
    paddle.x -= paddle.dx*elapsed_time;
    paddle.x = Math.max(0,paddle.x);
  }
  if (rightDown) {
    paddle.x += paddle.dx*elapsed_time;
    paddle.x = Math.min(WIDTH-paddle.w,paddle.x)
  }
}

function draw() {
  clear();

  // draw ball and paddle
  circle(ball);
  rect(paddle);

  //draw the bricks
  for (var i=0;i<bricks.length;i++) {
    b = bricks[i];
    if (!b.broken) {
      draw_brick(b);
    }
  }
}

var last_time, elapsed_time, now;
function tick() {
  now = new Date().valueOf();
  elapsed_time = (now-last_time)/1000;
  last_time = now;
  collisions();
  move();
  draw();
  current_frame = window.requestAnimationFrame(tick);
}

function start() {
  now = new Date().valueOf();
  last_time = new Date().valueOf();
  current_frame = window.requestAnimationFrame(tick);
}

function stop() {
  cancelAnimationFrame(current_frame);
}


var canvas = document.getElementById("canvas");
var WIDTH = canvas.width;
var HEIGHT = canvas.height;

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

var paddle = {
  w: 60,
  h: 15,
  y: HEIGHT - 30,
  color: "white"
}

paddle.x = WIDTH/2 - paddle.w/2;

var ball = {
  r: 10,
  y: HEIGHT - 45,
  dx: 150, // speed is in pixels per second
  dy: -150, // up is negative!
  color: "white"
}
ball.x = WIDTH/2;// arc is already centered!

rect(paddle);
circle(ball);

var fps = 100;

function move() {
  if (ball.x < 0 || ball.x > WIDTH) { ball.dx = -ball.dx }
  if (ball.y < 0 || ball.y > HEIGHT) { ball.dy = -ball.dy }

  var elapsed_time = (now - last_time)/1000;
  ball.x += ball.dx*elapsed_time;
  ball.y += ball.dy*elapsed_time
}

function draw() {
  clear();
  circle(ball);
  rect(paddle);
}

var start_time,now,last_time;

var frames = 0
function tick() {
  now = new Date().valueOf();
  move();
  draw();
  last_time = now;
  frames += 1;

  var time = (now-start_time)/1000;
  document.getElementById('frames').innerHTML = frames+" frames";
  document.getElementById('fps').innerHTML = Math.round(frames/time)+" fps";
  document.getElementById('mspf').innerHTML = Math.round(100*1000*time/frames)/100+" milliseconds per frame";
  // adjust max value of i to slow this down
  for (var i=0;i<10000000;i++) { Math.sqrt(1/2) }
}

function start() {
  start_time = new Date().valueOf();
  now = new Date().valueOf();
  last_time = new Date().valueOf();
  frames = 0;
  window.interval = setInterval(tick,1000/fps);
}

function stop() {
  clearInterval(interval);
}

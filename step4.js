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
function draw() {
  clear();

  // draw ball
  if (ball.x < ball.r || ball.x > WIDTH - ball.r) { ball.dx = -ball.dx }
  if (ball.y < ball.r || ball.y > HEIGHT - ball.r) { ball.dy = -ball.dy }
  ball.x += ball.dx/fps; //(pixels per second)/(frames per second) = pixels per frame
  ball.y += ball.dy/fps;
  circle(ball);
  rect(paddle);
}

function tick() {
  draw();
}

var interval = setInterval(tick,1000/fps);

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


// Game Controller
//-----------------
rect(paddle);
circle(ball);

var fps = 100;

function move() {
  //move the paddle
  if (leftDown) {
    paddle.x -= paddle.dx/fps;
  }
  if (rightDown) {
    paddle.x += paddle.dx/fps;
  }

  //move the ball
  if (ball.x < ball.r || ball.x > WIDTH - ball.r) { ball.dx = -ball.dx }
  if (ball.y < ball.r || ball.y > HEIGHT - ball.r) { ball.dy = -ball.dy }
  ball.x += ball.dx/fps; //(pixels per second)/(frames per second) = pixels per frame
  ball.y += ball.dy/fps;
}

function draw() {
  clear();

  // draw ball and paddle
  circle(ball);
  rect(paddle);
}

function tick() {
  move();
  draw();
}

function start() {
  window.interval = setInterval(tick,1000/fps);
}

function stop() {
  clearInterval(interval);
}

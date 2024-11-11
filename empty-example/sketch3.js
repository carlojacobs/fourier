// Hello there! This is my Fourier series visualisation

// Variables
var cy;
var cx;
var pi = Math.PI;
var rad = pi / 180;
var deg = 1 / rad;
var lineXPoints = [];
var lineYPoints = [];
var lineColor = [66, 244, 98];
var rateScalar = 2.5;
var circleScalar = 0.6;
var pause = false;

var circles = [];
function setup() {
  createCanvas(windowWidth, windowHeight);
  background(255);
  frameRate(60);
  // Create sliders
  cx = windowWidth/2;
  cy = windowHeight/2;
  // Set up circles
  var circle1 = new Circle(150, cx, cy, 1)
  var circle2 = new Circle(circleScalar * circle1.r, circle1.lineX, circle1.lineY, rateScalar * circle1.rate);
  var circle3 = new Circle(circleScalar * circle2.r, circle2.lineX, circle2.lineY, rateScalar * circle2.rate);
  var circle4 = new Circle(circleScalar * circle3.r, circle3.lineX, circle3.lineY, rateScalar * circle3.rate);
  circles.push(circle1);
  circles.push(circle2);
  circles.push(circle3);
  circles.push(circle4);
}

function draw() {
  background(255);
  noFill();
  // Draw center point
  stroke(0);
  strokeWeight(8);
  point(cx, cy);
  strokeWeight(2);
  for (var i = 0; i < circles.length; i++) {
    var circle = circles[i];
    circle.draw();
    if (i !== 0) {
      var prevCircle = circles[i - 1];
      circle.animate(prevCircle.lineX, prevCircle.lineY);
    } else {
      circle.animate(circle.x, circle.y);
    }
    if (i == circles.length - 1) {
      var xDuplicate = checkForDuplicate(circle.lineX, lineXPoints);
      var yDuplicate = checkForDuplicate(circle.lineY, lineYPoints);
      if (!xDuplicate && !yDuplicate) {
        lineXPoints.push(circle.lineX);
        lineYPoints.push(circle.lineY); 
      }
    }
  }
  drawLine();
}

function checkForDuplicate(point, array) {
  for (var i = 0;i < array.length;i++) {
    var item = array[i];
    if (item == point) {
      return true;
    }
  }
  return false;
}

function keyTyped() {
  if (key === 'p') {
    if (!pause) {
      noLoop();
      pause = true;
    } else {
      loop();
      pause = false;
    }
  }
}

class Circle {
  constructor(radius, x, y, rate) {
    this.r = radius;
    this.rate = rate;
    this.x = x;
    this.y = y;
    this.angle = 45;
    this.lineX = this.x + (this.r) * Math.cos(this.angle * rad);
    this.lineY = this.y - (this.r) * Math.sin(this.angle * rad);
  }

  draw() {
    ellipse(this.x, this.y, 2*this.r, 2*this.r);
    line(this.x, this.y, this.lineX, this.lineY);
  }

  animate(x, y) {
    this.angle -= this.rate;
    this.x = x;
    this.y = y;
    this.lineX = this.x + (this.r) * Math.cos(this.angle * rad);
    this.lineY = this.y - (this.r) * Math.sin(this.angle * rad);
  }

}

function drawLine() {
  // Draw a line connecting the points
  stroke(lineColor[0], lineColor[1], lineColor[2]);
  for (var i = lineXPoints.length - 1; i >= 0; i--) {
    line(lineXPoints[i - 1], lineYPoints[i - 1], lineXPoints[i], lineYPoints[i]);
  }
}
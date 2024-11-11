// Adjustable fourier visualization

// Variables
var pi = Math.PI;
var r = 150;
var rad = pi / 180;
var deg = 1 / rad;
var angle = 90;
var cx;
var cy;
var rate;
var lineX = 0;
var lineY = 0;
var rFactor = 1;
var frameRate = 60;
var rateSlider;
var length;
var lengthFactor = Math.sqrt(1/2);
var sinCounter = 0;
var amplitude = 100;
var frequency = 1;
var phase = 0;
var prevRateSliderVal;
var rateSliderFrom = 0;
var rateSliderTo = 3;
var rateSliderSteps = 0.01
var rateSliderInitialValue = 0.2;
var rateInput;
var pointsX = [];
var pointsY = [];
var lineColor = [66, 244, 98];
var waveInput;
var prevWaveInputValue;
var wave = "100*sin(2*pi*1*t + 0)";
var resetButton;
var newWaveButton;
var comPoints = [];
var pause = false;
var errorFix = 0.0472;

function setup() {
	createCanvas(windowWidth, windowHeight);
	background(0);
	frameRate(60);
	cx = windowWidth/2;
	cy = windowHeight/2;
	// Create the inputs
	rateSlider = createSlider(rateSliderFrom, rateSliderTo, rateSliderInitialValue, rateSliderSteps);
	rateSlider.position(100, 100);
	waveInput = createInput("100*sin(2*pi*1*t + 0)");
	waveInput.position(100, 150);
	// Reset button
	resetButton = createButton("Reset");
	resetButton.position(100, 320);
	resetButton.mousePressed(resetButtonPressed);
	// Set new wave button
	newWaveButton = createButton("Set new wave");
	newWaveButton.position(100, 270);
	newWaveButton.mousePressed(setNewWave);
	// Get the random color of the line
	getLineColor();
	// Apply style
	applyStyle();

}

function draw() {
	// Basic setup
	background(0);
	// Draw a grid
	// drawGrid(40);
	// Update the rate with the value of the slider
	rate = rateSlider.value();
	if (rate !== prevRateSliderVal) {
		resetLine();
		getLineColor();
		prevRateSliderVal = rate;
		prevWaveInputValue = waveInput.value();
	}
	stroke(255);
	strokeWeight(0.5);
	textSize(28);
	fill(255);
	// Create text box with rate
	text(rate + " Cycles per second", 100, 90);
  // Create the labels for the inputs
  textSize(18);
	// Draw nice point in the middle
	stroke(lineColor);
	strokeWeight(10);
	point(cx, cy);
  // Draw the circle
  stroke(255);
  noFill();
  strokeWeight(3);
  ellipse(cx, cy, 2 * r, 2 * r);
  // Set line's x and y
	lineX = cx + (r * rFactor) * Math.cos(angle * rad);
  lineY = cy - (r * rFactor) * Math.sin(angle * rad);
  // Draw the vector line
  line(cx, cy, lineX, lineY);
  length = int(dist(cx, cy, lineX, lineY));
  angle -= ((rate + rate * errorFix)  * 360) / 60;
  // if (Math.abs(angle) > 360) {
  // 	angle = angle % 360;
  // }
  sinCounter++;
  sineWave(sinCounter * rad, (success, newWave) => {
  	if (success) {
			updateLength(newWave);
  	} else {
  		alert("Invalid input");
  		wave = "100*sin(2*pi*1*t + 0)";
  		waveInput.value(wave);
  	}
  });
	var xDuplicate = checkForDuplicate(lineX, pointsX);
	var yDuplicate = checkForDuplicate(lineY, pointsY);
	if (!xDuplicate && !yDuplicate) {
		pointsX.push(lineX);
	  pointsY.push(lineY);
	}
	drawShapeLine();

	// Center of mass
	var pointsX2 = shift(-cx, pointsX);
	var pointsY2 = shift(-cy, pointsY);
	var com = addPoints(pointsX2, pointsY2);
	strokeWeight(10);
	stroke(255);
	point(com[0], com[1]);
	strokeWeight(2);
	var length = int(dist(cx, cy, com[0], com[1]));
	strokeWeight(1);
	textSize(40);
	fill(255);
	text(length, 1000, 100);
	strokeWeight(2);
	noFill();
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

function addPoints(xPoints, yPoints) {
	var allX = 0;
	var allY = 0;
	for (var i = 0;i < xPoints.length;i++) {
		allX += xPoints[i];
	}
	for (var i = 0;i < yPoints.length;i++) {
		allY += yPoints[i];
	}
	allX = (allX / xPoints.length) + cx;
	allY = (allY / yPoints.length) + cy;
	return [allX, allY];
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

function shift(value, array) {
	var newArray = [];
	for (var i = 0;i < array.length;i++) {
		var item = array[i];
		item += value;
		newArray.push(item);
	}
	return newArray;
}

function drawGrid(distance) {
	stroke(255);
	strokeWeight(0.5);
	// Y lines
	for (var i = 0;i < width;i += distance) {
		line(i, 0, i, height);
	}
	// X lines
	for (var i = 0;i < height;i += distance) {
		line(0, i, width, i);
	}
}

function setNewWave() {
	resetLine();
	wave = waveInput.value();
}

function applyStyle() {
	var waveInputElement = new p5.Element(waveInput.elt);
	var waveInputStyle = {
		'width': '200px',
		'height': '100px',
		'border-radius': '8px',
		'border': 'none',
		'font-size': '20px'
	}
	for (var key in waveInputStyle) {
		waveInputElement.style(key, waveInputStyle[key]);
	}
	var resetButtonElement = new p5.Element(resetButton.elt);
	var setWaveButtonElement = new p5.Element(newWaveButton.elt);
	var buttonStyle = {
		'border': 'none',
		'height': '40px',
		'width': '100px',
		'font-size': '14px',
		'border-radius': '8px',
		'cursor': 'pointer'
	}
	for (var key in buttonStyle) {
		resetButtonElement.style(key, buttonStyle[key]);
		setWaveButtonElement.style(key, buttonStyle[key]);
	}
}

function getLineColor() {
	for (var i = lineColor.length - 1; i >= 0; i--) {
		lineColor[i] = random(255);
	}
}

function resetButtonPressed() {
	resetLine();
	rateSlider.value(0.2);
	getLineColor();
	// waveInput.value("100*sin(2*pi*1*t + 0)");
}

function resetLine() {
	pointsX = [];
	pointsY = [];
}

function drawNormalLine() {
	// Draw a line connecting the points
	stroke(lineColor[0], lineColor[1], lineColor[2]);
  for (var i = pointsX.length - 1; i >= 0; i--) {
    line(pointsX[i - 1], pointsY[i - 1], pointsX[i], pointsY[i]);
  }
}

function drawShapeLine() {
	// Draw a line connecting the points
	stroke(lineColor[0], lineColor[1], lineColor[2]);
	beginShape(QUAD_STRIP);
  for (var i = pointsX.length - 1; i >= 0; i--) {
		vertex(pointsX[i - 1], pointsY[i - 1]);
		vertex(pointsX[i], pointsY[i]);
  }
	endShape();
}

function sineWave(t, callback) {
	var scope = {t: t}
	var waveResult;
	try {
		waveResult = math.eval(wave, scope);
		callback(true, waveResult);
	} catch(err) {
		callback(false);
	}
}

function updateLength(newLength) {
	rFactor = (r + newLength) / r;
}

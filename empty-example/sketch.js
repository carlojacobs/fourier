// Hello! This is my code, feel free to tweak it and make suggestions

// Variables
var pi = Math.PI;
var r = 200;
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
var frequencyInput;
var amplitudeInput;
var phaseInput;
var length;
var lengthFactor = Math.sqrt(1/2);
var sinCounter = 0;
var amplitude = 100;
var frequency = 1;
var phase = 0;
var prevRateSliderVal;
var prevAmplitude;
var prevFrequency;
var prevPhase;
var rateSliderFrom = 0;
var rateSliderTo = 1;
var rateSliderSteps = 0.001
var rateSliderInitialValue = 0.2;
var pointsX = [];
var pointsY = [];
var lineColor = [66, 244, 66];
var pause = false;

function setup() {
	createCanvas(windowWidth, windowHeight);
	background(0);
	cx = windowWidth/2;
	cy = windowHeight/2;
	// Create the inputs
	rateSlider = createSlider(rateSliderFrom, rateSliderTo, rateSliderInitialValue, rateSliderSteps);
	rateSlider.position(100, 100);
	frequencyInput = createInput(1);
	frequencyInput.position(100, 150);
	amplitudeInput = createInput(10);
	amplitudeInput.position(100, 200);
	phaseInput = createInput(1);
	phaseInput.position(100, 250);
	// Reset button
	var resetButton = createButton("Reset");
	resetButton.position(100, 300);
	resetButton.mousePressed(buttonPressed);
	// Get the random color of the line
	getLineColor();
}

function draw() {
	// Basic setup
  background(0);
  // Update the rate with the value of the slider
	rate = rateSlider.value();
	amplitude = amplitudeInput.value() * 10;
	frequency = frequencyInput.value();
	phase = phaseInput.value();
	if (rate !== prevRateSliderVal || phase !== prevPhase || amplitude !== prevAmplitude || frequency !== prevFrequency) {
		resetLine();
		getLineColor();
		prevRateSliderVal = rate;
		prevAmplitude = amplitude;
		prevFrequency = frequency;
		prevPhase = phase;
	}
	stroke(255);
	strokeWeight(0.5);
	textSize(28);
	fill(255);
	// Create text box with rate
	text(rate + " Cycles per second", 100, 90);
  // Create the labels for the inputs
  textSize(18);
	text("Frequency:", 100, 140);
	text("Amplitude:", 100, 190);
	text("Phase:", 100, 240);
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
  angle -= (rate * 360) / 60;
  if (Math.abs(angle) > 360) {
  	angle = angle % 360;
	}
	sinCounter++;
  updateLength(sineWave(amplitude, frequency, phase, sinCounter * rad));
	
	var xDuplicate = checkForDuplicate(lineX, pointsX);
	var yDuplicate = checkForDuplicate(lineY, pointsY);
	if (!xDuplicate && !yDuplicate) {
		pointsX.push(lineX);
  	pointsY.push(lineY);
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

function getLineColor() {
	for (var i = lineColor.length - 1; i >= 0; i--) {
		lineColor[i] = random(255);
	}
}

function buttonPressed() {
	resetLine();
	rateSlider.value(0.2);
	amplitudeInput.value(10);
	frequencyInput.value(1);
	phaseInput.value(1);
	getLineColor();
}

function resetLine() {
	pointsX = [];
	pointsY = [];
}

function drawLine() {
	// Draw a line connecting the points
	stroke(lineColor[0], lineColor[1], lineColor[2]);
  for (var i = pointsX.length - 1; i >= 0; i--) {
    line(pointsX[i - 1], pointsY[i - 1], pointsX[i], pointsY[i]);
  }
}

function sineWave(amplitude, frequency, phase, t) {
	var wave = amplitude * Math.sin(2 * pi * frequency * t + phase);
	return wave;
}

function updateLength(newLength) {
	rFactor = (r + newLength) / r;
}
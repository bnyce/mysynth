let synth;
let currentWaveType = 'sine';
let currentNote = 'A4';
let soundOn = false;
let buttonWidth;
let buttonHeight;
let pianoKeys = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5'];

function setup() {
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER, CENTER);

  // Initialize the synthesizer
  synth = new p5.MonoSynth();

  // Adjust for different screen sizes
  buttonWidth = width / 4;
  buttonHeight = 50;
  textSize(20);
}

function draw() {
  background(220);

  // Draw waveform buttons horizontally at the top
  let waveTypes = ['sine', 'square', 'sawtooth', 'triangle'];
  for (let i = 0; i < waveTypes.length; i++) {
    drawButton(i * buttonWidth, 0, buttonWidth, buttonHeight, waveTypes[i], currentWaveType);
  }

  // Draw the wave visualization in the middle
  drawWave(currentWaveType);

  // Draw the Play/Pause button
  drawPlayPauseButton(width / 2 - 50, height / 2 - 50, 100);

  // Draw the piano keys at the bottom
  for (let i = 0; i < pianoKeys.length; i++) {
    drawPianoKey(i * (width / pianoKeys.length), height - 100, width / pianoKeys.length, 100, pianoKeys[i], currentNote);
  }
}

function drawPlayPauseButton(x, y, size) {
  fill(255);
  rect(x, y, size, size);
  fill(0);
  text(soundOn ? 'Pause' : 'Play', x + size/2, y + size/2);
}

function drawPianoKey(x, y, w, h, note, selectedNote) {
  fill(note === selectedNote ? 200 : 255);
  rect(x, y, w, h);
  fill(0);
  text(note, x + w/2, y + h/2);
}

function drawButton(x, y, w, h, waveType, selectedWave) {
  fill(waveType === selectedWave ? 200 : 255);
  rect(x, y, w, h);
  fill(0);
  text(waveType, x + w / 2, y + h / 2);
}

function mousePressed() {
  handleInteraction();
}

function touchStarted() {
  handleInteraction();
  return false;  // prevent default
}

function handleInteraction() {
  if (getAudioContext().state !== 'running') {
  getAudioContext().resume();
}

  // Check if a waveform button is pressed
  let waveTypes = ['sine', 'square', 'sawtooth', 'triangle'];
  for (let i = 0; i < waveTypes.length; i++) {
    if (mouseX > i * buttonWidth && mouseX < (i + 1) * buttonWidth && mouseY > 0 && mouseY < buttonHeight) {
      currentWaveType = waveTypes[i];
      return;  // Exit the function after setting the wave type
    }
  }

  // Check if a piano key is pressed
  for (let i = 0; i < pianoKeys.length; i++) {
    if (mouseX > i * (width / pianoKeys.length) && mouseX < (i + 1) * (width / pianoKeys.length) && mouseY > height - 100) {
      currentNote = pianoKeys[i];
      playSound(currentWaveType, currentNote);  // Play the note immediately
      return;
    }
  }

  // Check if the Play/Pause button is pressed
  if (mouseX > width / 2 - 50 && mouseX < width / 2 + 50 && mouseY > height / 2 - 50 && mouseY < height / 2 + 50) {
    soundOn = !soundOn;
    if (soundOn) {
      playSound(currentWaveType, currentNote);  // Play the current note indefinitely
    } else {
      synth.triggerRelease();  // Stop all notes
    }
  }
}




function playSound(waveType, note) {
  // Stop any ongoing sound
  if (soundOn) {
      synth.triggerRelease();
      soundOn = false;
  }

  // Delay the next sound to ensure the previous one has stopped
  setTimeout(() => {
      synth.oscillator.setType(waveType);
      synth.triggerAttack(note);
      soundOn = true;
  }, 50); // 50ms delay

  // ... [The rest of your code for this function, if any]
}









function drawWave(waveType) {
  let waveLength = 200;
  let amplitude = 50;
  let startX = windowWidth * 0.25;
  let startY = windowHeight * 0.75;
  
  strokeWeight(2);
  noFill();
  beginShape();
  for (let x = 0; x < windowWidth * 0.5; x += 1) {  // finer steps for smoother waves
    let y;
    switch (waveType) {
      case 'sine':
        y = startY + amplitude * sin(TWO_PI * x / waveLength);
        break;
      case 'square':
        y = (x % waveLength < waveLength / 2) ? startY - amplitude : startY + amplitude;
        break;
      case 'sawtooth':
        y = startY + (x % waveLength) * (2 * amplitude) / waveLength - amplitude;
        break;
      case 'triangle':
        if (x % waveLength < waveLength / 2) {
          y = startY + (x % (waveLength / 2)) * (2 * amplitude) / waveLength - amplitude;
        } else {
          y = startY + amplitude - (x % (waveLength / 2)) * (2 * amplitude) / waveLength;
        }
        break;
    }
    vertex(startX + x, y);
  }
  endShape();
}

// server ambiente socket anche per i client
const socket = io();

var elem = document.documentElement;

// VARIABILI TONEJS
var nois = new Tone.Noise("pink").toDestination();
var noisInit = 1;
var nois2 = new Tone.Noise("pink").toDestination();
var nois2Init = 1;
var sin = new Tone.Oscillator(440, "sine").toDestination();
var sinInit = 1;
var sin2 = new Tone.Oscillator(440, "sine").toDestination();
var sin2Init = 1;
var saws = new Tone.Oscillator(440, "sawtooth6").toDestination();
var sawsInit = 1;
var saws2 = new Tone.Oscillator(440, "sawtooth6").toDestination();
var saws2Init = 1;
var player = new Tone.Player("sound-1.wav").toMaster();
var playerInit = 1;

// TENTATIVI METRONOMO
let intervalIdMetro, noise, envelope;

function getRandomInt(number) {
  min = Math.ceil(-number);
  max = Math.floor(number);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// funzione tone js crea nota
function pinkNoiseEdit(args) {
  if (noisInit == 1) {
    nois.volume.value = -Infinity; // Set initial volume to -Infinity
    noisInit = 0;
    nois.start();
    nois.volume.rampTo(args[0], args[1] / 1000);
  }
  nois.start();
  nois.volume.rampTo(args[0], args[1] / 1000);
}

// funzione tone js crea nota
function sineEdit(args) {
  if (sinInit == 1) {
    sin.volume.value = -Infinity; // Set initial volume to -Infinity
    sinInit = 0;
    sin.frequency.value = Number(args[0]) + getRandomInt(args[1]);
    sin.start();
    sin.volume.rampTo(args[2], args[3] / 1000);
  }

  // attack or release to avoid detunig swith on release
  if (args[2] < -60 || args[2] === "-Infinity") {
    sin.volume.rampTo(args[2], args[3] / 1000);
  } else {
    sin.frequency.value = Number(args[0]) + getRandomInt(args[1]);
    sin.start();
    sin.volume.rampTo(args[2], args[3] / 1000);
  }
}

// funzione tone js crea nota
function sawEdit(args) {
  if (sawsInit == 1) {
    saws.volume.value = -Infinity; // Set initial volume to -Infinity
    sawsInit = 0;
    saws.frequency.value = Number(args[0]) + getRandomInt(args[1]);
    saws.start();
    saws.volume.rampTo(args[2], args[3] / 1000);
  }

  // attack or release to avoid detunig swith on release
  if (args[2] < -60 || args[2] === "-Infinity") {
    saws.volume.rampTo(args[2], args[3] / 1000);
  } else {
    saws.frequency.value = Number(args[0]) + getRandomInt(args[1]);
    saws.start();
    saws.volume.rampTo(args[2], args[3] / 1000);
  }
}

// funzione tone js crea nota
function pinkNoiseEdit2(args) {
  if (nois2Init == 1) {
    nois2.volume.value = -Infinity; // Set initial volume to -Infinity
    nois2Init = 0;
    nois2.start();
    nois2.volume.rampTo(args[0], args[1] / 1000);
  }
  nois2.start();
  nois2.volume.rampTo(args[0], args[1] / 1000);
}
// funzione tone js crea nota
function sineEdit2(args) {
  if (sin2Init == 1) {
    sin2.volume.value = -Infinity; // Set initial volume to -Infinity
    sin2Init = 0;
    sin2.frequency.value = Number(args[0]) + getRandomInt(args[1]);
    sin2.start();
    sin2.volume.rampTo(args[2], args[3] / 1000);
  }

  // attack or release to avoid detunig swith on release
  if (args[2] < -60 || args[2] === "-Infinity") {
    sin2.volume.rampTo(args[2], args[3] / 1000);
  } else {
    sin2.frequency.value = Number(args[0]) + getRandomInt(args[1]);
    sin2.start();
    sin2.volume.rampTo(args[2], args[3] / 1000);
  }
}

// funzione tone js crea nota
function sawEdit2(args) {
  if (saws2Init == 1) {
    saws2.volume.value = -Infinity; // Set initial volume to -Infinity
    saws2Init = 0;
    saws2.frequency.value = Number(args[0]) + getRandomInt(args[1]);
    saws2.start();
    saws2.volume.rampTo(args[2], args[3] / 1000);
  }

  // attack or release to avoid detunig swith on release
  if (args[2] < -60 || args[2] === "-Infinity") {
    saws2.volume.rampTo(args[2], args[3] / 1000);
  } else {
    saws2.frequency.value = Number(args[0]) + getRandomInt(args[1]);
    saws2.start();
    saws2.volume.rampTo(args[2], args[3] / 1000);
  }
}

// AudioPlayer
function audioPlayerEdit(args) {
  let text1 = "sound-";
  let text2 = ".wav";
  let file = text1.concat(args[0], text2);

  // If a player instance exists, stop and dispose it
  if (player) {
    player.stop();
    player.dispose();
  }

  // Create a new player instance without autostart
  player = new Tone.Player({
    url: file,
    autostart: false, // Autostart is false to wait for onload
    loop: Number(args[2]),
    onload: function () {
      // Start playback after the player has loaded the audio
      player.start();
      // Set the volume
      player.volume.rampTo(args[1], 0.5);
    },
  }).toDestination();
}

// Function to start the metronome
function metroEdit(args, action = "start") {
  const volumeDb = args[0]; // Volume in dB
  const intervalMs = args[1]; // Interval in milliseconds

  // Function to stop and dispose of noise and envelope
  const stopAndDispose = () => {
    if (intervalIdMetro) {
      clearInterval(intervalIdMetro);
      intervalIdMetro = null;
    }
    if (noise) {
      noise.stop();
      noise.dispose();
      noise = null;
    }
    if (envelope) {
      envelope.dispose();
      envelope = null;
    }
  };

  if (action === "stop") {
    // If action is stop, clean up and exit
    stopAndDispose();
    return;
  }

  // Clean up any existing noise or intervals
  stopAndDispose();

  // Resume the audio context if it's suspended
  Tone.start();

  // Create a new noise source
  noise = new Tone.Noise("white").start();

  // Create a gain node to control volume
  const gain = new Tone.Gain(Tone.dbToGain(volumeDb)).toDestination();

  // Create an envelope to control the noise
  envelope = new Tone.AmplitudeEnvelope({
    attack: 0.05, // Attack time
    decay: 0.05, // Decay time (50 ms)
    sustain: 0,
    release: 0,
  }).connect(gain);

  // Connect the noise source to the envelope
  noise.connect(envelope);

  // Trigger the first sound immediately
  envelope.triggerAttackRelease(0.5);

  // Play the noise signal at the defined interval
  intervalIdMetro = setInterval(() => {
    envelope.triggerAttackRelease(0.5); // Trigger the envelope
  }, intervalMs);
}

// FUNZIONI GRAFICHE
// rimuove bottone
function removeButton() {
  var button = document.getElementById("hideButton");
  button.remove();
  //create a synth and connect it to the main output (your speakers)
  const debug = new Tone.Synth().toDestination();

  //play a middle 'C' for the duration of an 8th note
  debug.triggerAttackRelease("C4", "16n");

  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.webkitRequestFullscreen) {
    /* Safari */
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) {
    /* IE11 */
    elem.msRequestFullscreen();
  }
}

// COLORI RGB
function initRGBEdit(args) {
  const targetColor = args.slice(0, 3);
  const durationMs = args[4];
  const startColor = window.getComputedStyle(document.body).backgroundColor;
  const startRgba = startColor.match(/\d+/g).map(Number); // Extract RGB values

  const targetRgba = targetColor.map(Number); // Target RGBA values

  const startTime = performance.now();

  function updateColor(timestamp) {
    const elapsedMs = timestamp - startTime;
    if (elapsedMs >= durationMs) {
      document.body.style.backgroundColor = `rgba(${targetRgba.join(", ")})`;
      return;
    }

    const progress = elapsedMs / durationMs;
    const interpolatedRgba = startRgba.map((startVal, i) =>
      Math.round(startVal + (targetRgba[i] - startVal) * progress)
    );

    document.body.style.backgroundColor = `rgba(${interpolatedRgba.join(
      ", "
    )})`;

    requestAnimationFrame(updateColor);
  }

  requestAnimationFrame(updateColor);
}

// STROBO
let intervalIdStrobe; // Store the interval ID outside the function

function strobeEdit(args) {
  let swapColor = 0;
  const getRandomColor = () => {
    const r = args[0];
    const g = args[1];
    const b = args[2];
    swapColor = 1 - swapColor;
    return `rgba(${r * swapColor}, ${g * swapColor}, ${b * swapColor}, 1)`;
  };

  if (args[3] > 0) {
    clearInterval(intervalIdStrobe); // Clear any existing interval before starting a new one
    intervalIdStrobe = setInterval(() => {
      const newColor = getRandomColor();
      document.body.style.backgroundColor = newColor;
    }, args[3]);
  } else {
    clearInterval(intervalIdStrobe); // Stop the interval if ms is not positive
  }
}

// MESSAGGI SOCKET IO
socket.on("pink", (ctrlValue) => {
  pinkNoiseEdit(ctrlValue);
});

socket.on("sine", (ctrlValue) => {
  sineEdit(ctrlValue);
});

socket.on("saw", (ctrlValue) => {
  sawEdit(ctrlValue);
});

socket.on("pink2", (ctrlValue) => {
  pinkNoiseEdit2(ctrlValue);
});

socket.on("sine2", (ctrlValue) => {
  sineEdit2(ctrlValue);
});

socket.on("saw2", (ctrlValue) => {
  sawEdit2(ctrlValue);
});

socket.on("audioPlayer", (ctrlValue) => {
  audioPlayerEdit(ctrlValue);
});

socket.on("initRGB", (ctrlValue) => {
  initRGBEdit(ctrlValue);
});

socket.on("strobe", (ctrlValue) => {
  strobeEdit(ctrlValue);
});

socket.on("metro", (ctrlValue) => {
  metroEdit(ctrlValue);
});

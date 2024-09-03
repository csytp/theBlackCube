// import "./style.css";
import WebAudio from "./webAudio.js";
import Sketch from "./app.js";
import FaceRecognition from "./components/face-recognition/face-recognition.js";

// Face Recognition
// let fr = new FaceRecognition();

const socket = io();

// WebAudio obj
const webaudio = new WebAudio();

// Sketch (THREEJS) obj
window.sketch = new Sketch();
sketch.init();

document.getElementById("hideButton").addEventListener(
  "click",
  (e) => {
    e.preventDefault();
    e.stopImmediatePropagation();
    webaudio.removeButton(e);
  },
  false
);

/*************** SOCKET IO ***************** */
// FUNZIONI GRAFICHE GENERICHE

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
      document.getElementById("superDiv").style.backgroundColor = newColor;
    }, args[3]);
  } else {
    clearInterval(intervalIdStrobe);
    // Stop the interval if ms is not positive
  }
}
// MESSAGGI SOCKET IO THREEJS

socket.on("chgScn", (ctrlValue) => {
  console.log(ctrlValue);
  sketch.changeScene(ctrlValue);
});

// MESSAGGI SOCKET IO WEB AUDIO
socket.on("pink", (ctrlValue) => {
  webaudio.pinkNoiseEdit(ctrlValue);
});

socket.on("sine", (ctrlValue) => {
  webaudio.sineEdit(ctrlValue);
});

socket.on("saw", (ctrlValue) => {
  webaudio.sawEdit(ctrlValue);
});

socket.on("pink2", (ctrlValue) => {
  webaudio.pinkNoiseEdit2(ctrlValue);
});

socket.on("sine2", (ctrlValue) => {
  webaudio.sineEdit2(ctrlValue);
});

socket.on("saw2", (ctrlValue) => {
  webaudio.sawEdit2(ctrlValue);
});

socket.on("audioPlayer", (ctrlValue) => {
  webaudio.audioPlayerEdit(ctrlValue);
});

socket.on("initRGB", (ctrlValue) => {
  webaudio.initRGBEdit(ctrlValue);
});

socket.on("strobe", (ctrlValue) => {
  webaudio.strobeEdit(ctrlValue);
});

socket.on("metro", (ctrlValue) => {
  webaudio.metroEdit(ctrlValue);
});

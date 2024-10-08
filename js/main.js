// import "style.css";

import WebAudio from "./webAudio.js";
import Sketch from "./app.js";
//import FaceRecognition from "./face-recognition/face-recognition.js";
import NoSleep from "nosleep.js";

// Remove presentation
function removePresentation(e) {
  let button_container = document.getElementById("presentation_container");
  button_container.remove();

  if (window.matchMedia("(max-width: 768px)").matches) {
    if (document.body.requestFullscreen) {
      document.body.requestFullscreen();
    } else if (document.body.webkitRequestFullscreen) {
      /* Safari */
      document.body.webkitRequestFullscreen();
    } else if (document.body.msRequestFullscreen) {
      /* IE11 */
      document.body.msRequestFullscreen();
    }
  }
}

// No Sleep
const noSleep = new NoSleep();

const socket = io();

// WebAudio obj
const webaudio = new WebAudio();

// Sketch (THREEJS) obj
window.sketch = new Sketch();
sketch.init();

// Face Recognition
// const fr = new FaceRecognition(sketch);

// Event to start
document.getElementById("hideButton").addEventListener(
  "click",
  (e) => {
    e.preventDefault();
    e.stopImmediatePropagation();
    removePresentation(e);
    webaudio.init(e);
    noSleep.enable();
    webaudio.initCsound(); // Initialize Csound asynchronously
    // fr.startFR();
  },
  false
);

document.addEventListener("visibilitychange", function () {
  if (document.visibilityState === "visible") {
    location.reload();
  }
});

/****************** SOCKET-IO ******************/

// SOCKET-IO -> THREEJS

socket.on("chgScn", (ctrlValue) => {
  // console.log(ctrlValue);
  sketch.changeScene(ctrlValue);
});

socket.on("showFr", (ctrlValue) => {
  sketch.showFR(ctrlValue);
});

// SOCKET-IO -> WEB AUDIO

socket.on("csound", (ctrlValue) => {
  webaudio.play(ctrlValue);
});

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

socket.on("audioPlayer2", (ctrlValue) => {
  webaudio.audioPlayerEdit2(ctrlValue);
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

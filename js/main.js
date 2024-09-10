// import "style.css";
import WebAudio from "./webAudio.js";
import Sketch from "./app.js";
import FaceRecognition from "./face-recognition/face-recognition.js";
import NoSleep from "nosleep.js";

//Page Reload
/*
document.addEventListener("visibilitychange", function () {
  if (document.visibilityState === "visible") {
    location.reload();
  }
});*/
// No Sleep
const noSleep = new NoSleep();

const socket = io();

// WebAudio obj
const webaudio = new WebAudio();

// Sketch (THREEJS) obj
window.sketch = new Sketch();
sketch.init();

// Face Recognition
const fr = new FaceRecognition(sketch);

// Event to start Audio Engine - and remove
document.getElementById("hideButton").addEventListener(
  "click",
  (e) => {
    e.preventDefault();
    e.stopImmediatePropagation();
    webaudio.removeButton(e);
    noSleep.enable();
    // Initialize Csound asynchronously
    webaudio.initCsound();
    fr.startFR();
  },
  false
);

/****************** SOCKET-IO ******************/

// SOCKET-IO -> THREEJS

socket.on("chgScn", (ctrlValue) => {
  console.log(ctrlValue);
  sketch.changeScene(ctrlValue);
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

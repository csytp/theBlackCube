// import "./style.css";
import WebAudio from "./webAudio.js";
import Sketch from "./app.js";
import FaceRecognition from "./face-recognition/face-recognition.js";
import NoSleep from "nosleep.js";

EventTarget.prototype._addEventListener = EventTarget.prototype.addEventListener;

EventTarget.prototype.addEventListener = function(a, b, c) {
   if (c==undefined) c=false;
   this._addEventListener(a,b,c);
   if (! this.eventListenerList) this.eventListenerList = {};
   if (! this.eventListenerList[a]) this.eventListenerList[a] = [];
   this.eventListenerList[a].push({listener:b,options:c});
};

EventTarget.prototype._getEventListeners = function(a) {
  if (! this.eventListenerList) this.eventListenerList = {};
  if (a==undefined)  { return this.eventListenerList; }
  return this.eventListenerList[a];
};

// No Sleep
const noSleep = new NoSleep();

// Face Recognition
// let fr = new FaceRecognition();

const socket = io();

// WebAudio obj
const webaudio = new WebAudio();

// Sketch (THREEJS) obj
window.sketch = new Sketch();
sketch.init();

// Event to start Audio Engine - and remove
document.getElementById("hideButton").addEventListener(
  "click",
  (e) => {
    e.preventDefault();
    e.stopImmediatePropagation();
    webaudio.removeButton(e);
    noSleep.enable();
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

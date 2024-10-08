import vision from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3";
import * as THREE from "three";

class FaceRecognition {
  constructor(sketch) {
    this.sketch = sketch;
    const { FaceLandmarker, FilesetResolver, DrawingUtils } = vision;
    const demosSection = document.getElementById("demos");
    const imageBlendShapes = document.getElementById("image-blend-shapes");
    const videoBlendShapes = document.getElementById("video-blend-shapes");
    let faceLandmarker;
    let runningMode = "IMAGE";
    let enableWebcamButton;
    let webcamRunning = false;
    const videoWidth = 480;

    this.faceDetected = false;

    this.scene = new THREE.Scene();
    this.scene.background = 0xff0000;

    // Before we can use HandLandmarker class we must wait for it to finish
    // loading. Machine Learning models can be large and take a moment to
    // get everything needed to run.
    async function createFaceLandmarker() {
      const filesetResolver = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
      );
      faceLandmarker = await FaceLandmarker.createFromOptions(filesetResolver, {
        baseOptions: {
          modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task`,
          delegate: "GPU",
        },
        outputFaceBlendshapes: true,
        runningMode,
        numFaces: 1,
      });
      // demosSection.classList.remove("invisible");
    }
    createFaceLandmarker();

    const video = document.getElementById("webcam");
    const canvasElement = document.getElementById("output_canvas");
    const canvasCtx = canvasElement.getContext("2d");
    // Check if webcam access is supported.
    // function hasGetUserMedia() {
    //   return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
    // }
    // If webcam supported, add event listener to button for when user
    // wants to activate it.

    if (this.hasGetUserMedia()) {
      enableWebcamButton = document.getElementById("webcamButton");
      enableWebcamButton.addEventListener("click", enableCam);
    } else {
      console.warn("getUserMedia() is not supported by your browser");
    }
    // Enable the live webcam view and start detection.
    function enableCam(event) {
      // console.log("enableCam FR");
      if (!faceLandmarker) {
        // console.log("Wait! faceLandmarker not loaded yet.");
        return;
      }
      if (webcamRunning === true) {
        webcamRunning = false;
        enableWebcamButton.innerText = "ENABLE PREDICTIONS";
      } else {
        webcamRunning = true;
        enableWebcamButton.innerText = "DISABLE PREDICTIONS";
      }
      // getUsermedia parameters.
      const constraints = {
        video: true,
      };
      // Activate the webcam stream.
      navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
        video.srcObject = stream;
        video.addEventListener("loadeddata", predictWebcam);
      });
    }
    let lastVideoTime = -1;
    let results = undefined;

    let $this = this;

    //const drawingUtils = new DrawingUtils(canvasCtx);
    async function predictWebcam() {
      /*
      const radio = video.videoHeight / video.videoWidth;
      video.style.width = videoWidth + "px";
      video.style.height = videoWidth * radio + "px";
      canvasElement.style.width = videoWidth + "px";
      canvasElement.style.height = videoWidth * radio + "px";
      canvasElement.width = video.videoWidth;
      canvasElement.height = video.videoHeight;*/
      // Now let's start detecting the stream.
      if (runningMode === "IMAGE") {
        runningMode = "VIDEO";
        await faceLandmarker.setOptions({ runningMode: runningMode });
      }
      let startTimeMs = performance.now();
      if (lastVideoTime !== video.currentTime) {
        lastVideoTime = video.currentTime;
        results = faceLandmarker.detectForVideo(video, startTimeMs);
      }
      /*
      if (results.faceLandmarks) {
        for (const landmarks of results.faceLandmarks) {
          drawingUtils.drawConnectors(
            landmarks,
            FaceLandmarker.FACE_LANDMARKS_TESSELATION,
            { color: "#C0C0C070", lineWidth: 1 }
          );
          drawingUtils.drawConnectors(
            landmarks,
            FaceLandmarker.FACE_LANDMARKS_RIGHT_EYE,
            { color: "#FF3030" }
          );
          drawingUtils.drawConnectors(
            landmarks,
            FaceLandmarker.FACE_LANDMARKS_RIGHT_EYEBROW,
            { color: "#FF3030" }
          );
          drawingUtils.drawConnectors(
            landmarks,
            FaceLandmarker.FACE_LANDMARKS_LEFT_EYE,
            { color: "#30FF30" }
          );
          drawingUtils.drawConnectors(
            landmarks,
            FaceLandmarker.FACE_LANDMARKS_LEFT_EYEBROW,
            { color: "#30FF30" }
          );
          drawingUtils.drawConnectors(
            landmarks,
            FaceLandmarker.FACE_LANDMARKS_FACE_OVAL,
            { color: "#E0E0E0" }
          );
          drawingUtils.drawConnectors(
            landmarks,
            FaceLandmarker.FACE_LANDMARKS_LIPS,
            { color: "#E0E0E0" }
          );
          drawingUtils.drawConnectors(
            landmarks,
            FaceLandmarker.FACE_LANDMARKS_RIGHT_IRIS,
            { color: "#FF3030" }
          );
          drawingUtils.drawConnectors(
            landmarks,
            FaceLandmarker.FACE_LANDMARKS_LEFT_IRIS,
            { color: "#30FF30" }
          );
        }
      }*/

      console.log('NO FACE!');
      drawBlendShapes(videoBlendShapes, results.faceBlendshapes);

      // Call this function again to keep predicting when the browser is ready.
      if (webcamRunning === true) {
        window.requestAnimationFrame(predictWebcam);
      }
    }
    function drawBlendShapes(el, blendShapes) {
      console.log("FRisVisible", $this.sketch.FRisVisible);
      if ($this.sketch.FRisVisible === true) {
        // console.log("from FR", $this.sketch.fxSceneA.faceGroup.visible);
        if (!blendShapes.length) {
          //Riconosce No Face -> Togli mesh busto
          $this.faceDetected = false;

          if ($this.sketch.fxSceneA.visible === true) {
            $this.sketch.fxSceneA.enableControls(true);
            $this.sketch.fxSceneA.faceGroup.visible = false;
          } else if ($this.sketch.fxSceneB.visible === true) {
            $this.sketch.fxSceneB.enableControls(true);
            $this.sketch.fxSceneA.faceGroup.visible = false;
          }

          // console.log($this.faceDetected);

          return;
        }

        //Riconosce Face -> Metti mesh
        if ($this.faceDetected === false) {
          $this.faceDetected = true;

          if ($this.sketch.fxSceneA.visible === true) {
            $this.sketch.fxSceneA.enableControls(false);
            $this.sketch.fxSceneA.faceGroup.visible = true;
          } else if ($this.sketch.fxSceneB.visible === true) {
            $this.sketch.fxSceneB.enableControls(false);
            $this.sketch.fxSceneB.faceGroup.visible = true;
          }

          // console.log($this.faceDetected);
        }

        let htmlMaker = "";

        blendShapes[0].categories.map((shape) => {
          // console.log(shape);
          htmlMaker += `
      <li class="blend-shapes-item">
        <span class="blend-shapes-label">${
          shape.displayName || shape.categoryName
        }</span>
        <span class="blend-shapes-value" style="width: calc(${
          +shape.score * 100
        }% - 120px)">${(+shape.score).toFixed(4)}</span>
      </li>
    `;
        });
        // console.log(htmlMaker);
        el.innerHTML = htmlMaker;
      } else {
        $this.faceDetected = false;
        if ($this.sketch.fxSceneA.visible === true) {
          $this.sketch.fxSceneA.enableControls(true);
          $this.sketch.fxSceneA.faceGroup.visible = false;
        } else if ($this.sketch.fxSceneB.visible === true) {
          $this.sketch.fxSceneB.enableControls(true);
          $this.sketch.fxSceneA.faceGroup.visible = false;
        }
      }
    }
  }
  hasGetUserMedia() {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
  }
  startFR() {
    // console.log("startFR");
    document
      .getElementById("webcamButton")
      .dispatchEvent(new MouseEvent("click"));
  }
}
export default FaceRecognition;

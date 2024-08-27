import "./style.css";

import NoSleep from "nosleep.js";

import * as THREE from "three";
import {
  BoxLineGeometry,
  TrackballControls,
  OrbitControls,
  ThreeMFLoader,
} from "three/examples/jsm/Addons.js";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import * as Tone from "tone";

import srcStarMap from "./img/star.png";

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.refresh(true);
ScrollTrigger.create({
  start: 0,
  end: "max",
});
ScrollTrigger.saveStyles(["text-container"]);

// No Sleep import
var noSleep = new NoSleep();

//////// THREEJS ////////
/*three variables */
var tasksFirst = [];
var cubeArray = [];
let clock;
let camera, scene, renderer, controls, room, masterCubeGrp;
let starGeo, stars;
let planeFrontWall,
  planeBackWall,
  planeSideWallLeft,
  planeSideWallRight,
  planeFloor,
  planeRoof;
let spotLight1, spotLight2, spotLight3, spotLight4, frontLight;

var valoreInizialeXRot;
var valoreFinaleXRot;
var valoreInizialeYRot;
var valoreFinaleYRot;
var valoreInizialeZRot;
var valoreFinaleZRot;
var valoreZoomIniziale;
var valoreZoomFinale;

// Options
const options = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// Inner Cubes List
var listInnerCubes = [
  //1st level (basso)
  //(basso-dx)
  {
    x: -1,
    y: -1,
    z: 1,
    val: false,
    bottom_panel: true,
    right_panel: true,
    rear_panel: true,
  },
  { x: -1, y: -1, z: 0, val: false, bottom_panel: true, right_panel: true },
  {
    x: -1,
    y: -1,
    z: -1,
    val: true,
    bottom_panel: true,
    right_panel: true,
    front_panel: true,
  },

  //(basso-centro)
  { x: 0, y: -1, z: 1, val: false, bottom_panel: true, rear_panel: true },
  { x: 0, y: -1, z: 0, val: false, center: true, bottom_panel: true },
  { x: 0, y: -1, z: -1, val: false, bottom_panel: true, front_panel: true },

  //(basso-sx)
  {
    x: 1,
    y: -1,
    z: 1,
    val: false,
    bottom_panel: true,
    left_panel: true,
    rear_panel: true,
  },
  { x: 1, y: -1, z: 0, val: false, bottom_panel: true, left_panel: true },
  {
    x: 1,
    y: -1,
    z: -1,
    val: false,
    bottom_panel: true,
    left_panel: true,
    front_panel: true,
  },

  //2nd level (medio-dx)
  {
    x: -1,
    y: 0,
    z: 1,
    val: false,
    center: false,
    right_panel: true,
    rear_panel: true,
  },
  { x: -1, y: 0, z: 0, val: false, center: false, right_panel: true },
  {
    x: -1,
    y: 0,
    z: -1,
    val: false,
    center: false,
    right_panel: true,
    front_panel: true,
  },
  //(medio-centro)
  { x: 0, y: 0, z: 1, val: false, center: false, rear_panel: true },
  { x: 0, y: 0, z: 0, val: false, center: true },
  { x: 0, y: 0, z: -1, val: false, center: false, front_panel: true },
  //(medio-sx)
  {
    x: 1,
    y: 0,
    z: 1,
    val: false,
    center: false,
    left_panel: true,
    rear_panel: true,
  },
  { x: 1, y: 0, z: 0, val: false, center: false, left_panel: true },
  {
    x: 1,
    y: 0,
    z: -1,
    val: false,
    center: false,
    left_panel: true,
    front_panel: true,
  },

  //3rd level (alto)
  //(alto-dx)
  {
    x: -1,
    y: 1,
    z: 1,
    val: false,
    top_panel: true,
    right_panel: true,
    rear_panel: true,
  },
  { x: -1, y: 1, z: 0, val: false, top_panel: true, right_panel: true },
  {
    x: -1,
    y: 1,
    z: -1,
    val: false,
    top_panel: true,
    right_panel: true,
    front_panel: true,
  },
  //(alto-centro)
  { x: 0, y: 1, z: 1, val: false, top_panel: true, rear_panel: true },
  { x: 0, y: 1, z: 0, val: false, center: true, top_panel: true },
  { x: 0, y: 1, z: -1, val: true, top_panel: true, front_panel: true },
  //(alto-sx)

  {
    x: 1,
    y: 1,
    z: 1,
    val: false,
    top_panel: true,
    left_panel: true,
    rear_panel: true,
  },
  { x: 1, y: 1, z: 0, val: false, top_panel: true, left_panel: true },
  {
    x: 1,
    y: 1,
    z: -1,
    val: true,
    top_panel: true,
    left_panel: true,
    front_panel: true,
  },
];

const starsCount = 2000;
starGeo = new THREE.BufferGeometry();
starGeo.setAttribute(
  "position",
  new THREE.BufferAttribute(new Float32Array(6 * starsCount), 3)
);
starGeo.setAttribute(
  "velocity",
  new THREE.BufferAttribute(new Float32Array(2 * starsCount), 1)
);
let pos = starGeo.getAttribute("position");
let pa = pos.array;
let vel = starGeo.getAttribute("velocity");
let va = vel.array;

function init() {
  // Clock
  //clock = new THREE.Clock();

  // Scene
  /*const*/ scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);

  // Render
  /*const*/ renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
  });
  renderer.setSize(options.width, options.height);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.xr.enabled = true;
  //document.body.appendChild( VRButton.createButton( renderer ) );
  //document.body.appendChild(renderer.domElement);
  document.getElementById("app").appendChild(renderer.domElement);

  // Camera
  let far = window.innerWidth < 768 ? 60 : 50;
  /*const*/ camera = new THREE.PerspectiveCamera(
    far,
    options.width / options.height,
    1,
    1000
  );

  camera.position.z = -300;
  //scene.add( camera ); // required when the camera has a child
  // }

  //function initSpace(){

  for (let point_index = 0; point_index < starsCount; point_index++) {
    //points (stars) coordinates
    let x = Math.random() * 400 - 200;
    let y = Math.random() * 400 - 200;
    let z = Math.random() * 400 - 200;
    let xx = x;
    let yy = y;
    let zz = z;

    //point start
    pa[6 * point_index] = x;
    pa[6 * point_index + 1] = y;
    pa[6 * point_index + 2] = z;
    //point end
    pa[6 * point_index + 3] = xx;
    pa[6 * point_index + 4] = yy;
    pa[6 * point_index + 5] = zz;

    va[2 * point_index] = va[2 * point_index + 1] = 0;
  }

  const starTextureLoader = new THREE.TextureLoader();
  const starTexture = starTextureLoader.load(srcStarMap);
  const starMaterial = new THREE.PointsMaterial({
    color: 0xaaaaaa,
    size: 0.5,
    map: starTexture,
    sizeAttenuation: true,
  });

  stars = new THREE.Points(starGeo, starMaterial);
  scene.add(stars);
}

function initLights() {
  /*
  spotLight1 = new THREE.SpotLight( 0xFFFFFF, 150);
  spotLight1.position.set( 4, 3, -5 );
  spotLight1.angle = Math.PI / 1.5; // apertura del cono luce
  spotLight1.penumbra = 0.2;
  spotLight1.decay = 2;
  spotLight1.distance = 0;

  spotLight2 = new THREE.SpotLight( 0xFFFFFF, 150);
  spotLight2.position.set( -4, 3, -5 );
  spotLight2.angle = Math.PI / 1.5; // apertura del cono luce
  spotLight2.penumbra = 0.2;
  spotLight2.decay = 2;
  spotLight2.distance = 0;

  spotLight3 = new THREE.SpotLight( 0xFFFFFF, 150);
  spotLight3.position.set( 4, -3, -5 );
  spotLight3.angle = Math.PI / 1.5; // apertura del cono luce
  spotLight3.penumbra = 0.2;
  spotLight3.decay = 2;
  spotLight3.distance = 0;

  spotLight4 = new THREE.SpotLight( 0xFFFFFF, 150);
  spotLight4.position.set( -4, -3, -5 );
  spotLight4.angle = Math.PI / 1.5; // apertura del cono luce
  spotLight4.penumbra = 0.2;
  spotLight4.decay = 2;
  spotLight4.distance = 0;

  frontLight = new THREE.PointLight( 0xFFFFFF, 100, 250);
  frontLight.position.set(0,0,-3);

  camera.add( spotLight1 );
  camera.add( spotLight2 );
  camera.add( spotLight3 );
  camera.add( spotLight4 );
  camera.add( frontLight );*/

  const ambient = new THREE.AmbientLight(0x222222);
  scene.add(ambient);
  const plight = new THREE.PointLight(0xffffff);
  scene.add(plight);
}

function initMasterCube() {
  // Master Cube
  masterCubeGrp = new THREE.Group();
  masterCubeGrp.position.y = 0;
  scene.add(masterCubeGrp);
}

function createCube(
  color,
  val,
  center,
  bottom_panel,
  top_panel,
  left_panel,
  right_panel,
  front_panel,
  rear_panel
) {
  const meshGeometry = new THREE.BoxGeometry(1, 1, 1);
  const meshMaterial = new THREE.MeshPhongMaterial({ color: color });
  const mesh = new THREE.Mesh(meshGeometry, meshMaterial);
  //const obj = new THREE.Object3D();
  //obj.add(mesh);

  return {
    mesh,
    val,
    center,
    bottom_panel,
    top_panel,
    left_panel,
    right_panel,
    front_panel,
    rear_panel,
  };
}

function fillMasterCube() {
  listInnerCubes.forEach(function (innerCube) {
    const cube = createCube(
      0x000000,
      innerCube.val,
      innerCube.center,
      innerCube.bottom_panel,
      innerCube.top_panel,
      innerCube.left_panel,
      innerCube.right_panel,
      innerCube.front_panel,
      innerCube.rear_panel
    );
    cubeArray.push(cube);

    cube.mesh.position.x = innerCube.x;
    cube.mesh.position.y = innerCube.y;
    cube.mesh.position.z = innerCube.z;

    masterCubeGrp.add(cube.mesh);
  });
}

function initControls() {
  // CONTROLS
  controls = new OrbitControls(camera, renderer.domElement);
  // controls = new TrackballControls(camera, renderer.domElement);
  /*
  controls.maxDistance = 20;
  controls.minDistance = 3;
*/
  // Inizializzazione valori per le interazioni
  // Dipendeza delle variabili da camera e controls
  /*
  valoreInizialeXRot = camera.rotation.x;
  valoreFinaleXRot = valoreInizialeXRot;
  valoreInizialeYRot = camera.rotation.y;
  valoreFinaleYRot = valoreInizialeYRot;
  valoreInizialeZRot = camera.rotation.z;
  valoreFinaleZRot = valoreFinaleZRot;
  valoreZoomIniziale = controls.target.distanceTo( controls.object.position );
  valoreZoomFinale = valoreZoomIniziale;


  controls.addEventListener('change',function(){
    readRotationValues();
    readZoomValue();
  });*/
}

function initRaycaster() {
  // EVENT LISTENERS
  window.addEventListener("pointermove", (e) => {
    mouse.set(
      (e.clientX / options.width) * 2 - 1,
      -(e.clientY / options.height) * 2 + 1
    );
    raycaster.setFromCamera(mouse, camera);
    //intersects = raycaster.intersectObjects(scene.children, true);
    intersects = raycaster.intersectObjects(masterCubeGrp.children, true);
    //console.log(intersects);

    /*
      Object.keys(hovered).forEach((key) => {
        const hit = intersects.find((hit) => hit.object.uuid === key)
        if (hit === undefined) {
          const hoveredItem = hovered[key]
          if (hoveredItem.object.onPointerOver) hoveredItem.object.onPointerOut(hoveredItem)
          delete hovered[key]
        }
      });*/
    randomCubeAnimation(e);
  });

  /* MOUSE LISTENERS */
  const raycaster = new THREE.Raycaster();
  var raycaster2 = new THREE.Raycaster();
  var mouse = new THREE.Vector2();
  let intersects = [];
  let hovered = {};

  function onMouseMove(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    /*
        console.log(mouse.x);
        console.log(mouse.y);
        console.log(event);*/
    //return event;
  }
}

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);

  tasksFirst.forEach((task) => task());
}

/* ******************************* ANIMATIONS ******************************* */
function animationsLoops() {
  //Fluttuare
  tasksFirst.push(() => {
    for (let point_index = 0; point_index < starsCount; point_index++) {
      va[2 * point_index] += -0.0025;
      va[2 * point_index + 1] += -0.0025;

      pa[6 * point_index + 2] += va[2 * point_index];
      pa[6 * point_index + 5] += va[2 * point_index + 1];

      if (pa[6 * point_index + 5] < -250) {
        let z = Math.random() * 400 - 200;

        pa[6 * point_index + 2] = z;
        pa[6 * point_index + 5] = z;
        va[2 * point_index] = va[6 * point_index + 1] = 0;
      }
    }
    starGeo.getAttribute("position").needsUpdate = true;

    //camera.rotation.y += 1;

    /*
    camera.rotation.y = Date.now()*0.0001;
    room.rotation.x = Math.sin(Date.now()*0.0001)*0.2;*/
    /*
    masterCubeGrp.position.y = Math.sin(Date.now()*0.001)*0.5;
    masterCubeGrp.rotation.y = Math.sin(Date.now()*0.001)*0.1;*/
  });
}
animationsLoops();

var bottom_lim = 1.5;
var top_lim = 1.5;
var left_lim = 1.5;
var right_lim = 1.5;
var front_lim = 1.5;
var rear_lim = 1.5;

function aperturaMastercube() {
  cubeArray.forEach((cube, index) => {
    if (cube.bottom_panel)
      gsap.to(cube.mesh.position, {
        duration: 1,
        y: -bottom_lim,
        ease: "none",
      });

    if (cube.top_panel)
      gsap.to(cube.mesh.position, { duration: 1, y: top_lim, ease: "none" });

    if (cube.left_panel)
      gsap.to(cube.mesh.position, { duration: 1, x: left_lim, ease: "none" });

    if (cube.right_panel)
      gsap.to(cube.mesh.position, { duration: 1, x: -right_lim, ease: "none" });

    if (cube.rear_panel)
      gsap.to(cube.mesh.position, { duration: 1, z: rear_lim, ease: "none" });

    if (cube.front_panel)
      gsap.to(cube.mesh.position, { duration: 1, z: -front_lim, ease: "none" });
  });
}

function getRandomColor() {
  let r = Math.floor(Math.random() * 255);
  let g = Math.floor(Math.random() * 255);
  let b = Math.floor(Math.random() * 255);
  //let color = new THREE.Color("rgb("+r+"%, "+g+"%, "+b+"%)");
  let color = new THREE.Color("rgb(" + r + ", " + g + ", " + b + ")");

  return color;
}

function detectBrowser() {
  console.log(navigator.userAgent);
  console.log(navigator);
  // Opera 8.0+
  var isOpera =
    (!!window.opr && !!opr.addons) ||
    !!window.opera ||
    navigator.userAgent.indexOf(" OPR/") >= 0;

  // Firefox 1.0+
  var isFirefox = typeof InstallTrigger !== "undefined";

  // Safari 3.0+ "[object HTMLElementConstructor]"
  var isSafari =
    /constructor/i.test(window.HTMLElement) ||
    (function (p) {
      return p.toString() === "[object SafariRemoteNotification]";
    })(
      !window["safari"] ||
        (typeof safari !== "undefined" && window["safari"].pushNotification)
    );

  // Internet Explorer 6-11
  var isIE = /*@cc_on!@*/ false || !!document.documentMode;

  // Edge 20+
  var isEdge = !isIE && !!window.StyleMedia;

  // Chrome 1 - 79
  var isChrome =
    !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime);

  // Edge (based on chromium) detection
  var isEdgeChromium = isChrome && navigator.userAgent.indexOf("Edg") != -1;

  // Blink engine detection
  var isBlink = (isChrome || isOpera) && !!window.CSS;

  var output = "Detecting browsers by ducktyping:\n";
  output += "isFirefox: " + isFirefox + "\n";
  output += "isChrome: " + isChrome + "\n";
  output += "isSafari: " + isSafari + "\n";
  output += "isOpera: " + isOpera + "\n";
  output += "isIE: " + isIE + "\n";
  output += "isEdge: " + isEdge + "\n";
  output += "isEdgeChromium: " + isEdgeChromium + "\n";
  output += "isBlink: " + isBlink + "\n";
  console.log(output);
}

/* ******************************* EVENTS LISTENERS ******************************* */

function randomCubeAnimation() {
  //let bankSelected = Math.round(Math.random() * bankClusterCubes + 1 );

  // Random Cubes Rotation
  let cubeIndex = Math.floor(Math.random() * 26);

  // Rotation Properties
  let myDurationRotation = Math.random() * 3;
  let myDelayRotation = Math.random() * 1.5;
  let myRepeatRotation = Math.floor(Math.random() * 3);
  const degreeRotation = 360;

  let myAxis = ["x", "y", "z"];
  let myAxisIndex = Math.floor(Math.random() * 2);

  var animPropRotation = {
    duration: myDurationRotation,
    delay: myDelayRotation,
    repeat: myRepeatRotation,
    ease: "sine",

    x: myAxis[myAxisIndex] == "x" ? (degreeRotation * Math.PI) / 180 : 0,
    y: myAxis[myAxisIndex] == "y" ? (degreeRotation * Math.PI) / 180 : 0,
    z: myAxis[myAxisIndex] == "z" ? (degreeRotation * Math.PI) / 180 : 0,

    onComplete: function () {
      if (!myRepeatRotation) {
        myTween.shift().kill();
        //console.log('shift!!');
      }

      // Limiting Glitch Rotation (?)
      if (myAxis[myAxisIndex] == "x")
        masterCubeGrp.children[cubeIndex].rotation.x = 0;
      if (myAxis[myAxisIndex] == "y")
        masterCubeGrp.children[cubeIndex].rotation.y = 0;
      if (myAxis[myAxisIndex] == "z")
        masterCubeGrp.children[cubeIndex].rotation.z = 0;
    },
  };

  myTween.push(
    gsap.to(masterCubeGrp.children[cubeIndex].rotation, animPropRotation)
  ); // Rotation
}

//Promise to fetch data from php file (JSON)
/*
var html_lines = Array(); // p elements array
function readFileAJAX(){  

  const promise = fetch("https://www.opificiotransmediale.com/test/post.php")
                  .then( (rispostServer) => rispostServer.json() )
                  .then( (datiRicevuti) => {
                    
                    // Add p element to array after fetching
                    datiRicevuti.forEach( (dato) => {
                      let p = document.createElement("p");
                      let content = document.createTextNode(dato);
                      p.classList.add('text-line-code');

                      if(Math.random() > 0.7)
                        p.classList.add('text-blink-it');

                      p.appendChild(content);

                      html_lines.push(p);
                    });

                  })
                  .catch( err => console.log('Problemi con il server o la connessione!') )
                  .finally( _ => {

                    html_lines.forEach( (line, index) => {
                      gsap.to(line, {
                        duration: 0.1,
                        delay: 0.1*index,
                        opacity: 1,
                        onUpdate: function(){
                          console.log(line);
                          document.querySelector("#text-container > div").appendChild(line);
                        },
                        onComplete: function(){
                        }
                      });
                    });

                    html_lines = []; //clear array
                    console.log('Fetch completata!')
                  });
}
*/

/*

ScrollTrigger.addEventListener("scrollStart", function() {
    
});
ScrollTrigger.addEventListener("scrollEnd", function() {
  initTextScrolling();
  launchTextScrolling();
});
*/

var myTween = [];
var needle;
var masterCubeOpened = false;
var onMouseMove = false;
var onTouchMove = false;

document.getElementById("app").addEventListener("mousedown", () => {
  if (!masterCubeOpened) {
    aperturaMastercube();
    masterCubeOpened = true;
  }
});

document.getElementById("app").addEventListener("touchstart", () => {
  if (!masterCubeOpened) {
    aperturaMastercube();
    masterCubeOpened = true;
  }
});

/*
window.addEventListener('mousedown', function(){

  onMouseMove = true;
  
  needle = setInterval(()=>{
    if(onMouseMove){
      initTextScrolling();
      launchTextScrolling();
    }
  },1200);
});

window.addEventListener('mouseup', function(){
  onMouseMove = false;
  clearInterval(needle);
});
window.addEventListener('click', function(e){
  if(!onMouseMove){
    initTextScrolling();
    launchTextScrolling();
  }
});


window.addEventListener('touchstart', function(){

  if(!onTouchMove){
    initTextScrolling();
    launchTextScrolling();
  }

  
  needle = setInterval(()=>{
    if(onTouchMove){
      initTextScrolling();
      launchTextScrolling();
    }
  },2000);
});
*/

window.addEventListener("touchstart", function () {
  //No sleep display
  noSleep.enable();
});
window.addEventListener("touchmove", function () {
  onTouchMove = true;
});

window.addEventListener("touchend", function () {
  onTouchMove = false;
  clearInterval(needle);
});

function readRotationValues() {
  valoreFinaleXRot = camera.rotation.x;
  valoreFinaleYRot = camera.rotation.y;
  valoreFinaleZRot = camera.rotation.z;
}

function readZoomValue() {
  valoreZoomFinale = controls.target.distanceTo(controls.object.position);
}

function initTextScrolling() {
  // Assegno un id ad ogni div.text
  let idvalue = "text-1";
  if (document.querySelectorAll(".text").length > 0)
    idvalue = "text-" + (document.querySelectorAll(".text").length + 1);

  // Assegno la classe last all'ultimo div creato
  // prima rimuovo l'ultimo last inserito
  if (document.querySelectorAll(".last").length > 0)
    document.querySelectorAll(".last").forEach((div) => {
      div.classList.remove("last");
    });

  // Creo il nuovo div.text.last
  let scrollerDIV = document.createElement("div");
  scrollerDIV.classList.add("text");
  scrollerDIV.classList.add("last");
  scrollerDIV.setAttribute("id", idvalue);
  document.getElementById("text-container").appendChild(scrollerDIV);
}

function launchTextScrolling() {
  let degreeXRot = (valoreFinaleXRot - valoreInizialeXRot) * (180 / Math.PI);
  let degreeYRot = (valoreFinaleYRot - valoreInizialeYRot) * (180 / Math.PI);
  let degreeZRot = (valoreFinaleZRot - valoreInizialeZRot) * (180 / Math.PI);
  let zoomValue = valoreZoomFinale - valoreZoomIniziale;
  degreeXRot = degreeXRot.toFixed(2);
  degreeYRot = degreeYRot.toFixed(2);
  degreeZRot = degreeZRot.toFixed(2);
  zoomValue = zoomValue.toFixed(2);
  degreeXRot = degreeXRot > 0 ? "+" + degreeXRot + "°" : degreeXRot + "°";
  degreeYRot = degreeYRot > 0 ? "+" + degreeYRot + "°" : degreeYRot + "°";
  degreeZRot = degreeZRot > 0 ? "+" + degreeZRot + "°" : degreeZRot + "°";

  let pElemXRot = document.createElement("p");
  let pElemYRot = document.createElement("p");
  let pElemZRot = document.createElement("p");
  let pElemZoom = document.createElement("p");
  let contentX = document.createTextNode(
    "<x-rotation>" + degreeXRot + "</x-rotation>"
  );
  let contentY = document.createTextNode(
    "<y-rotation>" + degreeYRot + "</y-rotation>"
  );
  let contentZ = document.createTextNode(
    "<z-rotation>" + degreeZRot + "</z-rotation>"
  );

  let contentZoom;

  if (zoomValue == 0) {
    contentZoom = document.createTextNode("<zoom>" + zoomValue + "</zoom>");
  } else if (zoomValue > 0) {
    contentZoom = document.createTextNode(
      "<zoom-out>" + zoomValue + "</zoom-out>"
    );
  } else {
    contentZoom = document.createTextNode(
      "<zoom-in>" + zoomValue + "</zoom-in>"
    );
  }

  pElemXRot.classList.add("text-line-code");
  pElemYRot.classList.add("text-line-code");
  pElemZRot.classList.add("text-line-code");
  pElemZoom.classList.add("text-line-code");
  pElemXRot.appendChild(contentX);
  pElemYRot.appendChild(contentY);
  pElemZRot.appendChild(contentZ);
  pElemZoom.appendChild(contentZoom);

  if (Math.random() > 0.7) pElemXRot.classList.add("text-blink-it");
  if (Math.random() > 0.7) pElemYRot.classList.add("text-blink-it");
  if (Math.random() > 0.7) pElemZRot.classList.add("text-blink-it");
  if (Math.random() > 0.7) pElemZoom.classList.add("text-blink-it");

  if (document.querySelector(".last")) {
    document.querySelector(".last").appendChild(pElemXRot);
    document.querySelector(".last").appendChild(pElemYRot);
    document.querySelector(".last").appendChild(pElemZRot);
    document.querySelector(".last").appendChild(pElemZoom);
    addScrollTextTimeLine(document.querySelector(".last"));
  }

  valoreInizialeXRot = valoreFinaleXRot;
  valoreInizialeYRot = valoreFinaleYRot;
  valoreInizialeZRot = valoreFinaleZRot;
  valoreZoomIniziale = valoreZoomFinale;
}

function addScrollTextTimeLine(container) {
  let tl = gsap.timeline();

  tl.to(container, {
    duration: 6,
    opacity: 0.5,
    delay: 0.4,
    y: -window.innerHeight - document.querySelector(".last").clientHeight,
    ease: "power2.out",
    onStart: function () {},
    onUpdate: function () {},
    onComplete: function () {
      container.remove();
    },
  });

  tl.play();
}

document.addEventListener(
  "keydown",
  (event) => {
    const keyName = event.key;

    if (keyName === "a") {
      aperturaMastercube();
    }
  },
  false
);

function touchFuncs() {
  const el = document.getElementById("app");
  el.addEventListener("touchstart", () => {
    console.log("touchstart!!");

    /*
    flash();*/
    //toggleText(1, document.getElementById('text-container'));
  });
  el.addEventListener("touchend", () => {
    console.log("touchend!!");
    //toggleText(0, document.getElementById('text-container'));

    /*
    clearInterval(removeFlash,100);
    clearInterval(goFlash,100);*/
  });
  el.addEventListener("touchcancel", () => {
    console.log("touchcancel!!");
  });
  el.addEventListener("touchmove", () => {
    console.log("touchmove!!");

    /*
    console.log(camera.rotation.x);
    console.log(camera.rotation.y);
    console.log(camera.rotation.z);
*/
  });
  console.log("Initialized.");
}
document.addEventListener("DOMContentLoaded", touchFuncs);

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
/*
function onMouseClick( event ) {
    
  raycaster2.setFromCamera( mouse, camera );
  var isIntersected = raycaster2.intersectObjects(masterCubeGrp.children, true);

  if (isIntersected) {
      console.log('Mesh clicked!');
  }
}
*/
//////// AUDIO ////////
// VARIABILI TONEJS
var elem = document.documentElement;
// AudioPlayer
function audio() {
  /* AUDIO */
  let urlFile =
    "https://raw.githubusercontent.com/csytp/file_audio_web_box/main/Nastro_Web_Box_OK.aac";

  const meter = new Tone.Meter();
  // Create a new player instance without autostart
  var player = new Tone.Player({
    url: urlFile,
    autostart: true, // Autostart is false to wait for onload
    loop: 1,
    onload: function () {
      // Start playback after the player has loaded the audio
      player.start();
      player.connect(meter);
      // Set the volume
      player.volume.rampTo(0, 0.5);
      setInterval(() => {
        //console.log(meter.getValue());
        // Background color change logic
        if (meter.getValue() > -10) {
          changeBackgroundColor();
        }
      }, 50);
    },
  }).toDestination();
}
/*

// FUNZIONI GRAFICHE
// rimuove bottone
function removeButton() {

  var buttonContainer = document.getElementById("hideButton");
  //buttonContainer.style.display = "none";
  buttonContainer.remove();
  
  if(document.getElementById('app'))
    start();
}
*/
function start() {
  //create a synth and connect it to the main output (your speakers)
  const debug = new Tone.Synth().toDestination();

  //play a middle 'C' for the duration of an 8th note
  debug.triggerAttackRelease("C4", "16n").volume.value = -80;

  /*
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.webkitRequestFullscreen) {
    //Safari
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) {
    //IE11
    elem.msRequestFullscreen();
  }*/

  // Initializing threejs-engine
  init();
  //initSpace();
  //initLights();
  /*
  initMasterCube();  
  fillMasterCube();*/
  initControls();
  animate();
  //initRaycaster();
  //audio();
}

window.addEventListener("resize", onWindowResize, false);
//window.addEventListener( 'click', onMouseClick, false );

start();
/*
document.getElementById('startButton').addEventListener('click', function(event){
  event.preventDefault();
  event.stopImmediatePropagation();
  removeButton();
});
*/
function changeBackgroundColor(e) {
  //document.body.style.backgroundColor = "black";
  scene.background = new THREE.Color(0x000000);
  setTimeout(() => {
    //document.body.style.backgroundColor = "white";
    scene.background = new THREE.Color(0xffffff);
    setTimeout(() => {
      //document.body.style.backgroundColor = "black";
      scene.background = new THREE.Color(0x000000);

      setTimeout(() => {
        //document.body.style.backgroundColor = "white";
        scene.background = new THREE.Color(0xffffff);
      }, 100);
    }, 100); // Change back to white after 0.5 seconds
  }, 100); // Change to black after 0.5 seconds
}

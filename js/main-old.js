import './../css/style.css';
import * as THREE from 'three';
import gsap from "gsap";
import { BoxLineGeometry, TrackballControls, Timer } from 'three/examples/jsm/Addons.js';


var tasksFirst = [];
var tasksSecond = [];
var cubeArray = [];
let clock, timer;
let camera, scene, renderer, room;
let planeFrontWall, planeBackWall, planeSideWallLeft, planeSideWallRight, planeFloor, planeRoof;
let spotLight1, spotLight2, spotLight3, spotLight4, frontLight;

// Options
const options = {
  width: window.innerWidth,
  height: window.innerHeight
}

// Inner Cubes List
var listInnerCubes = [
  //1st level (basso)
  //(basso-dx)
  {x:-1, y:-1, z:1, val: false, bottom_panel:true, right_panel: true, rear_panel:true},
  {x:-1, y:-1, z:0, val: false, bottom_panel:true, right_panel: true},
  {x:-1, y:-1, z:-1, val: true, bottom_panel:true, right_panel: true, front_panel: true},

  //(basso-centro)
  {x:0, y:-1, z:1, val: false, bottom_panel:true, rear_panel:true},
  {x:0, y:-1, z:0, val: false, center: true, bottom_panel:true},
  {x:0, y:-1, z:-1, val: false, bottom_panel:true, front_panel: true},

  //(basso-sx)  
  {x:1, y:-1, z:1, val: false, bottom_panel:true, left_panel: true, rear_panel:true},
  {x:1, y:-1, z:0, val: false, bottom_panel:true, left_panel: true},
  {x:1, y:-1, z:-1, val: false, bottom_panel:true, left_panel: true, front_panel: true},
  
  //2nd level (medio-dx)
  {x:-1, y:0, z:1, val: false, center: false, right_panel: true, rear_panel:true},
  {x:-1, y:0, z:0, val: false, center: false, right_panel: true},
  {x:-1, y:0, z:-1, val: false, center: false, right_panel: true, front_panel: true},
  //(medio-centro)
  {x:0, y:0, z:1, val: false, center: false, rear_panel:true},
  {x:0, y:0, z:0, val: false, center: true},
  {x:0, y:0, z:-1, val: false, center: false, front_panel: true},
  //(medio-sx)
  {x:1, y:0, z:1, val: false, center: false, left_panel: true, rear_panel:true},
  {x:1, y:0, z:0, val: false, center: false, left_panel: true},
  {x:1, y:0, z:-1, val: false, center: false, left_panel: true, front_panel: true},
  
  //3rd level (alto)
  //(alto-dx)
  {x:-1, y:1, z:1, val: false, top_panel:true, right_panel: true, rear_panel:true},
  {x:-1, y:1, z:0, val: false, top_panel:true, right_panel: true},
  {x:-1, y:1, z:-1, val: false, top_panel:true, right_panel: true, front_panel: true},
  //(alto-centro)
  {x:0, y:1, z:1, val: false, top_panel:true, rear_panel:true},
  {x:0, y:1, z:0, val: false, center: true, top_panel:true},
  {x:0, y:1, z:-1, val: true, top_panel:true, front_panel: true},
  //(alto-sx)

  {x:1, y:1, z:1, val: false, top_panel:true, left_panel: true, rear_panel:true},
  {x:1, y:1, z:0, val: false, top_panel:true, left_panel: true},
  {x:1, y:1, z:-1, val: true, top_panel:true, left_panel: true, front_panel: true}
];


var interactionsText = {
  rotation: 'Ruota!',
  zoom: 'ZOOM!!!'
}

function init(){

  // Clock
  clock = new THREE.Clock();

  // Scene
  /*const*/ scene = new THREE.Scene();
  scene.background = new THREE.Color( 0xffffff );

  timer = new Timer();

  // Render
  /*const*/ renderer = new THREE.WebGLRenderer({alpha: true, antialias: true});
  renderer.setSize(options.width, options.height);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.xr.enabled = true;
  //document.body.appendChild( VRButton.createButton( renderer ) );
  //document.body.appendChild(renderer.domElement);
  document.getElementById('app').appendChild(renderer.domElement);

  // Camera
  let far = (window.innerWidth < 768 ? 60 : 50);
  //let far = 50;
  /*const*/ camera = new THREE.PerspectiveCamera(far, options.width / options.height, 1, 1000 );
  camera.position.set( 0, 0, -10 );
  //camera.lookAt(masterCubeGrp);
  scene.add( camera ); // required when the camera has a child
}
init();


function initRoom(){
  // Room
  room = new THREE.LineSegments(
    new BoxLineGeometry( 20, 10, 25, 100, 100, 100 ).translate( 0, 0, 0 ),
    new THREE.LineBasicMaterial( { color: 0x808080 } )
  );
  room.rotation.set(0, 0, 0);
  room.position.set( 0, 0, -10 );

  //Room Walls
  //const geometry = new THREE.PlaneGeometry( 20, 10 );
  const material = new THREE.MeshLambertMaterial( {color:  0xf2f4f4 , side: THREE.DoubleSide} );

  planeFrontWall = new THREE.Mesh( new THREE.PlaneGeometry( 20, 10 ), material );
  planeBackWall = new THREE.Mesh( new THREE.PlaneGeometry( 20, 10 ), material );

  planeSideWallLeft = new THREE.Mesh( new THREE.PlaneGeometry( 25, 10 ), material );
  planeSideWallRight = new THREE.Mesh( new THREE.PlaneGeometry( 25, 10 ), material );

  planeFloor = new THREE.Mesh( new THREE.PlaneGeometry( 20, 25 ), material );
  planeRoof = new THREE.Mesh( new THREE.PlaneGeometry( 20, 25 ), material );

  planeFrontWall.position.z = -12.4;
  planeBackWall.position.z = 2;

  planeSideWallLeft.position.x = -9.9;
  planeSideWallLeft.position.z = 0;
  planeSideWallLeft.rotation.y = Math.PI / 2;

  planeSideWallRight.position.x = 9.9;
  planeSideWallRight.position.z = 0;
  planeSideWallRight.rotation.y = -Math.PI / 2;

  planeFloor.position.x = 0;
  planeFloor.position.y = -4.9;
  planeFloor.rotation.x = -Math.PI / 2;

  planeRoof.position.x = 0;
  planeRoof.position.y = 4.9;
  planeRoof.rotation.x = Math.PI / 2 ;

  /*
  room.add( planeFrontWall );
  //room.add( planeBackWall );
  room.add( planeSideWallLeft );
  room.add( planeSideWallRight );
  room.add( planeFloor );
  room.add( planeRoof );
  */
}
initRoom();


function displayRoom(){
  //console.log(window.innerWidth);
  if(window.innerWidth < 768)
  {
    camera.remove( room );
  }
  else{
    // FIX ROOM (and rotate only the mastercube)
    //scene.add( camera ); // required when the camera has a child
    camera.add( room );
  }
}
displayRoom();


function initLights(){
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
  camera.add( frontLight );
}
initLights();

// Master Cube
var masterCubeGrp = new THREE.Group();
masterCubeGrp.position.y = 0;
scene.add(masterCubeGrp);


function createCube(color, val, center, bottom_panel, top_panel, left_panel, right_panel, front_panel, rear_panel){
  const meshGeometry = new THREE.BoxGeometry(1, 1, 1);
  const meshMaterial = new THREE.MeshPhongMaterial({color: color});  
  const mesh = new THREE.Mesh(meshGeometry, meshMaterial);
  //const obj = new THREE.Object3D();
  //obj.add(mesh);

  return {mesh, val, center, bottom_panel, top_panel, left_panel, right_panel, front_panel, rear_panel}
}

function fillMasterCube(){
    
  listInnerCubes.forEach(function(innerCube){
    
    const cube = createCube(0x000000, innerCube.val, innerCube.center, innerCube.bottom_panel, innerCube.top_panel, innerCube.left_panel, innerCube.right_panel, innerCube.front_panel, innerCube.rear_panel);
    cubeArray.push(cube);
    
    cube.mesh.position.x = innerCube.x;
    cube.mesh.position.y = innerCube.y;
    cube.mesh.position.z = innerCube.z;
    
    
    masterCubeGrp.add(cube.mesh);
  });
}
fillMasterCube();

// CONTROLS
const controls = new TrackballControls(camera, renderer.domElement);
/*
controls.noPan = false;
controls.maxDistance = 10
controls.minDistance = -20;  
controls.noKeys = false;
controls.noRotate = false;
controls.noZoom = false;

*/
// Loop
var aperturaMastercube_flag = false;
var rotazioneCubo_flag = false;


function animate(){
  requestAnimationFrame( animate );
  controls.update();
  timer.update();
  renderer.render(scene, camera);

  tasksFirst.forEach((task) => task());
  tasksSecond.forEach((task) => task());
}
animate();




/* ******************************* ANIMATIONS ******************************* */
function animationsLoops(){
  //Fluttuare  
  tasksFirst.push(()=>{
    masterCubeGrp.position.y = Math.sin(Date.now()*0.001)*0.5;
    masterCubeGrp.rotation.y = Math.sin(Date.now()*0.001)*0.1;
  });   
}
animationsLoops();

var bottom_lim = 1.5;
var top_lim = 1.5;
var left_lim = 1.5;
var right_lim = 1.5;
var front_lim = 1.5;
var rear_lim = 1.5;
var speed = 0.0033;
var time = 0.005; // milliseconds

function animationsLaunch(){
  
  
}



function aperturaMastercube(){
  cubeArray.forEach((cube, index)=>{

    if(cube.bottom_panel)
      gsap.to(cube.mesh.position, {duration:1, y: -bottom_lim, ease: 'none'});

    if(cube.top_panel)
      gsap.to(cube.mesh.position, {duration:1, y: top_lim, ease: 'none'});

    if(cube.left_panel)
      gsap.to(cube.mesh.position, {duration:1, x: left_lim, ease: 'none'});

    if(cube.right_panel)
      gsap.to(cube.mesh.position, {duration:1, x: -right_lim, ease: 'none'});

    if(cube.rear_panel)
      gsap.to(cube.mesh.position, {duration:1, z: rear_lim, ease: 'none'});

    if(cube.front_panel)
      gsap.to(cube.mesh.position, {duration:1, z: -front_lim, ease: 'none'});

  });
}

function getRandomColor()
{
  let r = Math.floor(Math.random()*255);
  let g = Math.floor(Math.random()*255);
  let b = Math.floor(Math.random()*255);
  //let color = new THREE.Color("rgb("+r+"%, "+g+"%, "+b+"%)");
  let color = new THREE.Color("rgb("+r+", "+g+", "+b+")");

  return color;
}




/* ******************************* EVENTS LISTENERS ******************************* */

var myTween= [];
function randomCubeAnimation(){
  /*
  if(myTween)
    myTween.kill();
  */
  // Random Cubes Rotation
    let cubeIndex = Math.floor(Math.random()*26);

  // Rotation Properties  
    let myDurationRotation = Math.random()*3;
    let myDelayRotation = Math.random()*1.5;
    let myRepeatRotation = Math.floor(Math.random()*3);
    const degreeRotation = 360;
  // Position Properties  
    let myDurationPosition = Math.random()*2;
    let myDelayPosition = Math.random()*1.5;
    let myRepeatPosition = Math.floor(Math.random()*2);
    let myPosition = Math.floor(Math.random()*2-1);
    let myAxisIndex = Math.floor(Math.random()*2);
    let myAxis = ['x', 'y', 'z']

    var animPropRotation = {
      duration: myDurationRotation,
      delay: myDelayRotation,
      repeat: myRepeatRotation,
      ease:'sine',

      x: (myAxis[myAxisIndex] == 'x' ? degreeRotation*Math.PI/180 : 0),
      y: (myAxis[myAxisIndex] == 'y' ? degreeRotation*Math.PI/180 : 0),
      z: (myAxis[myAxisIndex] == 'z' ? degreeRotation*Math.PI/180 : 0),

      onComplete: function(){
        if(!myRepeatRotation){
          myTween.shift().kill();
          //console.log('shift!!');
        }
        
        // Limiting Glitch Rotation (?)
        if(myAxis[myAxisIndex] == 'x')
          masterCubeGrp.children[cubeIndex].rotation.x = 0;
        if(myAxis[myAxisIndex] == 'y')
          masterCubeGrp.children[cubeIndex].rotation.y = 0;
        if(myAxis[myAxisIndex] == 'z')
          masterCubeGrp.children[cubeIndex].rotation.z = 0;
      }
    }
    var animPropPositionFrom = {
      x:masterCubeGrp.children[cubeIndex].position.x
    }
    var animPropPositionTo = {
      duration: myDurationPosition,
      delay: myDelayPosition,
      //repeat: myRepeatPosition,
      repeat: 0,
      y:myPosition,
      yoyo: true,
      ease:'sine',
/*
      onComplete: function(){
        if(!myRepeatPosition){
          myTween.shift().kill();
        }
        //masterCubeGrp.children[cubeIndex].rotation.x = 0;
      }*/
    }

    myTween.push(gsap.to(masterCubeGrp.children[cubeIndex].rotation, animPropRotation)); // Rotation

  //} //for end

  

  //myTween = gsap.to(masterCubeGrp.children[cubeIndex].rotation, {duration: 0.5, x:0, y:0, z:0});

  
}

/* KEYBOARD LISTENERS */
function toggleText(value, element) {    
  if (value === 0) {
      //element.setAttribute('style', 'display: none');
      element.classList.remove('flash');
  } else {
    //element.setAttribute('style', 'display: flex');
    element.classList.add('flash');
  }
};



var html_lines = Array(); // p elements array
function readFile(){
  

  const promise = fetch("https://www.opificiotransmediale.com/test/post.php")
                  .then( (rispostServer) => rispostServer.json() )
                  .then( (datiRicevuti) => {
                    
                    // Add p element to array after fetching
                    datiRicevuti.forEach( (dato) => {
                      let p = document.createElement("p");
                      let content = document.createTextNode(dato);
                      p.classList.add('text-line-code');
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
                          document.querySelector("#text-container > div").appendChild(line);
                        }
                      });
                    });

                    html_lines = []; //clear array
                    console.log('Fetch completata!')
                  });
}


function stampHtmlLines(line){
  html_lines.forEach( (line) => {
    
  } );
}

const myrRepetion = 0;
var countRepetion = 0;
function blinkText(pElem){
  var myTween = gsap.to(pElem, {
    duration: 0.5,
    //delay: 0.3,
    autoAlpha:0,
    repeat: -1,
    yoyo:true,
    /*
    snap:{
      autoAlpha: [1, 0.5, 0]
    }*/
  });

}


var indexPress = 0;
document.addEventListener(
  "keydown",
  (event) => {
    const keyName = event.key;

    if (keyName === "a") {
      aperturaMastercube();
    }
    if (keyName === "0") {
      readFile();
      
    }
    if (keyName === "1") {
      //toggleText(0, document.getElementById('text-container'));
      //document.querySelector("#text-container > div").appendChild(generateTextElement(indexPress++));
    }
    if (keyName === "2") {
      blinkText();
    }
    
  },
  false,
);

document.addEventListener(
  "keyup",
  (event) => {
    const keyName = event.key;

    if (keyName === "z") {
      //toggleText(1, document.getElementById('text-container'));
    }
    /*
    if(keyName === "x") {
      toggleText(1, document.getElementById('white-screen'));
      console.log("x left");
    }*/
  },
  false,
);

/* MOUSE LISTENERS */
const raycaster = new THREE.Raycaster();
var raycaster2 = new THREE.Raycaster();
var mouse = new THREE.Vector2();
let intersects = []
let hovered = {}

// EVENT LISTENERS
window.addEventListener('pointermove', (e) => {

  mouse.set((e.clientX / options.width) * 2 - 1, -(e.clientY / options.height) * 2 + 1);
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
  randomCubeAnimation( e );


});

window.addEventListener("resize", onWindowResize);
window.addEventListener( 'click', onMouseClick, false );
//window.addEventListener( 'mousemove', onMouseMove, false );


function onMouseClick( event ) {
  
  raycaster2.setFromCamera( mouse, camera );
  var isIntersected = raycaster2.intersectObjects(masterCubeGrp.children, true);

  if (isIntersected) {
      console.log('Mesh clicked!');
  }
}

function onMouseMove( event ) {
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

    /*
    console.log(mouse.x);
    console.log(mouse.y);
    console.log(event);*/
    //return event;
}

var whiteFlashVisible = false;
function goFlash(){
    
  //console.log(document.getElementById('white-screen').getAttribute('z-index'));
  //document.getElementById('white-screen').setAttribute('style', 'z-index: 0');
  document.getElementById('white-screen').classList.add('flash');
  whiteFlashVisible = true;
}

function removeFlash(){
  document.getElementById('white-screen').classList.remove('flash');
  whiteFlashVisible = true;
}

function flash(){
  let time = timer.getDelta();
  console.log("time->"+time);
  if (time > 1){
    setInterval(removeFlash,100);
  }
  else{
    setInterval(goFlash,100);
  }
}

function touchFuncs() {
  const el = document.getElementById("app");
  el.addEventListener("touchstart", () => {
    console.log('touchstart!!');
    aperturaMastercube();
    /*
    flash();*/
    toggleText(1, document.getElementById('text-container'));
  });
  el.addEventListener("touchend", () => {
    console.log('touchend!!');
    toggleText(0, document.getElementById('text-container'));
    /*
    clearInterval(removeFlash,100);
    clearInterval(goFlash,100);*/
  });
  el.addEventListener("touchcancel", () => {
    console.log('touchcancel!!');
  });
  el.addEventListener("touchmove", () => {
    console.log('touchmove!!');

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
	renderer.setSize( window.innerWidth, window.innerHeight );
  displayRoom();
}


/* ******************************* WEB SOCKET ******************************* */
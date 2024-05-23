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

function init(){

  // Clock
  clock = new THREE.Clock();
  
  // Timer
  timer = new Timer();

  // Scene
  /*const*/ scene = new THREE.Scene();
  scene.background = new THREE.Color( 0xffffff );

  // Render
  /*const*/ renderer = new THREE.WebGLRenderer({alpha: true, antialias: true});
  renderer.setSize(options.width, options.height);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.xr.enabled = true;
  //document.body.appendChild( VRButton.createButton( renderer ) );
  //document.body.appendChild(renderer.domElement);
  document.getElementById('app').appendChild(renderer.domElement);

  // Camera
  /*const*/ camera = new THREE.PerspectiveCamera(50, options.width / options.height, 1, 1000 );
  camera.position.set( 0, 0, -10 );
  //camera.lookAt(0,0,0);
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

const masterCubeGeo = new THREE.BoxGeometry(3, 3, 3);
const masterCubeMat = new THREE.MeshLambertMaterial({color: 0xffffff, transparent: true, opacity: 0.0})
const masterCubeMesh = new THREE.Mesh(masterCubeGeo, masterCubeMat);
masterCubeMesh.position.y = 0;
scene.add(masterCubeMesh);


function createCube(color, val, center, bottom_panel, top_panel, left_panel, right_panel, front_panel, rear_panel){
  const meshGeometry = new THREE.BoxGeometry(1, 1, 1);
  const meshMaterial = new THREE.MeshPhongMaterial({color: color});  
  const mesh = new THREE.Mesh(meshGeometry, meshMaterial);
  const obj = new THREE.Object3D();
  obj.add(mesh);

  return {mesh, obj, val, center, bottom_panel, top_panel, left_panel, right_panel, front_panel, rear_panel}
}

function fillMasterCube(){
    
  listInnerCubes.forEach(function(innerCube){
    
    const cube = createCube(0x000000, innerCube.val, innerCube.center, innerCube.bottom_panel, innerCube.top_panel, innerCube.left_panel, innerCube.right_panel, innerCube.front_panel, innerCube.rear_panel);
    cubeArray.push(cube);
    
    cube.mesh.position.x = innerCube.x;
    cube.mesh.position.y = innerCube.y;
    cube.mesh.position.z = innerCube.z;
    
    
    masterCubeMesh.add(cube.obj);
  });
}
fillMasterCube();

// CONTROLS
const controls = new TrackballControls(camera, renderer.domElement);

controls.noPan = true;
controls.maxDistance = controls.minDistance = 0;  
controls.noKeys = true;
controls.noRotate = false;
controls.noZoom = true;


// Loop
var aperturaMastercube_flag = false;


function animate(){
  requestAnimationFrame( animate );
  controls.update();
  timer.update();
  renderer.render(scene, camera);

  tasksFirst.forEach((task) => task());
  tasksSecond.forEach((task) => task());

  if( aperturaMastercube_flag == true){
    tasksSecond.forEach(() => {
      tasksSecond.pop();
    });
    aperturaMastercube_flag = false;
  }


}
animate();




/* ******************************* ANIMATIONS ******************************* */
function animationsLoops(){
  //Fluttuare  
  tasksFirst.push(()=>{
    masterCubeMesh.position.y = Math.sin(Date.now()*0.001)*0.5;
    masterCubeMesh.rotation.y = Math.sin(Date.now()*0.001)*0.1;
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

setTimeout(1000, animationsLaunch());


function aperturaMastercube(){
  cubeArray.forEach((cube, index)=>{
    
    if(cube.bottom_panel && cube.mesh.position.y >= -bottom_lim){
      setTimeout(()=>{
        tasksSecond.push(()=>{

          cube.mesh.position.y += -speed;         

          if(cube.mesh.position.y <= -bottom_lim)
            {
              aperturaMastercube_flag = true;
              //console.log('stop');
              //clearInterval(10);
            }
        });
        
      },200);
    }

    if(cube.top_panel && cube.mesh.position.y <= top_lim){
      setTimeout(()=>{
        tasksSecond.push(()=>{

          cube.mesh.position.y += speed;         

          if(cube.mesh.position.y >= top_lim)
            {
              aperturaMastercube_flag = true;
              //console.log('stop');
              //clearInterval(10);
            }
        });
        
      },200);
    }

    if(cube.left_panel && cube.mesh.position.x <= left_lim){
      
      setTimeout(()=>{
        tasksSecond.push(()=>{

          cube.mesh.position.x += speed;         

          if(cube.mesh.position.x >= left_lim)
            {
              aperturaMastercube_flag = true;
              //console.log('stop');
              //clearInterval(10);
            }
        });
        
      },200);
    }

    if(cube.right_panel && cube.mesh.position.x >= -right_lim){
      setTimeout(()=>{
        tasksSecond.push(()=>{

          cube.mesh.position.x += -speed;         

          if(cube.mesh.position.x <= -right_lim)
            {
              aperturaMastercube_flag = true;
              //console.log('stop');
              //clearInterval(10);
            }
        });
        
      },200);
    }

    if(cube.rear_panel && cube.mesh.position.x >= -right_lim){
      setTimeout(()=>{
        tasksSecond.push(()=>{

          cube.mesh.position.z += speed;         

          if(cube.mesh.position.z >= rear_lim)
            {
              aperturaMastercube_flag = true;
              //console.log('stop');
              //clearInterval(10);
            }
        });
        
      },200);
    }

    if(cube.front_panel && cube.mesh.position.z >= -front_lim){
      setTimeout(()=>{
        tasksSecond.push(()=>{

          cube.mesh.position.z += -speed;         

          if(cube.mesh.position.z <= -front_lim)
            {
              aperturaMastercube_flag = true;
              //console.log('stop');
              //clearInterval(10);
            }
        });
        
      },200);
    }
  });
}

function getRandomColor()
{
  let r = Math.floor(Math.random()*255);
  let g = Math.floor(Math.random()*255);
  let b = Math.floor(Math.random()*255);
  //let color = new THREE.Color("rgb("+r+"%, "+g+"%, "+b+"%)");
  let color = new THREE.Color("rgb("+r+", "+g+", "+b+")");
/*
  console.log(r);
  console.log(g);
  console.log(b);
  console.log("rgb("+r+"%, "+g+"%, "+b+"%)");
  console.log(color);
*/
  return color;
  //return {r, g, b};
}

function randomCubesRotation(){
  let x = Math.floor(Math.random()*26+1);
  let y = Math.floor(Math.random()*26+1);

  cubeArray[y].mesh.rotateX(THREE.Math.degToRad(90));

  cubeArray.forEach((cube, index)=>{
    if(index == x){
      let rgb = getRandomColor();
      /*
      console.log(rgb.r);
      console.log(rgb.g);
      console.log(rgb.b);*/
/*
      console.log(cube.mesh.material.color.r);
      console.log(cube.mesh.material.color.g);
      console.log(cube.mesh.material.color.b);
*/
      gsap.set(cube.mesh.material.color, {
        duration: 2,
        r: rgb.r,
        g: rgb.g,
        b: rgb.b
      });      
/*
      gsap.to(cube.mesh.material.color, {
      //gsap.to(scene.background, {
        duration: 2,
        r: rgb.r,
        g: rgb.g,
        b: rgb.b
      });
      gsap.timeline().seek(0).play();*/
      //cube.mesh.material.color= getRandomColor();
    }
  });
}
//randomCubesRotation();

/* ******************************* EVENTS LISTENERS ******************************* */

function onClickFuncs(){
  randomCubesRotation();
}

document.addEventListener(
  "keydown",
  (event) => {
    const keyName = event.key;

    if (keyName === "a") {
      // do not alert when only Control key is pressed.
      console.log('hola!');
      aperturaMastercube();
    }
  },
  false,
);

// ANIMATIONS CONTROLS / EVENT LISTNERS
const raycaster = new THREE.Raycaster();
var raycaster2 = new THREE.Raycaster();
var mouse = new THREE.Vector2();
let intersects = []
let hovered = {}

// EVENT LISTENERS
window.addEventListener('pointermove', (e) => {

  mouse.set((e.clientX / options.width) * 2 - 1, -(e.clientY / options.height) * 2 + 1);
  raycaster.setFromCamera(mouse, camera);
  intersects = raycaster.intersectObjects(scene.children, true);
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

});

window.addEventListener("resize", onWindowResize);
window.addEventListener( 'click', onMouseClick, false );
window.addEventListener( 'mousemove', onMouseMove, false );


function onMouseClick( event ) {

  
  raycaster2.setFromCamera( mouse, camera );
  var isIntersected = raycaster2.intersectObject( masterCubeMesh );

  if (isIntersected) {

      //console.log('Mesh clicked!');
      onClickFuncs();
  }
}
function onMouseMove( event ) {
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}


function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
  displayRoom();
}
import './../css/style.css';
import * as THREE from 'three';
import { BoxLineGeometry, FontLoader, TTFLoader, TextGeometry,TrackballControls} from 'three/examples/jsm/Addons.js';
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/Addons.js';
import { LightProbeGenerator  } from 'three/examples/jsm/Addons.js';
//import { GUI } from 'three/examples/jsm/Addons.js';

import * as M1 from './module1.js'
import { lights } from 'three/examples/jsm/nodes/Nodes.js';
//import * as TM from './text-module.js'

// Inner Cubes List
var listInnerCubes = [
  //1st livel
  {x:-1, y:-1, z:1, value: ''},
  {x:-1, y:-1, z:0, value: ''},
  {x:-1, y:-1, z:-1, value: ''},

  {x:0, y:-1, z:1, value: ''},
  {x:0, y:-1, z:0, value: ''},
  {x:0, y:-1, z:-1, value: ''},
  
  {x:1, y:-1, z:1, value: ''},
  {x:1, y:-1, z:0, value: ''},
  {x:1, y:-1, z:-1, value: ''},

  //2nd livel
  {x:-1, y:0, z:1, value: ''},
  {x:-1, y:0, z:0, value: ''},
  {x:-1, y:0, z:-1, value: ''},

  {x:0, y:0, z:1, value: ''},
  {x:0, y:0, z:0, value: ''},
  {x:0, y:0, z:-1, value: ''},
  
  {x:1, y:0, z:1, value: ''},
  {x:1, y:0, z:0, value: ''},
  {x:1, y:0, z:-1, value: ''},

  //3rd livel
  {x:-1, y:1, z:1, value: ''},
  {x:-1, y:1, z:0, value: ''},
  {x:-1, y:1, z:-1, value: ''},

  {x:0, y:1, z:1, value: ''},
  {x:0, y:1, z:0, value: ''},
  {x:0, y:1, z:-1, value: ''},
  
  {x:1, y:1, z:1, value: ''},
  {x:1, y:1, z:0, value: ''},
  {x:1, y:1, z:-1, value: ''},
];


let camera, scene, renderer;
let lightProbe;

// Options
const options = {
  width: window.innerWidth,
  height: window.innerHeight
}

// Clock
const clock = new THREE.Clock();

// Scene
/*const*/ scene = new THREE.Scene();
//scene.background = new THREE.Color( 0xffffff );

// Render
/*const*/ renderer = new THREE.WebGLRenderer({alpha: true, antialias: true});
renderer.setSize(options.width, options.height);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.xr.enabled = true;
//document.body.appendChild( VRButton.createButton( renderer ) );
//document.body.appendChild(renderer.domElement);
document.getElementById('app').appendChild(renderer.domElement);

// Camera
/*const*/ camera = new THREE.PerspectiveCamera(100, options.width / options.height, 1, 1000 );
camera.position.set( 0, 0, -10 );

/*const*/ /*camera2 = new THREE.PerspectiveCamera(50, options.width / options.height, 1, 1000 );
camera2.position.set( 0, 0, -1 );
const helper = new THREE.CameraHelper( camera2);
scene.add( helper );*/

// Objects

// Room
const room = new THREE.LineSegments(
  new BoxLineGeometry( 20, 10, 25, 100, 100, 100 ).translate( 0, 0, 0 ),
  new THREE.LineBasicMaterial( { color: 0x808080 } )
);
room.rotation.set(0, 0, 0);
room.position.set( 0, 0, -10 );
//scene.add( room );


//Room Walls
//const geometry = new THREE.PlaneGeometry( 20, 10 );
const material = new THREE.MeshLambertMaterial( {color:  0xf2f4f4 , side: THREE.DoubleSide, alpha: true} );

const planeFrontWall = new THREE.Mesh( new THREE.PlaneGeometry( 20, 10 ), material );
const planeBackWall = new THREE.Mesh( new THREE.PlaneGeometry( 20, 10 ), material );

const planeSideWallLeft = new THREE.Mesh( new THREE.PlaneGeometry( 25, 10 ), material );
const planeSideWallRight = new THREE.Mesh( new THREE.PlaneGeometry( 25, 10 ), material );

const planeFloor = new THREE.Mesh( new THREE.PlaneGeometry( 20, 25 ), material );
const planeRoof = new THREE.Mesh( new THREE.PlaneGeometry( 20, 25 ), material );

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


room.add( planeFrontWall );
//room.add( planeBackWall );
room.add( planeSideWallLeft );
room.add( planeSideWallRight );
room.add( planeFloor );
room.add( planeRoof );


// FIX ROOM (and rotate only the mastercube)
scene.add( camera ); // required when the camera has a child
camera.add( room );
//scene.add(room); // when testing room structure

const spotLight1 = new THREE.SpotLight( 0xFFFFFF, 150);
spotLight1.position.set( 4, 3, -5 );
spotLight1.angle = Math.PI / 1.5; // apertura del cono luce
spotLight1.penumbra = 0.2;
spotLight1.decay = 2;
spotLight1.distance = 0;

const spotLight2 = new THREE.SpotLight( 0xFFFFFF, 150);
spotLight2.position.set( -4, 3, -5 );
spotLight2.angle = Math.PI / 1.5; // apertura del cono luce
spotLight2.penumbra = 0.2;
spotLight2.decay = 2;
spotLight2.distance = 0;

const spotLight3 = new THREE.SpotLight( 0xFFFFFF, 150);
spotLight3.position.set( 4, -3, -5 );
spotLight3.angle = Math.PI / 1.5; // apertura del cono luce
spotLight3.penumbra = 0.2;
spotLight3.decay = 2;
spotLight3.distance = 0;

const spotLight4 = new THREE.SpotLight( 0xFFFFFF, 150);
spotLight4.position.set( -4, -3, -5 );
spotLight4.angle = Math.PI / 1.5; // apertura del cono luce
spotLight4.penumbra = 0.2;
spotLight4.decay = 2;
spotLight4.distance = 0;

const frontLight = new THREE.PointLight( 0xFFFFFF, 100, 250);
frontLight.position.set(0,0,-3);

camera.add( spotLight1 );
camera.add( spotLight2 );
camera.add( spotLight3 );
camera.add( spotLight4 );
camera.add( frontLight );

// Master Cube
const masterCubeGeo = new THREE.BoxGeometry(3, 3, 3);
const masterCubeMat = new THREE.MeshLambertMaterial({color: 0xffffff, transparent: true, opacity: 0.0})
const masterCubeMesh = new THREE.Mesh(masterCubeGeo, masterCubeMat);
masterCubeMesh.position.y = 0;
scene.add(masterCubeMesh);

var raycaster2 = new THREE.Raycaster();
var mouse = new THREE.Vector2();
//var targetMesh
function onMouseClick( event ) {
    raycaster2.setFromCamera( mouse, camera );
    var isIntersected = raycaster2.intersectObject( masterCubeMesh );
    if (isIntersected) {
        console.log('Mesh clicked!')
    }
}
function onMouseMove( event ) {
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}
window.addEventListener( 'mouseclick', onMouseClick, false );
window.addEventListener( 'mousemove', onMouseMove, false );

function createCube(color){
  const meshGeometry = new THREE.BoxGeometry(1, 1, 1);
  const meshMaterial = new THREE.MeshPhongMaterial({color: color});  
  const mesh = new THREE.Mesh(meshGeometry, meshMaterial);
  const obj = new THREE.Object3D();
  obj.add(mesh);

/*
  const wireMat = new THREE.MeshBasicMaterial({
    //color: 0xffffff,
    color: 'white',
    wireframe: true
  });
  const wireMesh = new THREE.Mesh(meshGeometry, wireMat);
  wireMesh.scale.setScalar(1.001);
  mesh.add(wireMesh);
*/
  return {mesh, obj}
}

function getRandomColor()
{
  let color = new THREE.Color("#" + Math.floor(Math.random() * 16777215).toString(16));

  //console.log(color);

  return color;
}

function fillMasterCube(){
    
  listInnerCubes.forEach(function(innerCube){

    const cube = createCube(0x000000);

    cube.mesh.position.x = innerCube.x;
    cube.mesh.position.y = innerCube.y;
    cube.mesh.position.z = innerCube.z;

    masterCubeMesh.add(cube.obj);
  });
}

fillMasterCube();


const wireMat = new THREE.MeshBasicMaterial({
  //color: 0xffffff,
  color: 'cyan',
  wireframe: true
});
const wireMesh = new THREE.Mesh(masterCubeGeo, wireMat);
wireMesh.scale.setScalar(1.001);
//masterCubeMesh.add(wireMesh);

/*
masterCubeMesh.children.forEach(function(cube){
  console.log(cube);

});*/

// Controls
const controls = new TrackballControls(camera, renderer.domElement);

controls.noPan = true;
controls.maxDistance = controls.minDistance = 0;  
controls.noKeys = true;
controls.noRotate = false;
controls.noZoom = true;

controls.addEventListener('change', () => {
  masterCubeMesh.position.copy(controls.target.clone());
});

// Helper
/*
const gridHelper = new THREE.GridHelper(12, 12);
scene.add(gridHelper);
*/

// ANIMATIONS CONTROLS / EVENT LISTNERS
const raycaster = new THREE.Raycaster();
//const mouse = new THREE.Vector2();
let intersects = []
let hovered = {}

// EVENT LISTENERS
window.addEventListener("resize", onWindowResize);

window.addEventListener('pointermove', (e) => {

  mouse.set((e.clientX / options.width) * 2 - 1, -(e.clientY / options.height) * 2 + 1);
  raycaster.setFromCamera(mouse, camera);
  intersects = raycaster.intersectObjects(scene.children, true);
  console.log(intersects);
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
masterCubeMesh.children.forEach(function(cube){
  console.log(cube.obj);
  //cube.mesh.rotation.y = t;
  
});
// Loop
var t = 0;
function animate(){
  requestAnimationFrame( animate );
  controls.update();
  renderer.render(scene, camera);

  t += 0.05;

  /*
  masterCubeMesh.rotation.x += 0.008;
  masterCubeMesh.rotation.z += 0.008;
  masterCubeMesh.rotation.z += 0.008;*/
}
animate();

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}
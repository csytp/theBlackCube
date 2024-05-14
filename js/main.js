import './../css/style.css';
import * as THREE from 'three';
import { OrbitControls, BoxLineGeometry, FontLoader, TTFLoader, TextGeometry,TrackballControls} from 'three/examples/jsm/Addons.js';
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
/*const*/ camera = new THREE.PerspectiveCamera(50, options.width / options.height, 1, 1000 );
camera.position.set( 0, 0, -10 );


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
//const planeRoof = new THREE.Mesh( new THREE.PlaneGeometry( 20, 10 ), material );
const planeRoof = new THREE.Mesh( new THREE.PlaneGeometry( 20, 25 ), material );
/*
const lightPanel1 = new THREE.PointLight( 0xFFFFFF, 50, 50);
lightPanel1.position.set(0, 0, 5);
planeFrontWall.add( lightPanel1 );*/

const lightPanel2 = new THREE.PointLight( 0xFFFFFF, 100, 100);
lightPanel2.position.set(-2, 3, 7);
planeSideWallLeft.add( lightPanel2 );


const lightPanel3 = new THREE.PointLight( 0xFFFFFF, 100, 100);
lightPanel3.position.set(2, 3, 7);
planeSideWallRight.add( lightPanel3 );

const lightPanel4 = new THREE.PointLight( 0xFFFFFF, 100, 100);
//lightPanel4.position.set(5, 7, 3);
lightPanel4.position.set(0,0,-1);
planeRoof.add( lightPanel4 );


const pointLightHelper = new THREE.PointLightHelper( lightPanel4 );
scene.add( pointLightHelper );

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
//scene.add(room);

//TEXT

// Master Cube
const masterCubeGeo = new THREE.BoxGeometry(3, 3, 3);
const masterCubeMat = new THREE.MeshLambertMaterial({color: 0xffffff, transparent: true, opacity: 0.0})
const masterCubeMesh = new THREE.Mesh(masterCubeGeo, masterCubeMat);
masterCubeMesh.position.y = 0;
scene.add(masterCubeMesh);

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

// Lights
/*
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.z = 10;
directionalLight.position.x = 10;
directionalLight.position.y = 10;
masterCubeMesh.add(directionalLight);
*//*
lightProbe = new THREE.LightProbe();
//lightProbe.add( masterCubeMesh );
*/
/*
const ambientLight = new THREE.AmbientLight(0xffffff);
room.add(ambientLight);
*/

const light = new THREE.PointLight( 0xFFFFFF, 100, 18);
light.position.set(0,0,0);
camera.add( light );

// Controls
const controls = new TrackballControls(camera, renderer.domElement);
controls.enableDamping = true;
//controls.dampingFactor = 0.5;
//controls.target = new THREE.Vector3( 0, 1, 1.8 );
/*
controls.minDistance = 20;
controls.maxDistance = 1000;
*/
/*
controls.minPolarAngle = 0; // radians
controls.maxPolarAngle = Math.PI; // radians
controls.minAzimuthAngle = - Infinity; // radians
controls.maxAzimuthAngle = Infinity;
*/
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
const mouse = new THREE.Vector2();
let intersects = []
let hovered = {}

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

// Loop

function animate(){
  requestAnimationFrame( animate );
  controls.update();
  renderer.render(scene, camera);

  masterCubeMesh.rotation.x += 0.008;
  masterCubeMesh.rotation.z += 0.008;
  masterCubeMesh.rotation.z += 0.008;

}
animate();

function onWindowResize() {
/*
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );*/
}
import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import { BoxLineGeometry } from 'three/examples/jsm/Addons.js';

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

// Options
const options = {
  width: window.innerWidth,
  height: window.innerHeight
}

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color( 0xffffff );

// Render
const renderer = new THREE.WebGLRenderer({alpha: true});
renderer.setSize(options.width, options.height);
renderer.setPixelRatio(2);
document.body.appendChild(renderer.domElement);

// Camera
const camera = new THREE.PerspectiveCamera(50, options.width / options.height, 1, 1000 );
camera.position.z = -10;
camera.position.y = 2;

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// Objects
// ROOM

const room = new THREE.LineSegments(
  new BoxLineGeometry( 20, 10, 25, 100, 100, 100 ).translate( 0, 0, 0 ),
  new THREE.LineBasicMaterial( { color: 0x808080 } )
);
scene.add( room );

// Master Cube
const masterCubeGeo = new THREE.BoxGeometry(3, 3, 3);
const masterCubeMat = new THREE.MeshLambertMaterial({color: 0xffffff, transparent: true, opacity: 0.0})
const masterCubeMesh = new THREE.Mesh(masterCubeGeo, masterCubeMat);
masterCubeMesh.position.y = 0;

function createCube(color){
  const meshGeometry = new THREE.BoxGeometry(1, 1, 1);
  const meshMaterial = new THREE.MeshStandardMaterial({color: color});  
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

    const cube = createCube(getRandomColor());

    cube.mesh.position.x = innerCube.x;
    cube.mesh.position.y = innerCube.y;
    cube.mesh.position.z = innerCube.z;

    masterCubeMesh.add(cube.obj);
  });
}

fillMasterCube();
scene.add(masterCubeMesh);


const wireMat = new THREE.MeshBasicMaterial({
  //color: 0xffffff,
  color: 'cyan',
  wireframe: true
});
const wireMesh = new THREE.Mesh(masterCubeGeo, wireMat);
wireMesh.scale.setScalar(1.001);
masterCubeMesh.add(wireMesh);


masterCubeMesh.children.forEach(function(cube){
  console.log(cube);

});

// Lights
/*
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.z = 10;
directionalLight.position.x = 10;
directionalLight.position.y = 10;
scene.add(directionalLight)
*/

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(ambientLight);
//renderer.render(scene, camera);

// Loop
function animate(){
  requestAnimationFrame( animate );
  
  controls.update();
  renderer.render(scene, camera);

  masterCubeMesh.rotation.x +=0.01;
  masterCubeMesh.rotation.y +=0.02;
  masterCubeMesh.rotation.z +=0.008;

  /*
  cube2.mesh.rotation.x += 0.01;
  cube3.mesh.rotation.x += 0.01;
  
  cubeObj.rotation.y += 0.01;
  //cubeObj.position.y += -0.01;
  cubeObj2.rotation.x += -0.01;
  cubeObj2.rotation.y += -0.01;*/
  /*
  masterCubeMesh.children.forEach(function(cube){
    //console.log(cube);
    cube.material.color.set(getRandomColor());
  
  });*/
  
}
animate();
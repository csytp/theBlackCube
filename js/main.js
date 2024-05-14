import './../css/style.css';
import * as THREE from 'three';
import { OrbitControls, BoxLineGeometry, FontLoader, TTFLoader, TextGeometry,TrackballControls} from 'three/examples/jsm/Addons.js';
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/Addons.js';

import * as M1 from './module1.js'
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


let camera, scene, renderer, labelRenderer;

// Options
const options = {
  width: window.innerWidth,
  height: window.innerHeight
}

// Clock
const clock = new THREE.Clock();

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


// Objects

// Room
const room = new THREE.LineSegments(
  new BoxLineGeometry( 20, 10, 25, 100, 100, 100 ).translate( 0, 0, 0 ),
  new THREE.LineBasicMaterial( { color: 0x808080 } )
);
room.rotation.set(0, 0, 0);
room.position.set( 0, 0, - 10 );
//scene.add( room );


//Room Walls
//const geometry = new THREE.PlaneGeometry( 20, 10 );
const material = new THREE.MeshBasicMaterial( {color: 0xffff33, side: THREE.DoubleSide} );

const planeFrontWall = new THREE.Mesh( new THREE.PlaneGeometry( 20, 10 ), material );

const planeSideWallLeft = new THREE.Mesh( new THREE.PlaneGeometry( 25, 10 ), material );
const planeSideWallRight = new THREE.Mesh( new THREE.PlaneGeometry( 25, 10 ), material );

const planeFloor = new THREE.Mesh( new THREE.PlaneGeometry( 20, 25 ), new THREE.MeshBasicMaterial( {color: 'red', side: THREE.DoubleSide} ) );
const planeRoof = new THREE.Mesh( new THREE.PlaneGeometry( 20, 10 ), material );

planeFrontWall.position.z = -12.4;

planeSideWallLeft.position.x = -9.9;
planeSideWallLeft.position.z = 0;
planeSideWallLeft.rotation.y = 1.5708; // 90° rotation

planeSideWallRight.position.x = 9.9;
planeSideWallRight.position.z = 0;
planeSideWallRight.rotation.y = -1.5708; // -90° rotation

planeFloor.position.x = 0;
planeFloor.position.y = -4.9;
planeFloor.rotation.x = -1.5708; // -90° rotation


room.add( planeFrontWall );
room.add( planeSideWallLeft );
room.add( planeSideWallRight );
room.add( planeFloor );
//room.add( planeRoof );

// FIX ROOM (and rotate only the mastercube)
scene.add( camera ); // required when the camera has a child
camera.add( room );

//TEXT

/*const*/

labelRenderer = new CSS2DRenderer();
labelRenderer.setSize( window.innerWidth, window.innerHeight );
labelRenderer.domElement.style.position = 'absolute';
labelRenderer.domElement.style.top = '0px';
document.body.appendChild( labelRenderer.domElement );


const fontName = 'abel-regular.ttf';
const fontLoader = new FontLoader();
const ttfLoader = new TTFLoader();
const lineText = new THREE.Object3D();
ttfLoader.load(fontName, (json) => {
  const jsonFont = fontLoader.parse(json);
  
  const textGeometry = new TextGeometry('hola!', {
    //height: 2,
    size: 1,
    font: jsonFont
  });
  const textMaterial = new THREE.MeshNormalMaterial();
  const textMesh = new THREE.Mesh(textGeometry, textMaterial);
  textMesh.position.x = 5;
  textMesh.position.y = 0;

  //scene.add(textMesh);
  

  const color = 0x000;

  const matDark = new THREE.LineBasicMaterial( {
    color: color,
    side: THREE.DoubleSide
  } );

  const matLite = new THREE.MeshBasicMaterial( {
    color: color,
    transparent: true,
    opacity: 1,
    side: THREE.DoubleSide
  } );

  const message = M1.getExampleText();  //get text

  const shapes = jsonFont.generateShapes( message, 0.33 );

  const geometry = new THREE.ShapeGeometry( shapes );

  geometry.computeBoundingBox();

  const xMid = - 0.5 * ( geometry.boundingBox.max.x - geometry.boundingBox.min.x );

  geometry.translate( xMid, 0, 0 );

  // make shape ( N.B. edge view not visible )

  const text = new THREE.Mesh( geometry, matLite );
  text.position.z = 0.15;
  text.position.x = 0;
  planeFrontWall.add( text );

  // make line shape ( N.B. edge view remains visible )
  /*
  const holeShapes = [];

  for ( let i = 0; i < shapes.length; i ++ ) {

    const shape = shapes[ i ];

    if ( shape.holes && shape.holes.length > 0 ) {

      for ( let j = 0; j < shape.holes.length; j ++ ) {

        const hole = shape.holes[ j ];
        holeShapes.push( hole );

      }

    }

  }

  shapes.push.apply( shapes, holeShapes );

  const lineText = new THREE.Object3D();

  for ( let i = 0; i < shapes.length; i ++ ) {

    const shape = shapes[ i ];

    const points = shape.getPoints();
    const geometry = new THREE.BufferGeometry().setFromPoints( points );

    geometry.translate( xMid, 0, 0 );

    const lineMesh = new THREE.Line( geometry, matDark );
    lineText.add( lineMesh );

  }  
  planeFrontWall.add( lineText );*/
});

lineText.position.x = -5;
lineText.position.y = -2;
lineText.position.z = 2;

// Master Cube
const masterCubeGeo = new THREE.BoxGeometry(3, 3, 3);
const masterCubeMat = new THREE.MeshLambertMaterial({color: 0xffffff, transparent: true, opacity: 0.0})
const masterCubeMesh = new THREE.Mesh(masterCubeGeo, masterCubeMat);
masterCubeMesh.position.y = 0;
scene.add(masterCubeMesh);




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
scene.add(directionalLight)
*/

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(ambientLight);

// Controls
const controls = new TrackballControls(camera, labelRenderer.domElement);
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
/*
  masterCubeMesh.rotation.x += 0.01;
  masterCubeMesh.rotation.z += 0.02;
  masterCubeMesh.rotation.z += 0.008;*/

}
animate();

function onWindowResize() {
/*
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );*/
}
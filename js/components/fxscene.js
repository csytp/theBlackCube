import * as THREE from "three";

class FxScene {
  constructor(sketch, backgroundColor) {
    this.sketch = sketch;
    //this.settings = { ...settings };

    this.camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.1, 100 );
    this.camera.position.z = 20;

    // Setup scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color( backgroundColor );
    this.scene.add( new THREE.AmbientLight( 0xaaaaaa, 3 ) );

    /*
    this.light = new THREE.DirectionalLight( 0xffffff, 3 );
    this.light.position.set( 0, 1, 4 );
    this.scene.add( this.light );
*/
    //this.rotationSpeed = rotationSpeed;
/*
    const color = geometry.type === 'BoxGeometry' ? 0x0000ff : 0xff0000;
    const material = new THREE.MeshPhongMaterial( { color: color, flatShading: true } );
    const mesh = generateInstancedMesh( geometry, material, 500 );
    scene.add( mesh );
*/
    /*this.scene = scene;
    this.camera = camera;*/
    // this.mesh = mesh;

    this.update = function ( delta ) {
/*
        if ( params.sceneAnimate ) {

            mesh.rotation.x += this.rotationSpeed.x * delta;
            mesh.rotation.y += this.rotationSpeed.y * delta;
            mesh.rotation.z += this.rotationSpeed.z * delta;

        }
*/
    };

    this.resize = function () {

        this.sketch.camera.aspect = window.innerWidth / window.innerHeight;
        this.sketch.camera.updateProjectionMatrix();

    };

    //return this.scene;
  }
}
export default FxScene;

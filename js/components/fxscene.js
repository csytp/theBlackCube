import * as THREE from "three";

// import Controls from "./../components/controls";


class FxScene {
  constructor(sketch, backgroundColor, activated) {
    this.sketch = sketch;
    this.delta = this.sketch.clock.getDelta();
    this.activated = activated;

    // Camera
    this.camera = new THREE.PerspectiveCamera(
      50,
      this.sketch.sizes.width / this.sketch.sizes.height,
      0.1,
      15000
    );
    this.camera.position.z = 20;

    // Scene
    this.scene = new THREE.Scene();
    this.scene.background = backgroundColor;

    //console.log(this.scene);

    //Controls
    //this.controls = new Controls(this.sketch, this.camera, this.sketch.renderer, this.scene.uuid);


    //console.log(document.body);
    
    // this.controls.movementSpeed = 2500;


    //
    this.sketch.animator.add( () => this.update( this.delta ) );

    //return this.scene;
  }
  update( delta ) {

  }
}
export default FxScene;

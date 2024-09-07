import * as THREE from "three";

import Events from "./events";
// import Controls from "./../components/controls";

class FxScene {
  constructor(sketch, backgroundColor, activated = false) {
    this.sketch = sketch;
    this.delta = this.sketch.clock.getDelta();
    this.activated = activated;

    this.paramsFxScene = {
      sceneAnimate: false,
      transitionAnimate: true,
      transition: 0,
      useTexture: true,
      texture: 5,
      cycle: true,
      threshold: 0.1,
    };

    //Events
    this.events = new Events(this);

    // Camera
    this.setupCamera();
    // this.camera = new THREE.PerspectiveCamera(
    //   50,
    //   this.sketch.sizes.width / this.sketch.sizes.height,
    //   0.1,
    //   15000
    // );
    // this.camera.position.z = 20;

    // Scene
    this.scene = new THREE.Scene();
    this.scene.background = backgroundColor;

    this.sketch.animator.add(() => this.update(this.delta));

    //return this.scene;
  }
  update(delta) {}

  setupCamera() {
    // Camera
    this.camera = new THREE.PerspectiveCamera(
      50,
      this.sketch.sizes.width / this.sketch.sizes.height,
      0.1,
      15000
    );
    this.camera.position.z = 20;
  }
}
export default FxScene;

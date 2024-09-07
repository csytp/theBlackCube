import * as THREE from "three";

import FxSceneEvents from "./fxscene_events.js";
// import Controls from "./../components/controls";

class FxScene {
  constructor(sketch, backgroundColor, visible = false) {
    this.sketch = sketch;
    this.delta = this.sketch.clock.getDelta();
    this.visible = visible;

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
    this.setupEvents();

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

  setupEvents() {
    this.events = new FxSceneEvents(this);
  }
}
export default FxScene;

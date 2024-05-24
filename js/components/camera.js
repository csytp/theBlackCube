import * as THREE from "three";

class Camera {
  constructor(sketch, settings) {
    this.sketch = sketch;
    this.settings = { ...settings };

    this.camera = new THREE.PerspectiveCamera(
      50,
      this.sketch.sizes.width / this.sketch.sizes.height,
      1,
      1000
    );
    this.camera.position.set( 0, 0, -10 );

    //console.log(this.sketch.scene.position);
    this.camera.lookAt(this.sketch.scene.position);

    //this.sketch.scene.add(this.camera);

    return this.camera;
  }
}
export default Camera;

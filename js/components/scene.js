import * as THREE from "three";

class Scene {
  constructor(sketch, color) {
    this.sketch = sketch;
    //this.settings = { ...settings };

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(color);

    return this.scene;
  }
}
export default Scene;

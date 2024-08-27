import * as THREE from "three";

class Renderer {
  constructor(sketch) {
    this.sketch = sketch;
    /*
    this.settings = { ...settings };
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(this.sketch.sizes.width, this.sketch.sizes.height);
    this.renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.physicallyCorrectLights = true;
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    */

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.domElement.setAttribute("id", "canvas");
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.sketch.sizes.width, this.sketch.sizes.height);

    this.renderer.update = this.update.bind(this.sketch);

    return this.renderer;
  }
  update() {
    //this.renderer.render(this.fxsceneA, this.camera);

    //console.log('transition',sketch.paramsFxScene.transition);

    //this.renderer.render( sketch.fxSceneB.scene, sketch.fxSceneB.camera );

    // Prevent render both scenes when it's not necessary
    if (sketch.paramsFxScene.transition === 0) {
      this.renderer.render(sketch.fxSceneA.scene, sketch.fxSceneA.camera);
    } else if (sketch.paramsFxScene.transition === 1) {
      this.renderer.render(sketch.fxSceneB.scene, sketch.fxSceneB.camera);
    } else {
      // When 0 < transition < 1 render transition between two scenes
      sketch.composer.render();
    }
  }
}
export default Renderer;

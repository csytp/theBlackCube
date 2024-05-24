import * as THREE from "three";
import { TrackballControls } from "three/examples/jsm/Addons.js";

class Controls {
  constructor(sketch, settings) {
    this.sketch = sketch;
    this.settings = { /* ...settings */ };

    this.controls = new TrackballControls(
      this.sketch.camera,
      this.sketch.renderer.domElement
    );
/*
    this.controls.noPan = true;
    this.controls.maxDistance = this.controls.minDistance = 0;  
    this.controls.noKeys = true;
    this.controls.noZoom = true;
    this.controls.noRotate = false;
*/
    /* this.controls.rotateSpeed = 5.0;
    this.controls.zoomSpeed = 5;
    this.controls.panSpeed = 2;

    this.controls.noZoom = false;
    this.controls.noPan = false;

    this.controls.staticMoving = false;
    this.controls.dynamicDampingFactor = 0.3;
     */
    //this.controls.target.set( 0,0,0);
    //this.controls.update = this.update.bind(this.sketch);

    return this.controls;
  }
}
export default Controls;

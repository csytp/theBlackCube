import * as THREE from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { FlyControls } from "three/addons/controls/FlyControls.js";

class Controls {
  constructor(sketch, camera, renderer, uuid_scene) {
    this.sketch = sketch;
    this.delta = this.sketch.clock.getDelta();

    //console.log('uuid', uuid_scene);

    this.controls = new FlyControls(camera, renderer.domElement);

    this.controls.enabled = true;

    //console.log(document.body);

    this.controls.movementSpeed = 2500;
    this.controls.dragToLook = true;
    //this.controls.domElement =renderer.domElement;
    /*
    this.controls.rollSpeed = Math.PI / 6;
    this.controls.autoForward = false;
    this.controls.dragToLook = false;

    console.log(this.controls);

    this.sketch.animator.add( () => this.controls.update( this.delta ) );
*/
    return this.controls;
  }
  update(delta) {}
}
export default Controls;

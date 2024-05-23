
import * as THREE from "three";

export default class Cube {
  constructor(sketch, val) {
    this.sketch = sketch;
    this.val = val;
    this.geometry = new THREE.BoxGeometry(1, 1, 1);
    this.material = new THREE.MeshPhongMaterial({color: 0x000000});  
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    /*
    this.obj = new THREE.Object3D();
    this.obj.add(this.mesh);
    */
    if(this.val == true)
      this.sketch.animator.tasks.push(()=>{
        //this.mesh.rotation.y = Date.now()*0.001;
        // this.mesh.rotation.z = Date.now()*0.001;
      });


    return this.mesh;
  }

}

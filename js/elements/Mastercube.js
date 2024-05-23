import * as THREE from "three";
import Cube from "./Cube.js";


export default class Mastercube {
  constructor(sketch) {

    this.sketch = sketch;

    this.innerCubes = [];

    this.listInnerCubes = [
      //1st level
      {x:-1, y:-1, z:1, val: false},
      {x:-1, y:-1, z:0, val: false},
      {x:-1, y:-1, z:-1, val: true},
      
      {x:0, y:-1, z:1, val: false},
      {x:0, y:-1, z:0, val: false},
      {x:0, y:-1, z:-1, val: false},
      
      {x:1, y:-1, z:1, val: false},
      {x:1, y:-1, z:0, val: false},
      {x:1, y:-1, z:-1, val: false},
      
      //2nd level
      {x:-1, y:0, z:1, val: false},
      {x:-1, y:0, z:0, val: false},
      {x:-1, y:0, z:-1, val: false},
      
      {x:0, y:0, z:1, val: false},
      {x:0, y:0, z:0, val: false},
      {x:0, y:0, z:-1, val: false},
      
      {x:1, y:0, z:1, val: false},
      {x:1, y:0, z:0, val: false},
      {x:1, y:0, z:-1, val: false},
      
      //3rd level
      {x:-1, y:1, z:1, val: false},
      {x:-1, y:1, z:0, val: false},
      {x:-1, y:1, z:-1, val: false},
      
      {x:0, y:1, z:1, val: false},
      {x:0, y:1, z:0, val: false},
      {x:0, y:1, z:-1, val: true},
      
      {x:1, y:1, z:1, val: false},
      {x:1, y:1, z:0, val: false},
      {x:1, y:1, z:-1, val: true}
    ];

    this.geometry = new THREE.BoxGeometry(3, 3, 3);
    this.material = new THREE.MeshLambertMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.0
    })
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.position.y = 0;
    /* this.obj = new THREE.Object3D();
    this.obj.add(this.mesh);
 */
    this.sketch.scene.add(this.mesh);

    // let ii=0;
    this.listInnerCubes.forEach((innerCube)=>{
      // if(ii % 2.5)
        this.addCube(innerCube.x, innerCube.y, innerCube.z, innerCube.val);
      
      /* ii++;
      console.log(ii); */
    });

    this.innerCubes.forEach((c)=>{
        this.fillMasterCube(c);
    });
/* 
    this.sketch.animator.add(() => {
      this.mesh.rotation.y = Math.sin(Date.now()*0.01);
      this.mesh.rotation.x = Math.sin(Date.now()*0.01);
      //this.mesh.rotation.y += 0.03;
    }); */

    
    return this.mesh;
  }
  addCube(x, y, z, val){      
    const cube = new Cube(this.sketch, val);

    cube.position.x = x;
    cube.position.y = y;
    cube.position.z = z;

    this.innerCubes.push(cube);
  }
  fillMasterCube(c){
    this.mesh.add(c);
  }
  
}
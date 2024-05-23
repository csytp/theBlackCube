import * as THREE from "three";
/*
var lightsList = {
  spotLight1.position.set( 4, 3, -5 );
  spotLight1.angle = Math.PI / 1.5; // apertura del cono luce
  spotLight1.penumbra = 0.2;
  spotLight1.decay = 2;
  spotLight1.distance = 0;

  spotLight2 = new THREE.SpotLight( 0xFFFFFF, 150);
  spotLight2.position.set( -4, 3, -5 );
  spotLight2.angle = Math.PI / 1.5; // apertura del cono luce
  spotLight2.penumbra = 0.2;
  spotLight2.decay = 2;
  spotLight2.distance = 0;
  spotLight3 = new THREE.SpotLight( 0xFFFFFF, 150);
  spotLight3.position.set( 4, -3, -5 );
  spotLight3.angle = Math.PI / 1.5; // apertura del cono luce
  spotLight3.penumbra = 0.2;
  spotLight3.decay = 2;
  spotLight3.distance = 0;
  spotLight4 = new THREE.SpotLight( 0xFFFFFF, 150);
  spotLight4.position.set( -4, -3, -5 );
  spotLight4.angle = Math.PI / 1.5; // apertura del cono luce
  spotLight4.penumbra = 0.2;
  spotLight4.decay = 2;
  spotLight4.distance = 0;

}
*/
class Lights {
  constructor(sketch, settings) {
    this.sketch = sketch;
    this.settings = { ...settings };

    this.spotLight1 = new THREE.SpotLight( 0xFFFFFF, 150);
    this.spotLight1.position.set( 4, 3, -5 );
    this.spotLight1.angle = Math.PI / 1.5; // apertura del cono luce
    this.spotLight1.penumbra = 0.2;
    this.spotLight1.decay = 2;
    this.spotLight1.distance = 0;

    this.spotLight2 = new THREE.SpotLight( 0xFFFFFF, 150);
    this.spotLight2.position.set( -4, 3, -5 );
    this.spotLight2.angle = Math.PI / 1.5; // apertura del cono luce
    this.spotLight2.penumbra = 0.2;
    this.spotLight2.decay = 2;
    this.spotLight2.distance = 0;

    this.spotLight3 = new THREE.SpotLight( 0xFFFFFF, 150);
    this.spotLight3.position.set( 4, -3, -5 );
    this.spotLight3.angle = Math.PI / 1.5; // apertura del cono luce
    this.spotLight3.penumbra = 0.2;
    this.spotLight3.decay = 2;
    this.spotLight3.distance = 0;

    this.spotLight4 = new THREE.SpotLight( 0xFFFFFF, 150);
    this.spotLight4.position.set( -4, -3, -5 );
    this.spotLight4.angle = Math.PI / 1.5; // apertura del cono luce
    this.spotLight4.penumbra = 0.2;
    this.spotLight4.decay = 2;
    this.spotLight4.distance = 0;

    this.frontLight = new THREE.PointLight( 0xFFFFFF, 100, 250);
    this.frontLight.position.set(0,0,-3);

    this.sketch.scene.add(this.spotLight1);
    this.sketch.scene.add(this.spotLight2);
    this.sketch.scene.add(this.spotLight3);
    this.sketch.scene.add(this.spotLight4);
    this.sketch.scene.add(this.frontLight);

    /*
    this.ambient();
    this.directional(3);
    this.directional(-3);*/
  }
  /*
  ambient() {
    let ambLight = new THREE.AmbientLight(0xffffff, 1, 100);
    this.sketch.scene.add(ambLight);
  }
  directional(x) {
    let dirLight = new THREE.DirectionalLight(0xffffff, 1, 100);
    dirLight.position.set(x, 5, 3);
    this.sketch.scene.add(dirLight);
  }*/
  
}
export default Lights;

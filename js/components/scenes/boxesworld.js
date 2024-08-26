import * as THREE from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { FlyControls } from 'three/addons/controls/FlyControls.js';
import { Lensflare, LensflareElement } from "three/addons/objects/Lensflare.js";

import FxScene from "../fxscene.js";


class BoxesWorld extends FxScene {
  constructor(sketch) {
    super(
      sketch,
      new THREE.Color().setHSL(0.51, 0.4, 0.01, THREE.SRGBColorSpace),
      false
    );

    this.rotationSpeed = new THREE.Vector3(0, -0.4, 0);

    // Camera
    this.camera.fov = 40;
    this.camera.near = 1;
    //this.camera.far = 15000;
    this.camera.position.z = 250;

    // Scene
    this.scene.fog = new THREE.Fog(this.scene.background, 3500, 15000);

    const s = 250;

    const geometry = new THREE.BoxGeometry(s, s, s);
    const material = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      specular: 0xffffff,
      shininess: 50,
    });

    for (let i = 0; i < 3000; i++) {
      const mesh = new THREE.Mesh(geometry, material);

      mesh.position.x = 8000 * (2.0 * Math.random() - 1.0);
      mesh.position.y = 8000 * (2.0 * Math.random() - 1.0);
      mesh.position.z = 8000 * (2.0 * Math.random() - 1.0);

      mesh.rotation.x = Math.random() * Math.PI;
      mesh.rotation.y = Math.random() * Math.PI;
      mesh.rotation.z = Math.random() * Math.PI;

      mesh.matrixAutoUpdate = false;
      mesh.updateMatrix();

      this.scene.add(mesh);
    }

    // lights

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.15);
    dirLight.position.set(0, -1, 0).normalize();
    dirLight.color.setHSL(0.1, 0.7, 0.5);
    this.scene.add( dirLight );

    // lensflares
    const textureLoader = new THREE.TextureLoader();

    this.textureFlare0 = textureLoader.load(
      "../../textures/lensflare/lensflare0.png"
    );
    this.textureFlare3 = textureLoader.load(
      "../../textures/lensflare/lensflare3.png"
    );

    this.addLight(0.55, 0.9, 0.5, 5000, 0, -1000);
    this.addLight(0.08, 0.8, 0.5, 0, 0, -1000);
    this.addLight(0.995, 0.5, 0.9, 5000, 5000, -1000);
    console.log(this.sketch);
    //Controls
    this.controls = new FlyControls(
      this.camera,
      this.sketch.renderer.domElement
    );

    
    this.controls.movementSpeed = 2500;
    this.controls.domElement = this.sketch.renderer.domElement;
    this.controls.rollSpeed = Math.PI / 6;
    this.controls.autoForward = false;
    this.controls.dragToLook = false;

    //return this.scene;
  }
  update(delta) {
    this.controls.update(delta*10);
    //console.log('UPDATE', this.sketch.paramsFxScene.sceneAnimate);
    if (this.sketch.paramsFxScene.sceneAnimate) {
      // this.scene.rotation.x += this.rotationSpeed.x * delta;
      this.scene.rotation.y += this.rotationSpeed.y * delta * 10;
      // this.scene.rotation.z += this.rotationSpeed.z * delta;
    }
  }
  addLight(h, s, l, x, y, z) {
    const light = new THREE.PointLight(0xffffff, 1.5, 2000, 0);
    light.color.setHSL(h, s, l);
    light.position.set(x, y, z);
    this.scene.add(light);

    const lensflare = new Lensflare();
    lensflare.addElement(
      new LensflareElement(this.textureFlare0, 700, 0, light.color)
    );
    lensflare.addElement(new LensflareElement(this.textureFlare3, 60, 0.6));
    lensflare.addElement(new LensflareElement(this.textureFlare3, 70, 0.7));
    lensflare.addElement(new LensflareElement(this.textureFlare3, 120, 0.9));
    lensflare.addElement(new LensflareElement(this.textureFlare3, 70, 1));
    light.add(lensflare);
  }
}
export default BoxesWorld;

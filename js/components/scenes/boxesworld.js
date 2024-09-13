import * as THREE from "three";

import { OrbitControls } from "three/examples/jsm/Addons.js";
import { TrackballControls } from "three/examples/jsm/Addons.js";
// import { FlyControls } from "three/addons/controls/FlyControls.js";
import { Lensflare, LensflareElement } from "three/addons/objects/Lensflare.js";

import FxScene from "../fxscene.js";

class BoxesWorld extends FxScene {
  constructor(sketch) {
    super(
      sketch,
      new THREE.Color().setHSL(0.51, 0.4, 0.01, THREE.SRGBColorSpace),
      false
    );

    this.cubesArray = [];
    this.cubesgrp = new THREE.Group();
    this.scene.add(this.cubesgrp);

    // Scene
    this.scene.fog = new THREE.Fog(this.scene.background, 3500, 15000);
    this.scene.rotation.y = 1.5 * Math.PI;

    // Camera
    // 7886.111626631097, y: 308.4017021410537, z: -4600.391119593611
    this.camera.position.set(7886, 308, -4600.39);
    // this.camera.position.set(5000, 0, -1000); // ok - luce blue
    // this.camera.position.set(0, 0, -1000); // OK  - luce gialla
    // this.camera.position.set(5000, 5000, -1000); // OK - luce bianca

    this.camera.lookAt(this.scene.position);
    this.scene.add(this.camera);

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

      this.cubesgrp.add(mesh);
      // this.cubesArray.push(mesh);
    }

    // Lights

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.15);
    dirLight.position.set(0, -1, 0).normalize();
    dirLight.color.setHSL(0.1, 0.7, 0.5);
    this.scene.add(dirLight);

    // Lensflares
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

    //Controls
    this.controls = new OrbitControls(
      this.camera,
      this.sketch.renderer.domElement
    );
    this.controls.enabled = true;
    this.controls.rotateSpeed = 1;
    this.controls.zoomSpeed = 1;
    this.controls.noPan = true;

    this.initCube();

    console.log(this.scene);
  }
  update(delta) {
    this.controls.update(delta);

    for (let i = 0; i < this.cubesgrp.children.length; i++) {
      this.cubesgrp.children[i].position.x += 100;
      // console.log(this.cubesgrp.children[i].position.x);
      // this.cubesgrp.children[i].getAttribute("position").needsUpdate = true;

      // this.scene.rotation.x += 0.00001;
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

    //console.log(light.position);
  }
  initTextures(sketch) {
    const loader = new THREE.TextureLoader();

    for (let i = 0; i < 6; i++) {
      sketch.texturesFxScene[i] = loader.load(
        "./textures/transitions/transition" + (i + 1) + ".png"
      );
    }
  }

  initCube() {
    const geometry = new THREE.BoxGeometry(10, 10, 10);
    const material = new THREE.MeshBasicMaterial({ color: 0xffffff });

    this.cube = new THREE.Mesh(geometry, material);
    this.cube.position.set(this.camera.position.x,this.camera.position.y,this.camera.position.z);

    this.cube.position.set(7886, 308, -4600.39);
    this.scene.add(this.cube);
  }
  initEvents() {
    const $this = this;
    this.eventsArray = [
      {
        on: "change",
        element: this.controls,
        event: (e) => {
          // this.mouse.set(
          //   (e.clientX / this.sketch.sizes.width) * 2 - 1,
          //   -(e.clientY / this.sketch.sizes.height) * 2 + 1);

          console.log(this.camera.position);
        },
      },
    ];

    this.eventsArray.forEach((objEvent) => {
      objEvent.element.addEventListener(objEvent.on, objEvent.event);
    });
  }

  removeEvents() {
    this.eventsArray.forEach((e) => {
      e.element.removeEventListener(e.on, e.event);
    });
  }

  enableControls(flag) {
    // -> linked to Face Recognition
    if (flag === true || flag === false) this.controls.enabled = flag;

    console.log(this.controls.enabled);

    if (flag === false) {
      if (this.sketch.fxSceneA.visible === true) {
        this.sketch.fxSceneA.controls.reset();
      } else if ($this.sketch.fxSceneB.visible === true) {
        this.sketch.fxSceneB.controls.reset();
      }
    }
  }
}
export default BoxesWorld;

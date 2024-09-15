import * as THREE from "three";

import { OrbitControls } from "three/examples/jsm/Addons.js";
import { TrackballControls } from "three/examples/jsm/Addons.js";
// import { FlyControls } from "three/addons/controls/FlyControls.js";
import { Lensflare, LensflareElement } from "three/addons/objects/Lensflare.js";

import FxScene from "../fxscene.js";

import { gsap } from "gsap";

class BoxesWorld extends FxScene {
  constructor(sketch) {
    super(
      sketch,
      new THREE.Color().setHSL(0.51, 0.4, 0.01, THREE.SRGBColorSpace),
      false
    );

    // Mouse
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.intersects = [];
    this.hovered = {};

    this.cubesArray = [];
    this.cubesgrp = new THREE.Group();
    this.scene.add(this.cubesgrp);

    // Scene
    this.scene.fog = new THREE.Fog(this.scene.background, 3500, 15000);
    this.scene.rotation.y = 1.5 * Math.PI;

    // Cameras
    this.camera1 = this.camera;
    this.camera2 = new THREE.OrthographicCamera(
      this.sketch.sizes.width / -2,
      this.sketch.sizes.width / 2,
      this.sketch.sizes.height / 2,
      this.sketch.sizes.height / -2,
      1,
      15000
    );
    this.lookAtPosition = { x: 0, y: 0, z: 0 };
    this.scene.add(this.camera1);
    this.scene.add(this.camera2);

    const s = 250;

    const geometry = new THREE.BoxGeometry(s, s, s);
    const material = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      specular: 0xffffff,
      shininess: 100,
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

    this.addLight(0.55, 0.9, 0.5, 5000, 0, -1000);
    this.addLight(0.08, 0.8, 0.5, 0, 0, -1000);
    this.addLight(0.995, 0.5, 0.9, 5000, 5000, -1000);

    //Controls
    this.controls = new TrackballControls(
      this.camera1,
      this.sketch.renderer.domElement
    );
    this.controls.enabled = true;
    this.controls.rotateSpeed = 1;
    this.controls.zoomSpeed = 1;
    this.controls.noPan = true;
    this.controls.minDistance = -2.5;
    this.controls.maxDistance = 16393;

    //this.initCube();

    //Set camera
    // inquadrature
    this.cameraShots = [
      //Lontana
      { x: 7106.287968341558, y: 1691.1148224695248, z: 13663.693284260788 },
      // - Luce blu
      { x: 8366.434176961759, y: -222.3651995605373, z: 704.963879595055 },
      // - Luce gialla
      { x: 1348.2002668331943, y: 149.81932063733052, z: 1168.0375768908686 },
      // - Luce bianca
      { x: 8888.39699061364, y: 8806.610664274955, z: 1329.933494315267 },
    ];

    this.camera1.position.set(
      this.cameraShots[0].x,
      this.cameraShots[0].y,
      this.cameraShots[0].z
    );

    this.taskAnimationScene = [];
    this.animationsScene = [
      {
        name: "rotation-dx",
        fn: (inc) => {
          this.cubesgrp.rotation.y += inc;
        },
      },
      {
        name: "rotation-sx",
        fn: (inc) => {
          this.cubesgrp.rotation.y += -inc;
        },
      },
      {
        name: "rotation-btm",
        fn: (inc) => {
          this.cubesgrp.rotation.x += inc;
        },
      },
      {
        name: "rotation-top",
        fn: (inc) => {
          this.cubesgrp.rotation.x += -inc;
        },
      },
      {
        name: "rotation-z",
        fn: (inc) => {
          this.cubesgrp.rotation.z += inc;
        },
      },
      {
        name: "rotation-z2",
        fn: (inc) => {
          this.cubesgrp.rotation.z += -inc;
        },
      },
    ];
    this.tl = gsap.timeline(); // GSAP Timeline

    this.initEvents();
  }
  update(delta) {
    this.controls.update(delta);
    this.camera1.lookAt(
      this.lookAtPosition.x,
      this.lookAtPosition.y,
      this.lookAtPosition.z
    );
    this.taskAnimationScene.forEach((task) => task(delta));
  }
  addLight(h, s, l, x, y, z) {
    this.light = new THREE.PointLight(0xffffff, 1.5, 2000, 0);
    this.light.color.setHSL(h, s, l);
    this.light.position.set(x, y, z);
    this.scene.add(this.light);

    // Lensflares
    const textureLoader = new THREE.TextureLoader();

    const textureFlare0 = textureLoader.load(
      "./../../../public/textures/lensflare0.png"
    );
    const textureFlare3 = textureLoader.load(
      "./../../../public/textures/lensflare3.png"
    );

    this.lensflare = new Lensflare();
    this.lensflare.addElement(
      new LensflareElement(textureFlare0, 700, 0, this.light.color)
    );
    this.lensflare.addElement(new LensflareElement(textureFlare3, 60, 0.6));
    this.lensflare.addElement(new LensflareElement(textureFlare3, 70, 0.7));
    this.lensflare.addElement(new LensflareElement(textureFlare3, 120, 0.9));
    this.lensflare.addElement(new LensflareElement(textureFlare3, 70, 1));
    this.light.add(this.lensflare);

    //console.log(light.position);
  }
  initTextures(sketch) {
    const loader = new THREE.TextureLoader();

    for (let i = 0; i < 6; i++) {
      sketch.texturesFxScene[i] = loader.load(
        "./../../../public/textures/transitions/transition" + (i + 1) + ".png"
      );
    }
  }
  initCube() {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0xffffff });

    this.cube = new THREE.Mesh(geometry, material);

    this.cube.position.set(0, 0, 0);
    this.scene.add(this.cube);

    function getRandomColor() {
      let r = Math.floor(Math.random() * 255);
      let g = Math.floor(Math.random() * 255);
      let b = Math.floor(Math.random() * 255);
      //let color = new THREE.Color("rgb("+r+"%, "+g+"%, "+b+"%)");
      let color = new THREE.Color("rgb(" + r + ", " + g + ", " + b + ")");

      return color;
    }

    setInterval(() => {
      material.color = getRandomColor();
    }, 400);
  }
  changeShots(shot_position) {
    const animProp = {
      x: shot_position.x,
      y: shot_position.y,
      z: shot_position.z,
      duration: 2,
      ease: "power3-out",
    };

    this.tl.to(this.camera1.position, animProp);
    this.tl.play();
    // this.lookAtPosition = shot_position;
  }
  addAnimationTask(task) {
    this.taskAnimationScene.pop();
    this.taskAnimationScene.push(task);
  }
  mouseIntersections(e) {
    this.mouse.set(
      (e.clientX / this.sketch.sizes.width) * 2 - 1,
      -(e.clientY / this.sketch.sizes.height) * 2 + 1
    );

    //console.log(this.cube);
    this.raycaster.setFromCamera(this.mouse, this.camera);
    //intersects = raycaster.intersectObjects(scene.children, true);
    this.intersects = this.raycaster.intersectObjects(this.cube, true);
    //console.log(this.intersects);
    /*
      Object.keys(hovered).forEach((key) => {
        const hit = intersects.find((hit) => hit.object.uuid === key)
        if (hit === undefined) {
          const hoveredItem = hovered[key]
          if (hoveredItem.object.onPointerOver) hoveredItem.object.onPointerOut(hoveredItem)
          delete hovered[key]
        }
      });*/
    //});
  }
  initEvents() {
    const $this = this;

    this.eventsArray = [
      {
        on: "change",
        element: this.controls,
        event: (e) => {
          console.log(this.camera1.position);
          // this.mouse.set(
          //   (e.clientX / this.sketch.sizes.width) * 2 - 1,
          //   -(e.clientY / this.sketch.sizes.height) * 2 + 1);
        },
      },
      {
        on: "mousemove",
        element: document,
        event: (e) => {
          //$this.mouseIntersections(e);
        },
      },
      {
        on: "keydown",
        element: document,
        event: (e) => {
          const keyName = e.key;

          if (keyName === "0") {
            let l = $this.cameraShots.length - 1;
            l = parseInt(Math.random() * l);
            $this.changeShots($this.cameraShots[l]);
          }
          if (keyName === "1") {
            let l = $this.animationsScene.length - 1;
            l = parseInt(Math.random() * l);
            $this.addAnimationTask($this.animationsScene[l].fn);
          }
        },
      },
    ];

    let j = 0;
    this.eventsArray.forEach((objEvent) => {
      objEvent.element.addEventListener(objEvent.on, objEvent.event);
      console.log(objEvent);
      j++;
    });
    console.log('Scena 3 array event', j);
  }

  removeEvents() {
    this.eventsArray.forEach((e) => {
      e.element.removeEventListener(e.on, e.event);
    });
  }

  enableControls(flag) {
    // -> linked to Face Recognition
    if (flag === true || flag === false) this.controls.enabled = flag;

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

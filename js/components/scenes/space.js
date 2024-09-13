import * as THREE from "three";
import FxScene from "../fxscene.js";
import { TrackballControls } from "three/examples/jsm/Addons.js";
import { ParallaxBarrierEffect } from "three/examples/jsm/Addons.js";

import { gsap } from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";

// import vertexShader from "./pippo/vertex.txt";
import vertexShader from "./shaders/vertex.glsl";
import fragmentShader from "./shaders/fragment.glsl";
import srcStarMap from "../../../img/star.png";

import spaceTexture from "../../../public/img/space.jpg";

class SpaceScene extends FxScene {
  constructor(sketch, starsCount) {
    super(sketch, new THREE.Color(0x000000), false);

    //GSAP
    this.setupGSAP();
    this.myTween = [];

    this.mouseX = 0;
    this.mouseY = 0;

    this.pos = 0;
    this.pa = 0;
    this.vel = 0;
    this.va = 0;

    this.scene.add(new THREE.AmbientLight(0xaaaaaa, 3));

    this.camera.position.set(0, 0, -20);
    this.camera.lookAt(0, 0, 0);

    // Controls
    this.controls = new TrackballControls(
      this.camera,
      this.sketch.renderer.domElement
    );
    this.controls.enabled = true;
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.5;
    this.controls.noPan = true;
    this.controls.autoRotate = true;
    this.controls.minDistance = 5;
    this.controls.maxDistance = 3000;

    // Objects
    this.space = this.cube = this.ico = {};
    this.starsCount = starsCount;

    // Mouse
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.intersects = [];
    this.hovered = {};

    this.initSpace();
    this.init2DCube();
    // this.initIcosahedron();
    this.initAnimations();
    this.initRaycaster();

    // this.effect = new ParallaxBarrierEffect(this.sketch.renderer);
    // this.effect.setSize(this.sketch.sizes.width, this.sketch.sizes.height);

    // this.camera.lookAt(this.ico.position);
    // console.log(this.ico.material.uniforms.uTime);
    // return this.scene;

    this.initEvents();
  }
  update(delta) {
    this.controls.update(delta);
    // this.effect.render(this.scene, this.camera);

    //On Mouse Move
    // this.camera.position.x += (this.mouseX - this.camera.position.x) * 0.005;
    // this.camera.position.y += (-this.mouseY - this.camera.position.y) * 0.005;

    const timing = this.sketch.clock.getElapsedTime() / 10;
    // this.ico.material.uniforms.uTime = { value: timing };

    for (let point_index = 0; point_index < this.starsCount; point_index++) {
      this.va[2 * point_index] += -0.0025;
      this.va[2 * point_index + 1] += -0.0025;

      this.pa[6 * point_index + 2] += this.va[2 * point_index];
      this.pa[6 * point_index + 5] += this.va[2 * point_index + 1];

      if (this.pa[6 * point_index + 5] < -250) {
        let z = Math.random() * 400 - 200;

        this.pa[6 * point_index + 2] = z;
        this.pa[6 * point_index + 5] = z;
        this.va[2 * point_index] = this.va[6 * point_index + 1] = 0;
      }
    }
    this.starGeo.getAttribute("position").needsUpdate = true;

    //this.camera.lookAt( this.scene.position );

    return delta;
  }
  setupGSAP() {
    //gsap.registerPlugin(ScrollTrigger);
    // ScrollTrigger.refresh(true);
    // ScrollTrigger.create({
    //   start: 0,
    //   end: "max",
    // });
  }
  initSpace() {
    this.starGeo = new THREE.BufferGeometry();
    this.starGeo.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(6 * this.starsCount), 3)
    );
    this.starGeo.setAttribute(
      "velocity",
      new THREE.BufferAttribute(new Float32Array(2 * this.starsCount), 1)
    );
    this.pos = this.starGeo.getAttribute("position");
    this.pa = this.pos.array;
    this.vel = this.starGeo.getAttribute("velocity");
    this.va = this.vel.array;

    for (let point_index = 0; point_index < this.starsCount; point_index++) {
      //points (stars) coordinates
      let x = Math.random() * 400 - 200;
      let y = Math.random() * 400 - 200;
      let z = Math.random() * 400 - 200;
      let xx = x;
      let yy = y;
      let zz = z;

      //point start
      this.pa[6 * point_index] = x;
      this.pa[6 * point_index + 1] = y;
      this.pa[6 * point_index + 2] = z;
      //point end
      this.pa[6 * point_index + 3] = xx;
      this.pa[6 * point_index + 4] = yy;
      this.pa[6 * point_index + 5] = zz;

      this.va[2 * point_index] = this.va[2 * point_index + 1] = 0;
    }

    const starTextureLoader = new THREE.TextureLoader();
    const starTexture = starTextureLoader.load(srcStarMap);
    const starMaterial = new THREE.PointsMaterial({
      color: 0xaaaaaa,
      size: 0.5,
      map: starTexture,
      sizeAttenuation: true,
    });

    this.stars = new THREE.Points(this.starGeo, starMaterial);
    this.scene.add(this.stars);
  }
  init2DCube() {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshStandardMaterial({ color: 0x3471eb });

    this.cube = new THREE.Mesh(geometry, material);
    this.scene.add(this.cube);
  }
  initCube() {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshStandardMaterial({ color: 0x3471eb });

    this.cube = new THREE.Mesh(geometry, material);
    this.scene.add(this.cube);
  }
  initIcosahedron() {
    const geometry = new THREE.IcosahedronGeometry(1, 100);
    // const geometry = new THREE.SphereGeometry(1);
    // console.log(geometry.attributes);
    const material = new THREE.ShaderMaterial({
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
    });

    material.uniforms.uTime = { value: 0 };
    // material.uniforms.uRadius = { value: 0.1 };
    // material.uniforms.uTexture = { value: new THREE.TextureLoader().load(spaceTexture) };

    this.ico = new THREE.Mesh(geometry, material);
    // console.log(this.ico);
    this.scene.add(this.ico);

    this.ico.rotation.y = Math.PI;
  }
  initAnimations() {
    /*
    this.sketch.animator.add(
      // () => (this.stars.rotation.y = Date.now() * 0.0001), //Space rotation
      // () => (this.cube.rotation.y = -(Date.now() * 0.01)) //Cube rotation
    );*/
  }
  initRaycaster() {
    // EVENT LISTENERS

    // console.log(this.mouse);

    this.raycaster.setFromCamera(this.mouse, this.camera);
    //intersects = raycaster.intersectObjects(scene.children, true);
    this.intersects = this.raycaster.intersectObjects(this.cube, true);

    // console.log(this.intersects);
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

    // window.addEventListener("resize", onWindowResize);
    //window.addEventListener("click", this.onMouseClick, false);
  }

  initEvents(cam) {
    const $this = this;

    const animCubeRotationY = {
      duration: 1,
      delay: 0,
      repeat: 0,
      ease: "sine",
      y: (360 * Math.PI) / 180,
      onStart: function () {
        console.log("start cube rotation");
      },
      onComplete: function () {
        $this.myTween.shift().kill();
        console.log("cube rotation done!");
        $this.cube.rotation.set(0, 0, 0);
      },
    };

    const animCameraRotationY = {
      duration: 1,
      delay: 0,
      repeat: 0,
      ease: "sine",
      y: Math.PI * 0.25,
      onStart: function () {
        console.log("start camera rotation");
      },
      onComplete: function () {
        $this.myTween.shift().kill();
        console.log("camera rotation done!");
        // $this.cube.rotation.set(0, 0, 0);
      },
    };

    const tl = gsap.timeline();

    this.eventsArray = [
      {
        on: "change",
        element: this.controls,
        event: (e) => {
          // console.log(this.camera.position);
        },
      },
      {
        on: "mousemove",
        element: document,
        event: (e) => {
          // this.mouse.set(
          //   (e.clientX / this.sketch.sizes.width) * 2 - 1,
          //   -(e.clientY / this.sketch.sizes.height) * 2 + 1);
          // $this.mouseX = (e.clientX - $this.sketch.sizes.width) / 4;
          // $this.mouseY = (e.clientY - $this.sketch.sizes.height) / 4;
        },
      },
      {
        on: "click",
        element: document,
        event: (e) => {
          // this.camera.position.z = -100;
          tl.to(this.camera.position, {
            z: -100,
            duration: 1,
            ease: "power3.out",
            onUpdate: () => {
              this.camera.lookAt(0, 0, 0);
            },
          });
          tl.to(this.camera.position, {
            z: -20,
            y: 10,
            duration: 1,
            ease: "power3.out",
            onUpdate: () => {
              this.camera.lookAt(0, 0, 0);
            },
          });
          tl.to(this.camera.position, {
            z: -5,
            y: 5,
            x: 30,
            duration: 1,
            ease: "power3.out",
            onUpdate: () => {
              this.camera.lookAt(0, 0, 0);
            },
          });

          // gsap.to(
          //   {},
          //   {
          //     duration: 2,
          //     onUpdate: function () {
          //       // $this.camera.quaternion
          //       //   .copy(startOrientation)
          //       //   .slerp(targetOrientation, this.progress());
          //     },
          //   }
          // );

          // this.myTween.push(gsap.to(this.camera.rotation, animCameraRotationY));
          // this.myTween.push(gsap.to(this.cube.rotation, animCubeRotationY));
        },
      },
      {
        on: "mouseup",
        element: document,
        event: (e) => {},
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
export default SpaceScene;

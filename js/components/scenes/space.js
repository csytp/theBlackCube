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
    this.taskAnimationCube = [];

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
    this.initCube();
    this.initAnimations();

    this.animationsCube = [
      {
        name: "rotation-dx",
        fn: (inc) => {
          this.cube.rotation.y += inc;
        },
      },
      {
        name: "rotation-sx",
        fn: (inc) => {
          this.cube.rotation.y += -inc;
        },
      },
      {
        name: "rotation-btm",
        fn: (inc) => {
          this.cube.rotation.x += inc;
        },
      },
      {
        name: "rotation-top",
        fn: (inc) => {
          this.cube.rotation.x += -inc;
        },
      },
      {
        name: "rotation-z",
        fn: (inc) => {
          this.cube.rotation.z += inc;
        },
      },
      {
        name: "rotation-z2",
        fn: (inc) => {
          this.cube.rotation.z += -inc;
        },
      },
    ];

    // this.effect = new ParallaxBarrierEffect(this.sketch.renderer);
    // this.effect.setSize(this.sketch.sizes.width, this.sketch.sizes.height);

    // this.camera.lookAt(this.ico.position);
    // console.log(this.ico.material.uniforms.uTime);
    // return this.scene;

    this.initEvents();
  }
  update(delta) {
    this.controls.update(delta);
    this.taskAnimationCube.forEach((task) => task(delta));

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

  initCube() {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshStandardMaterial({ color: 0x3471eb });

    this.cube = new THREE.Mesh(geometry, material);
    this.scene.add(this.cube);

    function getRandomColor() {
      let r = Math.floor(Math.random() * 255);
      let g = Math.floor(Math.random() * 255);
      let b = Math.floor(Math.random() * 255);
      //let color = new THREE.Color("rgb("+r+"%, "+g+"%, "+b+"%)");
      let color = new THREE.Color("rgb(" + r + ", " + g + ", " + b + ")");

      return color;
    }

    function changeCubeColor(color) {
      gsap.to(material.color, {
        r: color.r,
        g: color.g,
        b: color.b,
        duration: Math.random(),
      });
    }

    setInterval(() => {
      changeCubeColor(getRandomColor());
      //console.log('cambio');
    }, 2000);
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
  mouseIntersections(e) {
    this.mouse.set(
      (e.clientX / this.sketch.sizes.width) * 2 - 1,
      -(e.clientY / this.sketch.sizes.height) * 2 + 1
    );

    this.raycaster.setFromCamera(this.mouse, this.camera);
    //intersects = raycaster.intersectObjects(scene.children, true);
    this.intersects = this.raycaster.intersectObjects(this.cube, false);
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
  }

  addAnimationTask(task) {
    this.taskAnimationCube.pop();
    this.taskAnimationCube.push(task);
  }

  initEvents() {
    const $this = this;

    //let indexTaskAnimationCube = 0;

    const animCubeRotationY = {
      duration: 1,
      delay: 0,
      repeat: 0,
      ease: "sine",
      y: (360 * Math.PI) / 180,
      onStart: function () {
        // console.log("start cube rotation");
      },
      onComplete: function () {
        $this.myTween.shift().kill();
        // console.log("cube rotation done!");
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
        // console.log("start camera rotation");
      },
      onComplete: function () {
        $this.myTween.shift().kill();
        // console.log("camera rotation done!");
        // $this.cube.rotation.set(0, 0, 0);
      },
    };

    const tl1 = gsap.timeline();
    const tl2 = gsap.timeline();
    const rangeCameraMov = 20;
    const durCameraMov = 0.8;

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
          $this.mouseIntersections(e);
        },
      },
      {
        on: "keydown",
        element: document,
        event: (e) => {
          const keyName = e.key;

          if (keyName === "0") {
            const dir = Math.random() > 0.5 ? 1 : -1;
            const x1 = dir * Math.random() * rangeCameraMov;
            const x2 = dir * Math.random() * rangeCameraMov;
            const x3 = dir * Math.random() * rangeCameraMov;
            const y1 = dir * Math.random() * rangeCameraMov;
            const y2 = dir * Math.random() * rangeCameraMov;
            const y3 = dir * Math.random() * rangeCameraMov;
            const z1 = dir * Math.random() * rangeCameraMov;
            const z2 = dir * Math.random() * rangeCameraMov;
            const z3 = dir * Math.random() * rangeCameraMov;

            tl1.to(this.camera.position, {
              x: x1,
              y: y1,
              z: z1,
              duration: durCameraMov,
              ease: "power3.out",
              onUpdate: () => {
                this.camera.lookAt(0, 0, 0);
              },
            });
            tl1.to(this.camera.position, {
              x: x2,
              y: y2,
              z: z2,
              duration: durCameraMov,
              ease: "power3.out",
              onUpdate: () => {
                this.camera.lookAt(0, 0, 0);
              },
            });
            tl1.to(this.camera.position, {
              x: x3,
              y: y3,
              z: z3,
              duration: durCameraMov,
              ease: "power3.out",
              onUpdate: () => {
                this.camera.lookAt(0, 0, 0);
              },
            });
          }

          if (keyName === "1") {
            $this.addAnimationTask(
              $this.animationsCube[parseInt(Math.random() * 5)].fn
            );
          }
          if (keyName === "2") {
            tl2.to(this.cube.position, {
              x: this.cube.position.x + (10 * Math.random() - 5),
              y: this.cube.position.y + (10 * Math.random() - 5),
              z: this.cube.position.z + (10 * Math.random() - 5),
              duration: 0.5,
              ease: "elastic",
              onComplete: () => {
                tl2.to(this.cube.position, {
                  x: 0,
                  y: 0,
                  z: 0,
                  duration: 0.3,
                  ease: "elastic",
                });
              },
            });
          }
        },
      },
      {
        on: "mouseup",
        element: document,
        event: (e) => {},
      },
    ];

    let j = 0;
    this.eventsArray.forEach((objEvent) => {
      objEvent.element.addEventListener(objEvent.on, objEvent.event);
      console.log(objEvent);
      j++;
    });
    console.log('Scena 2 array event', j);

  }

  removeEvents() {
    this.eventsArray.forEach((e) => {
      e.element.removeEventListener(e.on, e.event);
    });
  }

  enableControls(flag) {
    // -> linked to Face Recognition
    if (flag === true || flag === false) this.controls.enabled = flag;

    // console.log(this.controls.enabled);

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

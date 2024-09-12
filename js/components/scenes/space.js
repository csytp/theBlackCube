import * as THREE from "three";
import FxScene from "../fxscene.js";
import { TrackballControls } from "three/examples/jsm/Addons.js";

// import vertexShader from "./pippo/vertex.txt";
import vertexShader from "./shaders/vertex.glsl";
import fragmentShader from "./shaders/fragment.glsl";
import srcStarMap from "../../../img/star.png";

import spaceTexture from "../../../public/img/space.jpg";

class SpaceScene extends FxScene {
  constructor(sketch, starsCount) {
    super(sketch, new THREE.Color(0x000000), false);

    this.scene.add(new THREE.AmbientLight(0xaaaaaa, 3));

    this.camera.position.set(0, 0, -2);

    // Controls
    this.controls = new TrackballControls(
      this.camera,
      this.sketch.renderer.domElement
    );
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.noPan = true;
    this.controls.minDistance = 2;
    this.controls.maxDistance = 20;

    // Objects
    this.space = this.cube = this.ico = {};
    this.starsCount = starsCount;

    // Mouse
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.intersects = [];
    this.hovered = {};

    this.initSpace();
    // this.initCube();
    this.initIcosahedron();
    this.initAnimations();
    this.initRaycaster();

    this.camera.lookAt(this.ico.position);
    // console.log(this.ico.material.uniforms.uTime);
    // return this.scene;
  }
  update(delta) {
    this.controls.update(delta);
    const timing = this.sketch.clock.getElapsedTime() / 10;

    this.ico.material.uniforms.uTime = { value: timing };
    return delta;
  }
  initSpace() {
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(6 * this.starsCount), 3)
    );
    starGeo.setAttribute(
      "velocity",
      new THREE.BufferAttribute(new Float32Array(2 * this.starsCount), 1)
    );
    let pos = starGeo.getAttribute("position");
    let pa = pos.array;
    let vel = starGeo.getAttribute("velocity");
    let va = vel.array;

    for (let point_index = 0; point_index < this.starsCount; point_index++) {
      //points (stars) coordinates
      let x = Math.random() * 400 - 200;
      let y = Math.random() * 400 - 200;
      let z = Math.random() * 400 - 200;
      let xx = x;
      let yy = y;
      let zz = z;

      //point start
      pa[6 * point_index] = x;
      pa[6 * point_index + 1] = y;
      pa[6 * point_index + 2] = z;
      //point end
      pa[6 * point_index + 3] = xx;
      pa[6 * point_index + 4] = yy;
      pa[6 * point_index + 5] = zz;

      va[2 * point_index] = va[2 * point_index + 1] = 0;
    }

    const starTextureLoader = new THREE.TextureLoader();
    const starTexture = starTextureLoader.load(srcStarMap);
    const starMaterial = new THREE.PointsMaterial({
      color: 0xaaaaaa,
      size: 0.5,
      map: starTexture,
      sizeAttenuation: true,
    });

    this.stars = new THREE.Points(starGeo, starMaterial);
    this.scene.add(this.stars);
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

    material.uniforms.uTime = { value: 0};
    // material.uniforms.uRadius = { value: 0.1 };
    // material.uniforms.uTexture = { value: new THREE.TextureLoader().load(spaceTexture) };
    
    this.ico = new THREE.Mesh(geometry, material);
    console.log(this.ico);
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
    window.addEventListener("pointermove", (e) => {
      this.mouse.set(
        (e.clientX / this.sketch.sizes.width) * 2 - 1,
        -(e.clientY / this.sketch.sizes.height) * 2 + 1
      );

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
    });

    // window.addEventListener("resize", onWindowResize);
    //window.addEventListener("click", this.onMouseClick, false);
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

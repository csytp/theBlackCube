import * as THREE from "three";
import FxScene from "../fxscene.js";
import { OrbitControls } from "three/examples/jsm/Addons.js";

// import vertexShader from "./pippo/vertex.txt";
import vertexShader from "./shaders/vertex.glsl";
import fragmentShader from "./shaders/fragment.glsl";
import srcStarMap from "../../../img/star.png";

class SpaceScene extends FxScene {
  constructor(sketch, starsCount) {
    super(sketch, new THREE.Color(0x000000), false);

    this.scene.add(new THREE.AmbientLight(0xaaaaaa, 3));

    // this.camera.near = ;
    this.camera.position.set(0, 0, -5);
    
    // Controls
    this.controls = new OrbitControls(
      this.camera,
      this.sketch.renderer.domElement
    );
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;

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

    // return this.scene;
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
    const geometry = new THREE.IcosahedronGeometry(1, 5);
    const material = new THREE.ShaderMaterial({
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
    });
    this.ico = new THREE.Mesh(geometry, material);
    this.scene.add(this.ico);
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
}
export default SpaceScene;

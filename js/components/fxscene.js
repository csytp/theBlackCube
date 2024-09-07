import * as THREE from "three";

import FxSceneEvents from "./fxscene_events.js";
// import Controls from "./../components/controls";

class FxScene {
  constructor(sketch, backgroundColor, visible = false) {
    this.sketch = sketch;
    this.delta = this.sketch.clock.getDelta();
    this.visible = visible;

    this.paramsFxScene = {
      sceneAnimate: false,
      transitionAnimate: true,
      transition: 0,
      useTexture: true,
      texture: 5,
      cycle: true,
      threshold: 0.1,
    };

    //Events
    this.setupEvents();

    // Camera
    this.setupCamera();
    // this.camera = new THREE.PerspectiveCamera(
    //   50,
    //   this.sketch.sizes.width / this.sketch.sizes.height,
    //   0.1,
    //   15000
    // );
    // this.camera.position.z = 20;

    // Scene
    this.scene = new THREE.Scene();
    this.scene.background = backgroundColor;

    this.sketch.animator.add(() => this.update(this.delta));

    this.createFace();

    //return this.scene;
  }
  update(delta) {}

  setupCamera() {
    // Camera
    this.camera = new THREE.PerspectiveCamera(
      50,
      this.sketch.sizes.width / this.sketch.sizes.height,
      0.1,
      15000
    );
    this.camera.position.z = 20;
  }

  setupEvents() {
    this.events = new FxSceneEvents(this);
  }

  createFace() {
    let $this = this;
    new THREE.BufferGeometryLoader().load(
      "./models/json/WaltHeadLo_buffergeometry.json",
      function (geometry) {
        geometry.deleteAttribute("normal");
        geometry.deleteAttribute("uv");

        $this.setupAttributes(geometry);

        // left

        const material1 = new THREE.MeshBasicMaterial({
          color: 0xe0e0ff,
          wireframe: true,
        });

        const mesh1 = new THREE.Mesh(geometry, material1);
        mesh1.position.set(0, 0, 0);

        console.log(mesh1);

        $this.scene.add(mesh1);

        // right
/*
        const material2 = new THREE.ShaderMaterial({
          uniforms: { thickness: { value: API.thickness } },
          vertexShader: document.getElementById("vertexShader").textContent,
          fragmentShader: document.getElementById("fragmentShader").textContent,
          side: THREE.DoubleSide,
          alphaToCoverage: true, // only works when WebGLRenderer's "antialias" is set to "true"
        });

        mesh2 = new THREE.Mesh(geometry, material2);
        mesh2.position.set(40, 0, 0);
*/
        //scene.add(mesh2);
        //render();
      }
    );
  }

  setupAttributes(geometry) {
    const vectors = [
      new THREE.Vector3(1, 0, 0),
      new THREE.Vector3(0, 1, 0),
      new THREE.Vector3(0, 0, 1),
    ];

    const position = geometry.attributes.position;
    const centers = new Float32Array(position.count * 3);

    for (let i = 0, l = position.count; i < l; i++) {
      vectors[i % 3].toArray(centers, i * 3);
    }

    geometry.setAttribute("center", new THREE.BufferAttribute(centers, 3));
  }
}
export default FxScene;

import * as THREE from "three";

import { FontLoader } from "three/addons/loaders/FontLoader.js";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";

import FxSceneEvents from "./fxscene_events.js";
// import Controls from "./../components/controls";

class FxScene {
  constructor(sketch, backgroundColor, visible = false, n_scene) {
    this.sketch = sketch;
    this.delta = this.sketch.clock.getDelta();
    this.visible = visible;
    this.n_scene = n_scene;

    this.paramsFxScene = {
      sceneAnimate: false,
      transitionAnimate: true,
      transition: 0,
      useTexture: true,
      texture: 5,
      cycle: true,
      threshold: 0.1,
    };

    // Camera
    this.setupCamera();

    // Scene
    this.scene = new THREE.Scene();
    this.scene.background = backgroundColor;

    this.sketch.animator.add(() => this.update(this.delta));

    this.faceGroup = new THREE.Group();
    this.faceGroup.visible = false;
    this.scene.add(this.faceGroup);
    this.createFace();
    this.drawFaceLines();
    this.faceText();
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

    if (this.n_scene == 2) this.camera.position.z = 16393;
    else this.camera.position.z = 20;
  }

  createFace() {
    let $this = this;
    new THREE.BufferGeometryLoader().load(
      "./../../public/models/face.json",

      function (geometry) {
        function setupAttributes(geometry) {
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

          geometry.setAttribute(
            "center",
            new THREE.BufferAttribute(centers, 3)
          );
        }

        geometry.deleteAttribute("normal");
        geometry.deleteAttribute("uv");

        setupAttributes(geometry);

        const material1 = new THREE.MeshBasicMaterial({
          color: 0xe0e0ff,
          wireframe: true,
        });

        $this.faceMesh = new THREE.Mesh(geometry, material1);
        $this.faceMesh.rotation.set(0, Math.PI / 1, 0);
        $this.faceMesh.position.set(0, 0, -2);
        $this.faceMesh.scale.set(0.05, 0.05, 0.05);
        $this.faceMesh.visible = true;

        $this.faceGroup.add($this.faceMesh);
      }
    );
  }

  drawFaceLines() {
    let $this = this;
    function setLine(ppArray) {
      const geometry = new THREE.BufferGeometry().setFromPoints(ppArray);

      const line = new THREE.Line(geometry, material);
      line.position.z = -3.5;

      $this.faceGroup.add(line);
    }

    const material = new THREE.LineBasicMaterial({
      color: 0xeb3434,
      linewidth: 5,
    });
    // material.linewidth = 5;

    const points = [];
    // Left Eye
    points.push(new THREE.Vector3(0.5, 0.15, 0.25));
    points.push(new THREE.Vector3(1, 1, 0));
    // Right Eye
    points.push(new THREE.Vector3(-0.5, 0.15, 0.25));
    points.push(new THREE.Vector3(-1, 1, 0));
    //Left Mouth
    points.push(new THREE.Vector3(-0.1, -0.85, 0.25));
    points.push(new THREE.Vector3(-1, -1, 0));
    //Right Mouth
    points.push(new THREE.Vector3(0.1, -0.85, 0.25));
    points.push(new THREE.Vector3(1, -1, 0));
    //Left Jaw
    points.push(new THREE.Vector3(-0.55, -1.3, 0.8));
    points.push(new THREE.Vector3(-1.3, -0.5, 0));
    //Right Jaw
    points.push(new THREE.Vector3(0.55, -1.3, 0.8));
    points.push(new THREE.Vector3(1.3, -0.5, 0));

    let pp = 0;
    let pointsPair = [];
    points.forEach((point) => {
      if (pp == 2) {
        setLine(pointsPair);
        pp = 0;
        pointsPair = [];
      }

      pointsPair.push(point);
      pp++;
    });
    if (pp != 0 && pointsPair.length > 0) {
      setLine(pointsPair);
      pp = 0;
      pointsPair = [];
    }
  }

  faceText() {
    let group, textMesh1, textGeo, materials;
    let firstLetter = true;

    let text = "eyeRight",
      bevelEnabled = false,
      font = undefined,
      fontName = "gentilis", // helvetiker, optimer, gentilis, droid sans, droid serif
      fontWeight = "regular"; // normal bold

    const depth = 0,
      size = 0.5,
      hover = 1,
      curveSegments = 1,
      bevelThickness = 1,
      bevelSize = 1.5;

    const fontMap = {
      helvetiker: 0,
      optimer: 1,
      gentilis: 2,
      "droid/droid_sans": 3,
      "droid/droid_serif": 4,
    };

    const weightMap = {
      regular: 0,
      bold: 1,
    };

    group = new THREE.Group();
    this.faceGroup.add(group);

    function loadFont() {
      const fontsPath = "../../public/fonts/gentilis_regular.typeface.json";

      const loader = new FontLoader();
      loader.load(
        // fontsPath + fontName + "_" + fontWeight + ".typeface.json",
        fontsPath,
        function (response) {
          font = response;

          refreshText();
        }
      );
    }

    function createText() {
      textGeo = new TextGeometry(text, {
        font: font,

        size: size,
        depth: depth,
        curveSegments: curveSegments,

        bevelThickness: bevelThickness,
        bevelSize: bevelSize,
        bevelEnabled: bevelEnabled,
      });

      textGeo.computeBoundingBox();

      const centerOffset = 0;
      // -0.5 * (textGeo.boundingBox.max.x - textGeo.boundingBox.min.x);

      textMesh1 = new THREE.Mesh(textGeo, materials);

      textMesh1.scale.set(0.2, 0.2, 0.2);

      // textMesh1.position.x = centerOffset;
      // textMesh1.position.y = hover;
      // textMesh1.position.z = 0;
      textMesh1.position.set(-1, 1.1, -3.5);

      // (-1, 1, 0)); left eye
      // (1, 1, 0)); right eye

      // (-1, -1, 0));
      // (1, -1, 0));

      // (-1.3, -0.5, 0
      // (1.3, -0.5, 0)

      // textMesh1.rotation.set(0);
      textMesh1.rotation.y = Math.PI;

      group.add(textMesh1);

      materials = new THREE.MeshPhongMaterial({ color: 0xffffff });
      // materials = [
      //   new THREE.MeshPhongMaterial({ color: 0xffffff, flatShading: true }), // front
      //   new THREE.MeshPhongMaterial({ color: 0xffffff }), // side
      // ];
    }

    function refreshText() {
      group.remove(textMesh1);

      if (!text) return;

      createText();
    }

    loadFont();
    createText();
  }
}
export default FxScene;

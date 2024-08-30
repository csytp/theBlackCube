import * as THREE from "three";
import FxScene from "../fxscene.js";
import { TrackballControls } from "three/examples/jsm/Addons.js";

class Vacuum extends FxScene {
  constructor(sketch, clock) {
    super(sketch, new THREE.Color(0xffffff), true);
    //this.settings = { ...settings };

    /* MOUSE LISTENERS */
    this.raycaster = new THREE.Raycaster();
    this.raycaster2 = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.intersects = [];
    this.hovered = {};

    console.log("clock", clock);
    // Camera
    this.camera.lookAt(this.scene.position);

    // Controls
    this.controls = new TrackballControls(
      this.camera,
      this.sketch.renderer.domElement
    );

    this.controls.maxDistance = 20;
    this.controls.minDistance = 3;

    console.log(this.controls);

    this.cubeArray = [];

    // Inner Cubes List
    this.listInnerCubes = [
      //1st level (basso)
      //(basso-dx)
      {
        x: -1,
        y: -1,
        z: 1,
        val: false,
        bottom_panel: true,
        right_panel: true,
        rear_panel: true,
      },
      { x: -1, y: -1, z: 0, val: false, bottom_panel: true, right_panel: true },
      {
        x: -1,
        y: -1,
        z: -1,
        val: true,
        bottom_panel: true,
        right_panel: true,
        front_panel: true,
      },

      //(basso-centro)
      { x: 0, y: -1, z: 1, val: false, bottom_panel: true, rear_panel: true },
      { x: 0, y: -1, z: 0, val: false, center: true, bottom_panel: true },
      { x: 0, y: -1, z: -1, val: false, bottom_panel: true, front_panel: true },

      //(basso-sx)
      {
        x: 1,
        y: -1,
        z: 1,
        val: false,
        bottom_panel: true,
        left_panel: true,
        rear_panel: true,
      },
      { x: 1, y: -1, z: 0, val: false, bottom_panel: true, left_panel: true },
      {
        x: 1,
        y: -1,
        z: -1,
        val: false,
        bottom_panel: true,
        left_panel: true,
        front_panel: true,
      },

      //2nd level (medio-dx)
      {
        x: -1,
        y: 0,
        z: 1,
        val: false,
        center: false,
        right_panel: true,
        rear_panel: true,
      },
      { x: -1, y: 0, z: 0, val: false, center: false, right_panel: true },
      {
        x: -1,
        y: 0,
        z: -1,
        val: false,
        center: false,
        right_panel: true,
        front_panel: true,
      },
      //(medio-centro)
      { x: 0, y: 0, z: 1, val: false, center: false, rear_panel: true },
      { x: 0, y: 0, z: 0, val: false, center: true },
      { x: 0, y: 0, z: -1, val: false, center: false, front_panel: true },
      //(medio-sx)
      {
        x: 1,
        y: 0,
        z: 1,
        val: false,
        center: false,
        left_panel: true,
        rear_panel: true,
      },
      { x: 1, y: 0, z: 0, val: false, center: false, left_panel: true },
      {
        x: 1,
        y: 0,
        z: -1,
        val: false,
        center: false,
        left_panel: true,
        front_panel: true,
      },

      //3rd level (alto)
      //(alto-dx)
      {
        x: -1,
        y: 1,
        z: 1,
        val: false,
        top_panel: true,
        right_panel: true,
        rear_panel: true,
      },
      { x: -1, y: 1, z: 0, val: false, top_panel: true, right_panel: true },
      {
        x: -1,
        y: 1,
        z: -1,
        val: false,
        top_panel: true,
        right_panel: true,
        front_panel: true,
      },
      //(alto-centro)
      { x: 0, y: 1, z: 1, val: false, top_panel: true, rear_panel: true },
      { x: 0, y: 1, z: 0, val: false, center: true, top_panel: true },
      { x: 0, y: 1, z: -1, val: true, top_panel: true, front_panel: true },
      //(alto-sx)

      {
        x: 1,
        y: 1,
        z: 1,
        val: false,
        top_panel: true,
        left_panel: true,
        rear_panel: true,
      },
      { x: 1, y: 1, z: 0, val: false, top_panel: true, left_panel: true },
      {
        x: 1,
        y: 1,
        z: -1,
        val: true,
        top_panel: true,
        left_panel: true,
        front_panel: true,
      },
    ];

    // InitMasterCube
    this.masterCubeGrp = new THREE.Group();
    this.masterCubeGrp.position.y = 0;
    this.scene.add(this.masterCubeGrp);

    this.initLights();
    // this.initMasterCube();
    this.fillMasterCube(this);
    this.initControls();
    this.initRaycaster();
  }
  update(delta) {
    console.log("vacuum", delta);
    this.controls.update(delta);
  }
  initLights() {
    const spotLight1 = new THREE.SpotLight(0xffffff, 150);
    spotLight1.position.set(4, 3, -5);
    spotLight1.angle = Math.PI / 1.5; // apertura del cono luce
    spotLight1.penumbra = 0.2;
    spotLight1.decay = 2;
    spotLight1.distance = 0;

    const spotLight2 = new THREE.SpotLight(0xffffff, 150);
    spotLight2.position.set(-4, 3, -5);
    spotLight2.angle = Math.PI / 1.5; // apertura del cono luce
    spotLight2.penumbra = 0.2;
    spotLight2.decay = 2;
    spotLight2.distance = 0;

    const spotLight3 = new THREE.SpotLight(0xffffff, 150);
    spotLight3.position.set(4, -3, -5);
    spotLight3.angle = Math.PI / 1.5; // apertura del cono luce
    spotLight3.penumbra = 0.2;
    spotLight3.decay = 2;
    spotLight3.distance = 0;

    const spotLight4 = new THREE.SpotLight(0xffffff, 150);
    spotLight4.position.set(-4, -3, -5);
    spotLight4.angle = Math.PI / 1.5; // apertura del cono luce
    spotLight4.penumbra = 0.2;
    spotLight4.decay = 2;
    spotLight4.distance = 0;

    const frontLight = new THREE.PointLight(0xffffff, 100, 250);
    frontLight.position.set(0, 0, -3);

    this.camera.add(spotLight1);
    this.camera.add(spotLight2);
    this.camera.add(spotLight3);
    this.camera.add(spotLight4);
    this.camera.add(frontLight);
  }
  initControls() {
    // Inizializzazione valori per le interazioni
    // Dipendeza delle variabili da camera e controls
    this.valoreInizialeXRot = this.camera.rotation.x;
    this.valoreFinaleXRot = this.valoreInizialeXRot;
    this.valoreInizialeYRot = this.camera.rotation.y;
    this.valoreFinaleYRot = this.valoreInizialeYRot;
    this.valoreInizialeZRot = this.camera.rotation.z;
    this.valoreFinaleZRot = this.valoreFinaleZRot;
    this.valoreZoomIniziale = this.controls.target.distanceTo(
      this.controls.object.position
    );
    this.valoreZoomFinale = this.valoreZoomIniziale;

    /*
    controls.addEventListener('change',function(){
      readRotationValues();
      readZoomValue();
    });*/
  }
  createCube(
    color,
    val,
    center,
    bottom_panel,
    top_panel,
    left_panel,
    right_panel,
    front_panel,
    rear_panel
  ) {
    const meshGeometry = new THREE.BoxGeometry(1, 1, 1);
    const meshMaterial = new THREE.MeshPhongMaterial({ color: color });
    const mesh = new THREE.Mesh(meshGeometry, meshMaterial);
    //const obj = new THREE.Object3D();
    //obj.add(mesh);

    return {
      mesh,
      val,
      center,
      bottom_panel,
      top_panel,
      left_panel,
      right_panel,
      front_panel,
      rear_panel,
    };
  }

  fillMasterCube(thiz_fxscene) {
    this.listInnerCubes.forEach(function (innerCube) {
      const cube = thiz_fxscene.createCube(
        0x000000,
        innerCube.val,
        innerCube.center,
        innerCube.bottom_panel,
        innerCube.top_panel,
        innerCube.left_panel,
        innerCube.right_panel,
        innerCube.front_panel,
        innerCube.rear_panel
      );
      thiz_fxscene.cubeArray.push(cube);

      cube.mesh.position.x = innerCube.x;
      cube.mesh.position.y = innerCube.y;
      cube.mesh.position.z = innerCube.z;

      thiz_fxscene.masterCubeGrp.add(cube.mesh);
    });
  }
  initRaycaster() {
    // EVENT LISTENERS
    window.addEventListener("pointermove", (e) => {
      this.mouse.set(
        (e.clientX / this.sketch.sizes.width) * 2 - 1,
        -(e.clientY / this.sketch.sizes.height) * 2 + 1
      );
      this.raycaster.setFromCamera(this.mouse, this.camera);
      //intersects = raycaster.intersectObjects(scene.children, true);
      this.intersects = this.raycaster.intersectObjects(
        this.masterCubeGrp.children,
        true
      );
      //console.log(intersects);
      /*
      Object.keys(hovered).forEach((key) => {
        const hit = intersects.find((hit) => hit.object.uuid === key)
        if (hit === undefined) {
          const hoveredItem = hovered[key]
          if (hoveredItem.object.onPointerOver) hoveredItem.object.onPointerOut(hoveredItem)
          delete hovered[key]
        }
      });*/
      // randomCubeAnimation( e );
    });

    // window.addEventListener("resize", onWindowResize);
    window.addEventListener("click", onMouseClick, false);

    function onMouseClick(event) {
      raycaster2.setFromCamera(mouse, camera);
      var isIntersected = raycaster2.intersectObjects(
        masterCubeGrp.children,
        true
      );

      if (isIntersected) {
        console.log("Mesh clicked!");
      }
    }
    /*
    function onMouseMove(event) {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      console.log(mouse.x);
      console.log(mouse.y);
      console.log(event);
      return event;
    }*/
  }
}
export default Vacuum;

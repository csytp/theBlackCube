import * as THREE from "three";
import FxScene from "../fxscene.js";
import {
  BoxLineGeometry,
  OrbitControls,
  TrackballControls,
} from "three/examples/jsm/Addons.js";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

class Vacuum extends FxScene {
  constructor(sketch) {
    super(sketch, new THREE.Color(0xffffff), true);
    //this.settings = { ...settings };

    /* MOUSE LISTENERS */
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.intersects = [];
    this.hovered = {};

    this.masterCubeOpened = false;

    // Camera
    this.camera.position.set(0, 0, -10);
    this.camera.lookAt(this.scene.position);

    this.scene.add(this.camera);

    // Controls
    this.controls = new TrackballControls(
      this.camera,
      this.sketch.renderer.domElement
    );
    this.controls.enabled = true;
    this.controls.rotateSpeed = 1.0;
    this.controls.zoomSpeed = 1.2;
    this.controls.panSpeed = 0.8;

    this.cubeArray = [];
    this.bottom_lim = 1.5;
    this.top_lim = 1.5;
    this.left_lim = 1.5;
    this.right_lim = 1.5;
    this.front_lim = 1.5;
    this.rear_lim = 1.5;

    this.myTween = [];

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
    this.masterCubeGrp.position.x = 0;
    this.masterCubeGrp.position.y = 0;
    this.masterCubeGrp.position.z = 0;
    this.scene.add(this.masterCubeGrp);

    //this.initMasterCube();
    this.fillMasterCube(this);
    this.initLights();
    this.initRoom();
    this.initControls();
    this.initRaycaster();
    this.initEvent();

    // Correggere fluttuazione -> far fluttuare il contenitore del masterCube
    this.sketch.animator.add(
      () =>
        (this.masterCubeGrp.position.y = Math.sin(Date.now() * 0.001) * 0.5),
      () => (this.masterCubeGrp.rotation.y = Math.sin(Date.now() * 0.001) * 0.1)
    );
  }
  update(delta) {
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
  initRoom() {
    // Room
    const room = new THREE.LineSegments(
      new BoxLineGeometry(20, 10, 25, 100, 100, 100).translate(0, 0, 0),
      new THREE.LineBasicMaterial({ color: 0x808080 })
    );
    room.rotation.set(0, Math.PI / 2, 0);
    room.position.set(0, 0, -10);

    //Room Walls
    //const geometry = new THREE.PlaneGeometry( 20, 10 );
    const material = new THREE.MeshLambertMaterial({
      color: 0xf2f4f4,
      side: THREE.DoubleSide,
    });

    const planeFrontWall = new THREE.Mesh(
      new THREE.PlaneGeometry(20, 10),
      material
    );
    const planeBackWall = new THREE.Mesh(
      new THREE.PlaneGeometry(20, 10),
      material
    );

    const planeSideWallLeft = new THREE.Mesh(
      new THREE.PlaneGeometry(25, 10),
      material
    );
    const planeSideWallRight = new THREE.Mesh(
      new THREE.PlaneGeometry(25, 10),
      material
    );

    const planeFloor = new THREE.Mesh(
      new THREE.PlaneGeometry(20, 25),
      material
    );
    const planeRoof = new THREE.Mesh(new THREE.PlaneGeometry(20, 25), material);

    planeFrontWall.position.z = -12.4;
    planeBackWall.position.z = 2;

    planeSideWallLeft.position.x = -9.9;
    planeSideWallLeft.position.z = 0;
    planeSideWallLeft.rotation.y = Math.PI / 2;

    planeSideWallRight.position.x = 9.9;
    planeSideWallRight.position.z = 0;
    planeSideWallRight.rotation.y = -Math.PI / 2;

    planeFloor.position.x = 0;
    planeFloor.position.y = -4.9;
    planeFloor.rotation.x = -Math.PI / 2;

    planeRoof.position.x = 0;
    planeRoof.position.y = 4.9;
    planeRoof.rotation.x = Math.PI / 2;

    room.add(planeFrontWall);
    //room.add( planeBackWall );
    room.add(planeSideWallLeft);
    room.add(planeSideWallRight);
    room.add(planeFloor);
    room.add(planeRoof);

    // this.scene.add(room);
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
      this.randomCubeAnimation(this.myTween, this.masterCubeGrp);
    });

    // window.addEventListener("resize", onWindowResize);
    //window.addEventListener("click", this.onMouseClick, false);
  }
  aperturaMastercube() {
    this.cubeArray.forEach((cube, index) => {
      if (cube.bottom_panel)
        gsap.to(cube.mesh.position, {
          duration: 1,
          y: -this.bottom_lim,
          ease: "none",
        });

      if (cube.top_panel)
        gsap.to(cube.mesh.position, {
          duration: 1,
          y: this.top_lim,
          ease: "none",
        });

      if (cube.left_panel)
        gsap.to(cube.mesh.position, {
          duration: 1,
          x: this.left_lim,
          ease: "none",
        });

      if (cube.right_panel)
        gsap.to(cube.mesh.position, {
          duration: 1,
          x: -this.right_lim,
          ease: "none",
        });

      if (cube.rear_panel)
        gsap.to(cube.mesh.position, {
          duration: 1,
          z: this.rear_lim,
          ease: "none",
        });

      if (cube.front_panel)
        gsap.to(cube.mesh.position, {
          duration: 1,
          z: -this.front_lim,
          ease: "none",
        });
    });
  }
  randomCubeAnimation(myTween, masterCubeGrp) {
    //let bankSelected = Math.round(Math.random() * bankClusterCubes + 1 );

    // Random Cubes Rotation
    let cubeIndex = Math.floor(Math.random() * 26);

    // Rotation Properties
    let myDurationRotation = Math.random() * 3;
    let myDelayRotation = Math.random() * 1.5;
    let myRepeatRotation = Math.floor(Math.random() * 3);
    const degreeRotation = 360;

    let myAxis = ["x", "y", "z"];
    let myAxisIndex = Math.floor(Math.random() * 2);

    let animPropRotation = {
      duration: myDurationRotation,
      delay: myDelayRotation,
      repeat: myRepeatRotation,
      ease: "sine",

      x: myAxis[myAxisIndex] == "x" ? (degreeRotation * Math.PI) / 180 : 0,
      y: myAxis[myAxisIndex] == "y" ? (degreeRotation * Math.PI) / 180 : 0,
      z: myAxis[myAxisIndex] == "z" ? (degreeRotation * Math.PI) / 180 : 0,

      onComplete: function () {
        if (!myRepeatRotation) {
          myTween.shift().kill();
          //console.log('shift!!');
        }

        // Limiting Glitch Rotation (?)
        if (myAxis[myAxisIndex] == "x")
          masterCubeGrp.children[cubeIndex].rotation.x = 0;
        if (myAxis[myAxisIndex] == "y")
          masterCubeGrp.children[cubeIndex].rotation.y = 0;
        if (myAxis[myAxisIndex] == "z")
          masterCubeGrp.children[cubeIndex].rotation.z = 0;
      },
    };

    this.myTween.push(
      gsap.to(masterCubeGrp.children[cubeIndex].rotation, animPropRotation)
    ); // Rotation
  }
  readRotationValues() {
    this.valoreFinaleXRot = this.camera.rotation.x;
    this.valoreFinaleYRot = this.camera.rotation.y;
    this.valoreFinaleZRot = this.camera.rotation.z;
  }

  readZoomValue() {
    this.valoreZoomFinale = this.controls.target.distanceTo(
      this.controls.object.position
    );
  }

  initTextScrolling() {
    // Assegno un id ad ogni div.text
    let idvalue = "text-1";
    if (document.querySelectorAll(".text").length > 0)
      idvalue = "text-" + (document.querySelectorAll(".text").length + 1);

    // Assegno la classe last all'ultimo div creato
    // prima rimuovo l'ultimo last inserito
    if (document.querySelectorAll(".last").length > 0)
      document.querySelectorAll(".last").forEach((div) => {
        div.classList.remove("last");
      });

    // Creo il nuovo div.text.last
    let scrollerDIV = document.createElement("div");
    scrollerDIV.classList.add("text");
    scrollerDIV.classList.add("last");
    scrollerDIV.setAttribute("id", idvalue);
    document.getElementById("text-container").appendChild(scrollerDIV);
  }

  launchTextScrolling() {
    let degreeXRot = (valoreFinaleXRot - valoreInizialeXRot) * (180 / Math.PI);
    let degreeYRot = (valoreFinaleYRot - valoreInizialeYRot) * (180 / Math.PI);
    let degreeZRot = (valoreFinaleZRot - valoreInizialeZRot) * (180 / Math.PI);
    let zoomValue = valoreZoomFinale - valoreZoomIniziale;
    degreeXRot = degreeXRot.toFixed(2);
    degreeYRot = degreeYRot.toFixed(2);
    degreeZRot = degreeZRot.toFixed(2);
    zoomValue = zoomValue.toFixed(2);
    degreeXRot = degreeXRot > 0 ? "+" + degreeXRot + "°" : degreeXRot + "°";
    degreeYRot = degreeYRot > 0 ? "+" + degreeYRot + "°" : degreeYRot + "°";
    degreeZRot = degreeZRot > 0 ? "+" + degreeZRot + "°" : degreeZRot + "°";

    let pElemXRot = document.createElement("p");
    let pElemYRot = document.createElement("p");
    let pElemZRot = document.createElement("p");
    let pElemZoom = document.createElement("p");
    let contentX = document.createTextNode(
      "<x-rotation>" + degreeXRot + "</x-rotation>"
    );
    let contentY = document.createTextNode(
      "<y-rotation>" + degreeYRot + "</y-rotation>"
    );
    let contentZ = document.createTextNode(
      "<z-rotation>" + degreeZRot + "</z-rotation>"
    );

    let contentZoom;

    if (zoomValue == 0) {
      contentZoom = document.createTextNode("<zoom>" + zoomValue + "</zoom>");
    } else if (zoomValue > 0) {
      contentZoom = document.createTextNode(
        "<zoom-out>" + zoomValue + "</zoom-out>"
      );
    } else {
      contentZoom = document.createTextNode(
        "<zoom-in>" + zoomValue + "</zoom-in>"
      );
    }

    pElemXRot.classList.add("text-line-code");
    pElemYRot.classList.add("text-line-code");
    pElemZRot.classList.add("text-line-code");
    pElemZoom.classList.add("text-line-code");
    pElemXRot.appendChild(contentX);
    pElemYRot.appendChild(contentY);
    pElemZRot.appendChild(contentZ);
    pElemZoom.appendChild(contentZoom);

    if (Math.random() > 0.7) pElemXRot.classList.add("text-blink-it");
    if (Math.random() > 0.7) pElemYRot.classList.add("text-blink-it");
    if (Math.random() > 0.7) pElemZRot.classList.add("text-blink-it");
    if (Math.random() > 0.7) pElemZoom.classList.add("text-blink-it");

    if (document.querySelector(".last")) {
      document.querySelector(".last").appendChild(pElemXRot);
      document.querySelector(".last").appendChild(pElemYRot);
      document.querySelector(".last").appendChild(pElemZRot);
      document.querySelector(".last").appendChild(pElemZoom);
      addScrollTextTimeLine(document.querySelector(".last"));
    }

    valoreInizialeXRot = valoreFinaleXRot;
    valoreInizialeYRot = valoreFinaleYRot;
    valoreInizialeZRot = valoreFinaleZRot;
    valoreZoomIniziale = valoreZoomFinale;
  }

  addScrollTextTimeLine(container) {
    let tl = gsap.timeline();

    tl.to(container, {
      duration: 6,
      opacity: 0.5,
      delay: 0.4,
      y: -window.innerHeight - document.querySelector(".last").clientHeight,
      ease: "power2.out",
      onStart: function () {},
      onUpdate: function () {},
      onComplete: function () {
        container.remove();
      },
    });

    tl.play();
  }
  initEvent() {
    this.controls.addEventListener('change',function(){
      this.readRotationValues();
      this.readZoomValue();
    });
    
    document.addEventListener("mousedown", () => {
      if (!this.masterCubeOpened) {
        this.aperturaMastercube();
        this.masterCubeOpened = true;
      }
    });

    document.addEventListener("touchstart", () => {
      if (!this.masterCubeOpened) {
        this.aperturaMastercube();
        this.masterCubeOpened = true;
      }
    });
    window.addEventListener("mousedown", function () {
      this.onMouseMove = true;

      this.needle = setInterval(() => {
        if (this.onMouseMove) {
          this.initTextScrolling();
          this.launchTextScrolling();
        }
      }, 1200);
    });

    window.addEventListener("mouseup", function () {
      this.onMouseMove = false;
      clearInterval(this.needle);
    });
    window.addEventListener("click", function (e) {
      if (!this.onMouseMove) {
        this.initTextScrolling();
        this.launchTextScrolling();
      }
    });

    window.addEventListener("touchstart", function () {
      if (!this.onTouchMove) {
        this.initTextScrolling();
        this.launchTextScrolling();
      }

      this.needle = setInterval(() => {
        if (this.onTouchMove) {
          this.initTextScrolling();
          this.launchTextScrolling();
        }
      }, 2000);
    });

    window.addEventListener("touchmove", function () {
      this.onTouchMove = true;
    });

    window.addEventListener("touchend", function () {
      this.onTouchMove = false;
      clearInterval(this.needle);
    });
  }
}
export default Vacuum;

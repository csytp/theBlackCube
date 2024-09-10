import * as THREE from "three";
import Stats from "three/addons/libs/stats.module.js";

import Renderer from "./components/renderer";
import Events from "./components/events.js";
import Animator from "./components/animator";

import Vacuum from "./components/scenes/vacuum.js";
import SpaceScene from "./components/scenes/space.js";
import BoxesWorld from "./components/scenes/boxesworld.js";

import Thing from "./elements/Thing.js";
import Materials from "./elements/Materials.js";
import Geometries from "./elements/Geometries.js";

import { GUI } from "three/addons/libs/lil-gui.module.min.js";

import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderTransitionPass } from "three/addons/postprocessing/RenderTransitionPass.js";
import { GlitchPass } from "three/addons/postprocessing/GlitchPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";

import { gsap } from "gsap";

class Sketch {
  constructor() {
    this.tailwind_colors_array = [
      "black",
      "white",
      "slate-50",
      "slate-100",
      "slate-200",
      "slate-300",
      "slate-400",
      "slate-500",
      "slate-600",
      "slate-700",
      "slate-800",
      "slate-900",
      "slate-950",
      "gray-50",
      "gray-100",
      "gray-200",
      "gray-300",
      "gray-400",
      "gray-500",
      "gray-600",
      "gray-700",
      "gray-800",
      "gray-900",
      "gray-950",
      "zinc-50",
      "zinc-100",
      "zinc-200",
      "zinc-300",
      "zinc-400",
      "zinc-500",
      "zinc-600",
      "zinc-700",
      "zinc-800",
      "zinc-900",
      "zinc-950",
      "neutral-50",
      "neutral-100",
      "neutral-200",
      "neutral-300",
      "neutral-400",
      "neutral-500",
      "neutral-600",
      "neutral-700",
      "neutral-800",
      "neutral-900",
      "neutral-950",
      "stone-50",
      "stone-100",
      "stone-200",
      "stone-300",
      "stone-400",
      "stone-500",
      "stone-600",
      "stone-700",
      "stone-800",
      "stone-900",
      "stone-950",
      "red-50",
      "red-100",
      "red-200",
      "red-300",
      "red-400",
      "red-500",
      "red-600",
      "red-700",
      "red-800",
      "red-900",
      "red-950",
      "orange-50",
      "orange-100",
      "orange-200",
      "orange-300",
      "orange-400",
      "orange-500",
      "orange-600",
      "orange-700",
      "orange-800",
      "orange-900",
      "orange-950",
      "amber-50",
      "amber-100",
      "amber-200",
      "amber-300",
      "amber-400",
      "amber-500",
      "amber-600",
      "amber-700",
      "amber-800",
      "amber-900",
      "amber-950",
      "yellow-50",
      "yellow-100",
      "yellow-200",
      "yellow-300",
      "yellow-400",
      "yellow-500",
      "yellow-600",
      "yellow-700",
      "yellow-800",
      "yellow-900",
      "yellow-950",
      "lime-50",
      "lime-100",
      "lime-200",
      "lime-300",
      "lime-400",
      "lime-500",
      "lime-600",
      "lime-700",
      "lime-800",
      "lime-900",
      "lime-950",
      "green-50",
      "green-100",
      "green-200",
      "green-300",
      "green-400",
      "green-500",
      "green-600",
      "green-700",
      "green-800",
      "green-900",
      "green-950",
      "emerald-50",
      "emerald-100",
      "emerald-200",
      "emerald-300",
      "emerald-400",
      "emerald-500",
      "emerald-600",
      "emerald-700",
      "emerald-800",
      "emerald-900",
      "emerald-950",
      "teal-50",
      "teal-100",
      "teal-200",
      "teal-300",
      "teal-400",
      "teal-500",
      "teal-600",
      "teal-700",
      "teal-800",
      "teal-900",
      "teal-950",
      "cyan-50",
      "cyan-100",
      "cyan-200",
      "cyan-300",
      "cyan-400",
      "cyan-500",
      "cyan-600",
      "cyan-700",
      "cyan-800",
      "cyan-900",
      "cyan-950",
      "sky-50",
      "sky-100",
      "sky-200",
      "sky-300",
      "sky-400",
      "sky-500",
      "sky-600",
      "sky-700",
      "sky-800",
      "sky-900",
      "sky-950",
      "blue-50",
      "blue-100",
      "blue-200",
      "blue-300",
      "blue-400",
      "blue-500",
      "blue-600",
      "blue-700",
      "blue-800",
      "blue-900",
      "blue-950",
      "indigo-50",
      "indigo-100",
      "indigo-200",
      "indigo-300",
      "indigo-400",
      "indigo-500",
      "indigo-600",
      "indigo-700",
      "indigo-800",
      "indigo-900",
      "indigo-950",
      "violet-50",
      "violet-100",
      "violet-200",
      "violet-300",
      "violet-400",
      "violet-500",
      "violet-600",
      "violet-700",
      "violet-800",
      "violet-900",
      "violet-950",
      "purple-50",
      "purple-100",
      "purple-200",
      "purple-300",
      "purple-400",
      "purple-500",
      "purple-600",
      "purple-700",
      "purple-800",
      "purple-900",
      "purple-950",
      "fuchsia-50",
      "fuchsia-100",
      "fuchsia-200",
      "fuchsia-300",
      "fuchsia-400",
      "fuchsia-500",
      "fuchsia-600",
      "fuchsia-700",
      "fuchsia-800",
      "fuchsia-900",
      "fuchsia-950",
      "pink-50",
      "pink-100",
      "pink-200",
      "pink-300",
      "pink-400",
      "pink-500",
      "pink-600",
      "pink-700",
      "pink-800",
      "pink-900",
      "pink-950",
      "rose-50",
      "rose-100",
      "rose-200",
      "rose-300",
      "rose-400",
      "rose-500",
      "rose-600",
      "rose-700",
      "rose-800",
      "rose-900",
      "rose-950",
    ];
    this.sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    this.renderer = new Renderer(this);
    this.animator = new Animator(this, this.clock);
    this.composer = new EffectComposer(this.renderer);

    // this.stats = new Stats();
    // document.body.appendChild(this.stats.dom);
    // this.animator.add(() => this.stats.update());

    this.clock = new THREE.Clock();
    this.delta = this.clock.getDelta();

    this.transitionParams = {
      transition: 0,
      threshold: 0.1,
    };
    this.texturesFxScene = []; //Textures for renderTransitionPass

    this.arrayScenes = [
      new Vacuum(this),
      new SpaceScene(this, 20000), //params-> (this Sketch, starsCount)
      new BoxesWorld(this),
    ];

    this.fxSceneA = this.arrayScenes[0];
    this.fxSceneB = this.arrayScenes[1];

    this.renderTransitionPass = new RenderTransitionPass(
      this.fxSceneB.scene,
      this.fxSceneB.camera,
      this.fxSceneA.scene,
      this.fxSceneA.camera
    );
    //this.renderTransitionPass.setTexture(this.texturesFxScene[0]);
    this.composer.addPass(this.renderTransitionPass);

    // this.glitchPass = new GlitchPass();
    // this.composer.addPass( this.glitchPass );

    this.outputPass = new OutputPass();
    this.composer.addPass(this.outputPass);

    this.events = new Events(this);

    // window.addEventListener("resize", this.events.onWindowResize.bind(this), false);
    // document.addEventListener("keydown", this.onKeyPressed.bind(this), false);

    let myscene = [0];
    this.changeScene(myscene);
  }
  init() {
    //this.initTextures(this);
    //this.initGUI(this);

    // this.events = new Events(this);
    //addEventListener("change", this.events.onWindowResize.bind(this), false);

    this.animator.animate();
  }
  initGUI(sketch) {
    const gui = new GUI();

    // gui.add(this.paramsFxScene, "sceneAnimate").name("Animate scene");
    // gui.add(this.paramsFxScene, "transitionAnimate").name("Animate transition");
    gui
      .add(this.transitionParams, "transition", 0, 1, 0.01)
      .onChange(function (value) {
        sketch.renderTransitionPass.setTransition(value * 0.5);
      })
      .listen();

    // gui.add(this.paramsFxScene, "useTexture").onChange(function (value) {
    //   sketch.renderTransitionPass.useTexture(value);
    // });

    // gui
    //   .add(this.paramsFxScene, "texture", {
    //     Perlin: 0,
    //     Squares: 1,
    //     Cells: 2,
    //     Distort: 3,
    //     Gradient: 4,
    //     Radial: 5,
    //   })
    //   .onChange(function (value) {
    //     console.log(value);
    //     console.log(sketch.texturesFxScene[value]);
    //     sketch.renderTransitionPass.setTexture(sketch.texturesFxScene[value]);
    //   })
    //   .listen();

    // gui.add(this.paramsFxScene, "cycle");

    gui
      .add(this.transitionParams, "threshold", 0, 1, 0.01)
      .onChange(function (value) {
        sketch.renderTransitionPass.setTextureThreshold(value);
      });
  } /*
  initTextures(sketch) {
    const loader = new THREE.TextureLoader();

    for (let i = 0; i < 6; i++) {
      sketch.texturesFxScene[i] = loader.load(
        "./textures/transitions/transition" + (i + 1) + ".png"
      );
    }
    // sketch.renderTransitionPass.setTexture(sketch.texturesFxScene[0]);
    // sketch.composer.addPass(sketch.renderTransitionPass);
    // sketch.composer.dispose();
  }*/
  onKeyPressed(event) {
    const keyName = event.key;
    if (keyName === "1") {
      console.log("pressed 1");
      this.fxSceneA = this.arrayScenes[0];
      this.renderTransitionPass = new RenderTransitionPass(
        this.fxSceneB.scene,
        this.fxSceneB.camera,
        this.fxSceneA.scene,
        this.fxSceneA.camera
      );
    } else if (keyName === "2") {
      console.log("pressed 2");
      this.fxSceneB = this.arrayScenes[2];
      this.renderTransitionPass = new RenderTransitionPass(
        this.fxSceneB.scene,
        this.fxSceneB.camera,
        this.fxSceneA.scene,
        this.fxSceneA.camera
      );
    }
    this.composer.addPass(this.renderTransitionPass);
    this.composer.dispose();
  }
  removeEvents() {
    function removeAllEvents(node, event) {
      if (node in _eventHandlers) {
        var handlers = _eventHandlers[node];
        if (event in handlers) {
          var eventHandlers = handlers[event];
          for (var i = eventHandlers.length; i--; ) {
            var handler = eventHandlers[i];
            node.removeEventListener(event, handler[0], handler[1]);
          }
        }
      }
    }
    console.log("Window", window);
    console.log("Document", document);
    //removeAllEvents();
  }
  getActiveScene(arrayScenes) {
    let activeScene = 0;
    for (let i = 0; i < arrayScenes.length; i++) {
      if (arrayScenes[i].visible === true) {
        activeScene = i;
        break;
      }
    }
    return { scene: arrayScenes[activeScene], index: activeScene };
  }
  setActiveScene(arrayScenes, indexScene, sceneIWant) {
    this.arrayScenes.forEach((scene) => {
      scene.visible = false;
    });

    if (this.transitionParams.transition == 0) {
      this.fxSceneB = this.arrayScenes[sceneIWant];
      this.renderTransitionPass = new RenderTransitionPass(
        this.fxSceneB.scene,
        this.fxSceneB.camera,
        this.fxSceneB.controls.reset,
        this.fxSceneA.scene,
        this.fxSceneA.camera,
        this.fxSceneA.controls.reset
      );
      this.transitionParams.transition = 1;
    } else {
      this.fxSceneA = this.arrayScenes[sceneIWant];
      this.renderTransitionPass = new RenderTransitionPass(
        this.fxSceneA.scene,
        this.fxSceneA.camera,
        this.fxSceneA.controls.reset,
        this.fxSceneB.scene,
        this.fxSceneB.camera,
        this.fxSceneB.controls.reset
      );
      this.transitionParams.transition = 0;
    }

    this.arrayScenes[sceneIWant].visible = true;
  }
  changeScene(args) {
    const $this = this;
    let sceneIWant = args[0];

    let activeSceneObj = this.getActiveScene(this.arrayScenes);
    this.setActiveScene(activeSceneObj.scene, activeSceneObj.index, sceneIWant);
  }
  getRandomTailwindColor() {
    return this.tailwind_colors_array[
      Math.ceil(Math.random() * this.tailwind_colors_array.length)
    ];
  }
}

export default Sketch;

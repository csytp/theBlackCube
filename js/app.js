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

class Sketch {
  constructor() {
    this.sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    this.renderer = new Renderer(this);
    this.animator = new Animator(this, this.clock);
    this.composer = new EffectComposer(this.renderer);

    this.animator.add(() => this.stats.update());

    this.stats = new Stats();
    document.body.appendChild(this.stats.dom);

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
    this.fxSceneC = this.arrayScenes[2];

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

    // window.addEventListener("resize", this.onWindowResize.bind(this), false);
    document.addEventListener("keydown", this.onKeyPressed.bind(this), false);
  }
  init() {
    //this.initTextures(this);
    this.initGUI(this);

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
}

export default Sketch;
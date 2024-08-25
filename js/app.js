import * as THREE from "three";

import Scene from "./components/scene";
import Renderer from "./components/renderer";
import Camera from "./components/camera";
import Lights from "./components/lights";
import Events from "./components/events";
import Animator from "./components/animator";
import FxScene from "./components/fxscene.js";

import Thing from "./elements/Thing.js";
import Materials from "./elements/Materials.js";
import Geometries from "./elements/Geometries.js";

import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderTransitionPass } from 'three/addons/postprocessing/RenderTransitionPass.js';
import { GlitchPass } from 'three/addons/postprocessing/GlitchPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

class Sketch {
  constructor() {
    this.clock = new THREE.Clock();

    this.textures = [];

    this.sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
    };
    this.params = {
      sceneAnimate: true,
      transitionAnimate: true,
      transition: 0,
      useTexture: true,
      texture: 5,
      cycle: true,
      threshold: 0.1,
    };    

    // const glitchPass = new GlitchPass();
    // composer.addPass( glitchPass );

    this.events = new Events(this);
    this.renderer = new Renderer(this);
    this.animator = new Animator(this, this.clock);
    this.composer = new EffectComposer( this.renderer );

    this.fxSceneA = new FxScene(this, 0xFFFFFF);
    this.fxSceneB = new FxScene(this, 0x000000);

    console.log(this.fxSceneA);
    // this.fxscene3 = new FxScene(this, 0xF02A6E);
    // this.fxscene4 = new FxScene(this, 0x2AF041);

    this.renderTransitionPass = new RenderTransitionPass( this.fxSceneB.scene, this.fxSceneB.camera, this.fxSceneA.scene, this.fxSceneA.camera );
    this.renderTransitionPass.setTexture( this.textures[ 0 ] );
    this.composer.addPass( this.renderTransitionPass );

    this.outputPass = new OutputPass();
    this.composer.addPass( this.outputPass );
    
  }
  init() {
    //this.addObjects();
    this.initGUI(this);
    document.body.appendChild(this.renderer.domElement);
    this.animator.animate();
  }
  initGUI(sketch) {

    const gui = new GUI();

    gui.add( sketch.params, 'sceneAnimate' ).name( 'Animate scene' );
    gui.add( sketch.params, 'transitionAnimate' ).name( 'Animate transition' );
    gui.add( sketch.params, 'transition', 0, 1, 0.01 ).onChange( function ( value ) {

      sketch.renderTransitionPass.setTransition( value );

    } ).listen();

    gui.add( sketch.params, 'useTexture' ).onChange( function ( value ) {

      sketch.useTexture( value );

    } );

    gui.add( sketch.params, 'texture', { Perlin: 0, Squares: 1, Cells: 2, Distort: 3, Gradient: 4, Radial: 5 } ).onChange( function ( value ) {

      sketch.renderTransitionPass.setTexture( sketch.textures[ value ] );

    } ).listen();

    gui.add( sketch.params, 'cycle' );

    gui.add( sketch.params, 'threshold', 0, 1, 0.01 ).onChange( function ( value ) {

      sketch.renderTransitionPass.setTextureThreshold( value );

    } );

}
  /*
  addObjects() {
    this.materials = new Materials(this);
    this.geometries = new Geometries(this);

    this.things = [];
    this.num = 3;
    this.width = 6;
    for (let x = 0; x <= this.num; x++) {
      for (let y = 0; y <= this.num; y++) {
        const posX = (x / this.num) * this.width - this.width / 2;
        const posY = (y / this.num) * this.width - this.width / 2;
        this.things.push(new Thing(this, posX, posY));
      }
    }
  }*/
}

export default Sketch;

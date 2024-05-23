import './../css/style.css';
import * as THREE from "three";
import { TrackballControls } from "three/examples/jsm/Addons.js";

import Scene from "./components/scene";
import Renderer from "./components/renderer";
import Camera from "./components/camera";
import Lights from "./components/lights";
import Events from "./components/events";
import Controls from "./components/controls";
import Animator from "./components/animator";

import Mastercube from "./elements/Mastercube.js";
/*
import Thing from "./elements/Thing.js";
import Materials from "./elements/Materials.js";
import Geometries from "./elements/Geometries.js";
*/

class Sketch {
  constructor() {
    
    this.animator = new Animator(this);
    this.sizes = {
      width: window.innerWidth,
      height: window.innerHeight
    };
    this.scene = new Scene(this);
    this.renderer = new Renderer(this);
    this.camera = new Camera(this);
    this.lights = new Lights(this);
        
    //this.controls = new Controls(this);


    this.events = new Events(this);
    this.mastercube = new Mastercube(this);
    /*
    this.controls.addEventListener('change', () => {
      this.mastercube.position.copy(this.controls.target.clone());
    });
*/
  }
  init() {
    this.addObjects();
    document.getElementById('app').appendChild(this.renderer.domElement);
    this.animator.animate();
  }
  addObjects() {
    
  }
}

export default Sketch;

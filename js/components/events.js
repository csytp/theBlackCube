class Events {
  constructor(fxscene, settings) {
    this.fxscene = fxscene;
    this.settings = { ...settings };

    console.log(this.fxscene);
    this.addEvents();
  }
  addEvents() {
    window.addEventListener("resize", this.onWindowResize.bind(this), false);
  }
  onWindowResize() {
    this.fxscene.sketch.sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    console.log(this.fxscene);

    this.fxscene.camera.aspect =
      this.fxscene.sketch.sizes.width / this.fxscene.sketch.sizes.height;
    this.fxscene.camera.updateProjectionMatrix();
    
    this.fxscene.sketch.renderer.setSize(
      this.fxscene.sketch.sizes.width,
      this.fxscene.sketch.sizes.height
    );
    this.fxscene.sketch.renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
    /*
    this.sketch.fxSceneA.resize();
    this.sketch.fxSceneB.resize();
    this.sketch.renderer.setSize( window.innerWidth, window.innerHeight );
    this.sketch.composer.setSize( window.innerWidth, window.innerHeight );
    */
  }
}
export default Events;

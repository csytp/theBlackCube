class Events {
  constructor(fxscene, settings) {
    this.fxscene = fxscene;
    this.settings = { ...settings };

    this.addEvents();
  }
  addEvents() {
    window.addEventListener("resize", this.onWindowResize.bind(this), false);
  }
  onKeyPressed() {}
  onWindowResize() {
    // Updating Sketch window sizes
    this.fxscene.sketch.sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    // Updating Camera sizes
    this.fxscene.camera.aspect =
      this.fxscene.sketch.sizes.width / this.fxscene.sketch.sizes.height;
    this.fxscene.camera.updateProjectionMatrix();

    // Updating Render sizes
    this.fxscene.sketch.renderer.setSize(
      this.fxscene.sketch.sizes.width,
      this.fxscene.sketch.sizes.height
    );
    this.fxscene.sketch.renderer.setPixelRatio(
      Math.min(2, window.devicePixelRatio)
    );
  }
}
export default Events;

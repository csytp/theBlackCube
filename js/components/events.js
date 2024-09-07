class Events {
  constructor(sketch, settings) {
    this.sketch = sketch;
    this.settings = { ...settings };

    this.addEvents();
  }
  addEvents() {
    window.addEventListener("resize", this.onWindowResize.bind(this), false);

    
  }
  onKeyPressed() {}
  onWindowResize() {
    let enabledScene = this.sketch.getActiveScene(this.sketch.arrayScenes);
    enabledScene = enabledScene.scene;
    // Updating Sketch window sizes
    this.sketch.sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    // Updating Camera sizes
    enabledScene.camera.aspect =
      this.sketch.sizes.width / this.sketch.sizes.height;
      enabledScene.camera.updateProjectionMatrix();

    // Updating Render sizes
    this.sketch.renderer.setSize(
      this.sketch.sizes.width,
      this.sketch.sizes.height
    );
    this.sketch.renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
  }
}
export default Events;

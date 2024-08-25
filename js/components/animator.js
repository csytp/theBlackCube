class Animator {
  constructor(sketch, settings) {
    this.sketch = sketch;
    this.settings = { ...settings };

    this.tasks = [];

    //this.frame = 0;
  }
  add(fn) {
    this.tasks.push(fn);
  }
  animate() {
    requestAnimationFrame(this.animate.bind(this));

    const delta = this.sketch.clock.getDelta();

    this.sketch.fxSceneA.update(delta);
    this.sketch.fxSceneB.update(delta);

    this.tasks.forEach((task) => task());
    //this.frame++;
    this.sketch.renderer.update();
    
  }
}
export default Animator;

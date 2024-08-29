class Animator {
  constructor(sketch, settings) {
    this.sketch = sketch;
    this.settings = { ...settings };

    this.tasks = [
      /*
      () => this.sketch.fxSceneA.update(this.sketch.clock.getDelta()),
      () => this.sketch.fxSceneB.update(this.sketch.clock.getDelta()),
*/
    ];

    //this.frame = 0;
  }
  add(fn) {
    this.tasks.push(fn);
  }
  animate() {
    requestAnimationFrame(this.animate.bind(this));

    const delta = this.sketch.clock.getDelta();

    this.tasks.forEach((task) => task());
    //this.frame++;
    this.sketch.renderer.update(delta);
  }
}
export default Animator;

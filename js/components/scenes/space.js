import * as THREE from "three";
import FxScene from "../fxscene.js";

import srcStarMap from "../../../img/star.png";

class SpaceScene extends FxScene {
  constructor(sketch, starsCount) {
    super(sketch, new THREE.Color(0x000000), false);

    this.scene.add(new THREE.AmbientLight(0xaaaaaa, 3));


    this.starsCount = starsCount;

    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(6 * this.starsCount), 3)
    );
    starGeo.setAttribute(
      "velocity",
      new THREE.BufferAttribute(new Float32Array(2 * this.starsCount), 1)
    );
    let pos = starGeo.getAttribute("position");
    let pa = pos.array;
    let vel = starGeo.getAttribute("velocity");
    let va = vel.array;

    for (let point_index = 0; point_index < this.starsCount; point_index++) {
      //points (stars) coordinates
      let x = Math.random() * 400 - 200;
      let y = Math.random() * 400 - 200;
      let z = Math.random() * 400 - 200;
      let xx = x;
      let yy = y;
      let zz = z;

      //point start
      pa[6 * point_index] = x;
      pa[6 * point_index + 1] = y;
      pa[6 * point_index + 2] = z;
      //point end
      pa[6 * point_index + 3] = xx;
      pa[6 * point_index + 4] = yy;
      pa[6 * point_index + 5] = zz;

      va[2 * point_index] = va[2 * point_index + 1] = 0;
    }

    const starTextureLoader = new THREE.TextureLoader();
    const starTexture = starTextureLoader.load(srcStarMap);
    const starMaterial = new THREE.PointsMaterial({
      color: 0xaaaaaa,
      size: 0.5,
      map: starTexture,
      sizeAttenuation: true,
    });

    this.stars = new THREE.Points(starGeo, starMaterial);
    this.scene.add(this.stars);

    //return this.scene;
  }
  update( delta ) {
  }
}
export default SpaceScene;

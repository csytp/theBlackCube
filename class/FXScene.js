import * as THREE from 'three';

//( geometry, rotationSpeed, backgroundColor )
class FXScene 
{
    constructor(geometry, rotationSpeed, backgroundColor){
        this.camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.1, 100 );
        this.camera.position.z = 20;

        // Setup scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color( backgroundColor );
        this.scene.add( new THREE.AmbientLight( 0xaaaaaa, 3 ) );
      
        this.light = new THREE.DirectionalLight( 0xffffff, 3 );
        this.light.position.set( 0, 1, 4 );
        this.scene.add( this.light );
      
        this.rotationSpeed = rotationSpeed;
      
        this.color = geometry.type === 'BoxGeometry' ? 0x0000ff : 0xff0000;
        this.material = new THREE.MeshPhongMaterial( { color: this.color, flatShading: true } );
        this.mesh = generateInstancedMesh( geometry, material, 500 );
        this.scene.add( mesh );
      /*
        this.scene = scene;
        this.camera = camera;
        this.mesh = mesh;
      */
        this.update = function ( delta ) {
      
            if ( params.sceneAnimate ) {
      
                mesh.rotation.x += this.rotationSpeed.x * delta;
                mesh.rotation.y += this.rotationSpeed.y * delta;
                mesh.rotation.z += this.rotationSpeed.z * delta;
      
            }
      
        };
      
        this.resize = function () {
      
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
      
        };
    }
    generateInstancedMesh( geometry, material, count ) {

        const mesh = new THREE.InstancedMesh( geometry, material, count );
    
        const dummy = new THREE.Object3D();
        const color = new THREE.Color();
    
        for ( let i = 0; i < count; i ++ ) {
    
            dummy.position.x = Math.random() * 100 - 50;
            dummy.position.y = Math.random() * 60 - 30;
            dummy.position.z = Math.random() * 80 - 40;
    
            dummy.rotation.x = Math.random() * 2 * Math.PI;
            dummy.rotation.y = Math.random() * 2 * Math.PI;
            dummy.rotation.z = Math.random() * 2 * Math.PI;
    
            dummy.scale.x = Math.random() * 2 + 1;
    
            if ( geometry.type === 'BoxGeometry' ) {
    
                dummy.scale.y = Math.random() * 2 + 1;
                dummy.scale.z = Math.random() * 2 + 1;
    
            } else {
    
                dummy.scale.y = dummy.scale.x;
                dummy.scale.z = dummy.scale.x;
    
            }
    
            dummy.updateMatrix();
    
            mesh.setMatrixAt( i, dummy.matrix );
            mesh.setColorAt( i, color.setScalar( 0.1 + 0.9 * Math.random() ) );
    
        }
    
        return mesh;
    
    }
  
  
  }

  export default FXScene;
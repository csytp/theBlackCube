import FontJSON from './../font/Roboto-msdf.json';
import FontImage from './../font/Roboto-msdf.png';
import * as THREE from 'three';



export function makeTextPanel() {

	const container = new ThreeMeshUI.Block( {
		padding: 0.05,
		textType: 'MSDF',
		fontFamily: FontJSON,
		fontTexture: FontImage,
		fontColor: new THREE.Color( 0xffffff ),
		fontOpacity: 0.9 // 0 is invisible, 1 is opaque
	} );

	//container.position.set( 0, 1, -1.8 );
	container.rotation.x = -0.55;
	//scene.add( container );

	const bigTextContainer = new ThreeMeshUI.Block( {
		padding: 0.03,
		margin: 0.03,
		width: 1.5,
		height: 1.2,
		justifyContent: 'center',
		textAlign: 'left',
		backgroundOpacity: 0
	} );

	bigTextContainer.add(
		new ThreeMeshUI.Text( {
			content: 'three-mesh-ui is very efficient when rendering big text because the glyphs are textures on simple planes geometries, all merged together. '.repeat( 18 ),
			fontSize: 0.033
		} )
	);

	//

	const titleContainer = new ThreeMeshUI.Block( {
		width: 0.9,
		height: 0.25,
		padding: 0.04,
		margin: 0.03,
		backgroundOpacity: 0
	} ).add(
		new ThreeMeshUI.Text( {
			content: 'Do you need to render a big text ?',
			fontSize: 0.07
		} )
	);

	//

	container.add( titleContainer, bigTextContainer );

	return container;

}
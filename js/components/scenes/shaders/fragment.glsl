uniform sampler2D uTexture;
uniform float uTime;
uniform float uRadius;

varying vec3 vPosition;
varying vec3 vNormal;
varying vec2 vUv;

//signed distance field
// float drawCircle(vec2 position, vec2 center, float radius){
// 	return step(radius, distance(position, center));
// }

// float sdBox( in vec2 p, in vec2 b )
// {
//     vec2 d = abs(p)-b;
//     return length(max(d,0.0)) + min(max(d.x,d.y),0.0);
// }

void main() {

	//Line
	// step(0.998 ,1.0- abs(vUv.y - 0.5))

	//Circle
	// step(uRadius, length(vUv-0.5))

	//drawCircle(vUv, vec2(0.5), uRadius)

	//step(0.9, 1.0 - sdBox(vUv-0.5, vec2(0.15)))

	const vec3 DESATURATE = vec3(0.2126, 0.7152, 0.0722);

	vec3 color = texture2D(uTexture, vUv).xyz;
	
	float finalColor = dot(DESATURATE, color);

	gl_FragColor = vec4(vec3(finalColor), 1);
}
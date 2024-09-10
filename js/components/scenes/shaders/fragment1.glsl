
uniform float uTime;
uniform float uRadius;

varying vec3 vPosition;
varying vec3 vNormal;
varying vec2 vUv;

void main() {
	vec2 uv = vUv;
	uv -= vec2(0.5);
	uv *= 2.0;
	
	//vec3(step(uRadius, length(uv)))
	//fract(vUv.x * 10.0)
	//step(0.5, mod(vUv.x * 10.0, 3.0)
	//mix(0.0, 0.5, vUv.x)

	// vec3 vectorA = vec3(1.0);
	// vec3 vectorB = vec3(0.0);
	// float dotProduct = dot(vectorA, vectorB);

	vec3 viewDirection = normalize(cameraPosition - vPosition);
	float fresnel = 1.0-dot(viewDirection, vNormal);

	gl_FragColor = vec4(vec3(fresnel), 1);
}
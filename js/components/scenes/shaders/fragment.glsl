// struct vec5{
// 	float x;
// 	float y;
// 	float z;
// 	float w;
// 	float q;
// }


// float sum(float a , float b){
// 	return a + b;
// }

void main() {

	float greenValue = 1.0;

	vec3 myVector = vec3 (1.0);
	myVector.x = 0.0;

	vec4 color = vec4(vec3(0.0, greenValue, 0.0), 1.0);

	gl_FragColor = color;
}
#version 300 es
precision highp float;
out vec4 outColor;

void main() {
	outColor = vec4(gl_FragCoord.x / gl_FragCoord.y, 0.75, 0.1, 1);
}
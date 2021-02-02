module.exports = {
	vertexShaderSource : 
	`	#version 300 es
		in vec4 a_position;

		void main() {
			gl_Position = a_position;
		}
	`,

	fragmentShaderSource :
	`	#version 300 es
		precision highp float;
		out vec4 outColor;
		
		void main() {
			outColor = vec4(1, 0.5, 0.5, 1);
		}
	` 
}
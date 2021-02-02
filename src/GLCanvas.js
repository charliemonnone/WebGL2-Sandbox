const shaders = require('../sketches/untitled/scratch_shaders.js');
let { vertexShaderSource, fragmentShaderSource } = shaders;


// These functions from https://webgl2fundamentals.org/webgl/lessons/webgl-fundamentals.html
function createShader(gl, type, source) 
{
	let shader = gl.createShader(type);
	gl.shaderSource(shader, source);
	gl.compileShader(shader);
	let success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
	if (success) { return shader; }
	console.log(gl.getShaderInfoLog(shader));
	gl.deleteShader(shader);
}

function createProgram(gl, vertexShader, fragmentShader) 
{
	let program = gl.createProgram();
	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragmentShader);
	gl.linkProgram(program);
	let success = gl.getProgramParameter(program, gl.LINK_STATUS);
	if (success) { return program; }
	console.log(gl.getProgramInfoLog(program));
	gl.deleteProgram(program);
}

function resizeCanvasToDisplaySize(canvas) 
{
	// Lookup the size the browser is displaying the canvas in CSS pixels.
	const displayWidth  = canvas.clientWidth;
	const displayHeight = canvas.clientHeight;
   
	// Check if the canvas is not the same size.
	const needResize = canvas.width  !== displayWidth ||
					   canvas.height !== displayHeight;
   
	if (needResize) 
	{
	  // Make the canvas the same size
	  canvas.width  = displayWidth;
	  canvas.height = displayHeight;
	}
   
	return needResize;
}


/*
	NOTE: Once I get to piping in CodeMirror changes, glMain will likely need to be separated from 
	the gl utility functions involving shader and program creation. Each sketch will need its own 
	main function as well, so this file will definitely need to be broken up. My tentative plans for
	how this will look is such:
		codeMirror ---> WebGL Wrapper containing common functions -> sketch's glMain
	I'll also need rewrite glMain such that I can force a rerender when shaders get recompiled 
*/

function glMain(clearOpacity = 1)
{
	const canvas = document.getElementById("canvas"); 
	if(!canvas)
	{
		console.log('Error getting canvas')	
		return;
	}

	const gl = canvas.getContext("webgl2", {antialias: false});
	if(!gl)
	{
		console.log('Error getting webgl2 context')	
		return;
	} 

	let vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
	let fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
	let program = createProgram(gl, vertexShader, fragmentShader);

	let positionAttribLocation = gl.getAttribLocation(program, "a_position");

	let positionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
	
	let positions = new Float32Array([
		-0.5, 0,
		-0.5, 0.5,
		0.5, 0,
		0.5, 0.5
	]);
	gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

	let vao = gl.createVertexArray();
	gl.bindVertexArray(vao);
	gl.enableVertexAttribArray(positionAttribLocation);
	let size = 2;          // 2 components per iteration
    let type = gl.FLOAT;   // the data is 32bit floats
    let normalize = false; // don't normalize the data
    let stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
    let offset = 0;        // start at the beginning of the buffer
	gl.vertexAttribPointer(positionAttribLocation, size, type, normalize, stride, offset);
	
	resizeCanvasToDisplaySize(gl.canvas);
	gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
	// Clear the canvas
	// 0.4
	gl.clearColor(0, 0, 0, clearOpacity);
	gl.clear(gl.COLOR_BUFFER_BIT);

	// Tell it to use our program (pair of shaders)
	gl.useProgram(program);

	// Bind the attribute/buffer set we want.
	gl.bindVertexArray(vao);

	var primitiveType = gl.LINE_LOOP;
	//console.log(positions.length);
    var count = positions.length / size;
	gl.drawArrays(primitiveType, offset, count);
}


exports.glMain = glMain;
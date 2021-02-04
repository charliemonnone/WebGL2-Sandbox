const fs = require('fs');
/*
	NOTE: I think in regards to hotloading changes to the glCanvas I have two options:
			1. write changes to a temporary copy of the shader 
			2. pipe the string value of the shader to glCanvas
	With option 1 I'll have to either setup the canvas to poll for file changes, or implement a function
	that forces the canvas to re-read the file on recompile. With option 2, I can write a function that 
	sends the string representation of the shader to the canvas, and simply call that on recompile. 
	The main unknown in the performance of either option; my gut tells me the file write and subsequent reload 
	from the canvas is more expensive than writing a string to a pipe, but then again if the shader starts to 
	become large option 1 might pan out better. Plus, a tmp file can be recovered in the case of a crash, whereas 
	the string would be lost. 
*/


/*
	NOTE: Have to keep an eye on readFile() performance impact,
	if it proves to be a bottleneck switch to fs streams/buffers  
*/
async function getFileContents(filePath, encoding) {
	const contents = await fs.promises.readFile(filePath, { encoding })
	return contents;
}

function getFileContentsSync(filePath, encoding) {
	const contents = fs.readFileSync(filePath, { encoding })
	return contents;
}

async function saveFileChanges(filePath, data, encoding) {
	fs.writeFile(filePath, data, { encoding }, (err, val) => {
		if(err) return(err);
		else return(val);
	});
}

function saveFileChangesSync(filePath, data, encoding) {
	const result = fs.writeFileSync(filePath, data, { encoding });
	return result;
}


/*
	TODO: Implement project creation with default gl canvas, 
	and a vertex/fragement shader pair
*/
async function createNewProjDir(projName) {

}


async function getProjectDir(projPath) {
	let dir = await fs.readdir(projPath);
	return dir
}

module.exports = 
{ 
	getFileContents,
	getFileContentsSync,
	saveFileChanges, 
	saveFileChangesSync,
	getProjectDir
}
const fs = require('fs').promises;

/*
	NOTE: Have to keep an eye on readFile() performance impact,
	if it proves to be a bottleneck switch to fs streams/buffers  
*/
async function getFileContents(filePath, encoding) {
	const contents = await fs.readFile(filePath, { encoding })
	return contents;
}


/*
	TODO: Implement file saving
*/
async function saveFileChanges(filePath, changes) {

}


async function getProjectDir(projPath) {
	let dir = await fs.readdir(projPath);
	return dir
}

module.exports = 
{ 
	getFileContents: getFileContents,
	saveFileChanges: saveFileChanges, 
	getProjectDir: getProjectDir
}
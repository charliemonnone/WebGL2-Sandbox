const fs = require('fs').promises;

async function getFileContents(filePath, encoding) {
	const contents = await fs.readFile(filePath, { encoding })
	return contents;
}

// saveFile = async (filePath, changes) => {

// }


// async function loadShaderFiles() {
// 	// return dir = await fs.readdir(`${__dirname}/sketches/${projName}`);
// 	let dir = await fs.readdir(`${__dirname}/sketches/${projName}`);
// 	if(dir) {
// 		dir.forEach((file) => {
// 			if(file.endsWith('.frag')) {
// 				fs.readFile(`${__dirname}/sketches/${projName}/${file}`, {encoding}, (err, data) => {
// 					if(err) return err;
// 					if(data) return data
// 				});
// 				// return fragShader = fs.readFile(`${__dirname}/sketches/${projName}/${file}`, {encoding});
// 			}  
// 			// else if(file.endsWith('.frag')) {
// 			// 	fragShader = fs.readFile(`${__dirname}/sketches/${projName}/${file}`, {encoding});
// 			// }
// 		})
// 	}
// }

module.exports = { getFileContents: getFileContents }
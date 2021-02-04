const glCanvas 				= require(`${__dirname}/src/GLCanvas`),
	FileSys 				= require(`${__dirname}/src/utils/FileSys`),
	PaneManager  			= require(`${__dirname}/src/ui/PaneManager`),
	cnst 					= require(`${__dirname}/src/Constants`),
	{ contextMenuTemplate } = require(`${__dirname}/src/ui/MenuTemplates`),
	{ ipcRenderer, remote} 	= require('electron'),
	{ Menu } 				= remote;

let canvasSection 			= document.getElementById(cnst.CANVAS_SECTION),
	// opacitySlider 			= document.getElementById(cnst.OPACITY_SLIDER),
	projName 				= 'untitled',
	projPath 				= `${__dirname}/sketches/${projName}`, 
	encoding 				= 'utf-8',
	clearOpacity 			= 0.1;


function updateWindowOpacity(value) {
	ipcRenderer.invoke('update-opacity', value);
}

function initEventListeners() {	
	const menu = Menu.buildFromTemplate(contextMenuTemplate);

	window.addEventListener('contextmenu', (e) => {
		e.preventDefault()
		menu.popup({ window: remote.getCurrentWindow() })
	}, false);


}


/*
	TODO: add a sidebar listing open panes; clicking on a name brings it 
	to the forefront; add hide icon
 */

function createCodeMirror(elem) {

	return CodeMirror(elem, {
		lineNumbers: true,
		theme: 'ambiance',
		spellcheck: true,
		value: '',
	});
}

function renderProcess() {
	// let statusBar = new Pane(cnst.BOTTOM_PANE, document.getElementById(cnst.STATUS_BAR));

	let vertPane = PaneManager.createShaderPane(cnst.VERT_PANE, 'Vertex Shader');
	canvasSection.appendChild(vertPane.root);
	let fragPane = PaneManager.createShaderPane(cnst.FRAG_PANE, 'Frag Shader');
	canvasSection.appendChild(fragPane.root);

	/*
		To get saving/compiling working, I might have to pass a ref
		to the codeMirror instances and then call
		vertCodeMirror.getWrapperElement(), or getValue() on the instance  
	*/

	let vertShader = FileSys.getFileContentsSync(`${projPath}/scratch.vert`, encoding ); 
	let fragShader = FileSys.getFileContentsSync(`${projPath}/scratch.frag`, encoding );

	let vertCodeMirror = createCodeMirror(vertPane.root);
	let fragCodeMirror = createCodeMirror(fragPane.root);

	vertCodeMirror.setValue(vertShader)
	fragCodeMirror.setValue(fragShader)


	/*
		NOTE: For now, recompiling/save and recompile will simply just reren glMain().
		This will change once glMain is split into different files
	*/

	vertPane.saveButton.onclick = () => {
		let result = FileSys.saveFileChangesSync(`${projPath}/scratch.vert`, vertCodeMirror.getValue(), encoding);
		glCanvas.glMain(vertCodeMirror.getValue(), fragShader, clearOpacity);

	}

	vertPane.compileButton.onclick = () => {
		glCanvas.glMain(vertCodeMirror.getValue(), fragShader, clearOpacity);
	}

	fragPane.saveButton.onclick = () => {
		let result = FileSys.saveFileChangesSync(`${projPath}/scratch.frag`, fragCodeMirror.getValue(), encoding);
		glCanvas.glMain(vertShader, fragCodeMirror.getValue(), clearOpacity);
	}

	fragPane.compileButton.onclick = () => {
		glCanvas.glMain(vertShader, fragCodeMirror.getValue(), clearOpacity);
	}


	/*
		TODO: Once I get to sketches loading, .vert/.frag filenames
		will be identified via getProjectDir; for now they're hardcoded
		
		let dir = FileSys.getProjectDir(projPath);
		dir.then((data) => {console.log(data)});	
	*/
	
	/*
		NOTE: Since the shader files have to synchronously load for glMain to render,
		for now I'm commenting out the async load for the codemirror instances and 
		just passing them the result of the synchronous load
	*/
	// let vertFile = FileSys.getFileContents(`${projPath}/scratch.vert`, encoding );
	// vertFile.then((data) => {
	// 	vertCodeMirror.setValue(data)
	// });	

	// let fragFile = FileSys.getFileContents(`${projPath}/scratch.frag`, encoding );
	// fragFile.then((data) => {
	// 	fragCodeMirror.setValue(data)
	// });	




/*
	TODO: I'd like to have a canvas configuration pane as well to quickly toggle
	some stuff, line DRAW_MODE, CLEAR_COLOR, drawing axis lines, etc.

*/
	initEventListeners();
	PaneManager.initPaneListeners();

	
	glCanvas.glMain(vertShader, fragShader, clearOpacity);

}

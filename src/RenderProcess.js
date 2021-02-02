const glCanvas 				= require(`${__dirname}/src/GLCanvas`),
	Pane 					= require(`${__dirname}/src/ui/Pane`).Pane,
	FileSys 				= require(`${__dirname}/src/utils/FileSys`),
	PaneManager  			= require(`${__dirname}/src/ui/PaneManager`),
	cnst 					= require(`${__dirname}/src/Constants`),
	{ contextMenuTemplate } = require(`${__dirname}/src/ui/MenuTemplates`),
	{ ipcRenderer, remote} 	= require('electron'),
	{ Menu } 				= remote;

let upperSection 			= document.getElementById(cnst.UPPER_SECTION),
	// opacitySlider 			= document.getElementById(cnst.OPACITY_SLIDER),
	projName 				= 'untitled',
	projPath 				= `${__dirname}/sketches/${projName}`, 
	encoding 				= 'utf-8';


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



function renderProcess() {
	// let statusBar = new Pane(cnst.BOTTOM_PANE, document.getElementById(cnst.STATUS_BAR));

	let vertPane = PaneManager.createPane(cnst.VERT_PANE, 'Vertex Shader');
	let fragPane = PaneManager.createPane(cnst.FRAG_PANE, 'Frag Shader');
	let canvasPane = PaneManager.createPane(cnst.CANVAS_PANE, 'WebGL Canvas');

	let canvas = document.createElement('canvas');
	canvas.id = 'canvas';
	canvasPane.body.appendChild(canvas);

	let vertCodeMirror = CodeMirror(vertPane.body, {
		lineNumbers: true,
		theme: 'ambiance',
		spellcheck: true,
		value: '',
	});

	let fragCodeMirror = CodeMirror(fragPane.body, {
		lineNumbers: true,
		theme: 'ambiance',
		spellcheck: true,
		value: '',
	});


	/*
		TODO: Once I get to sketches loading, .vert/.frag filenames
		will be identified via getProjectDir; for now they're hardcoded
		
		let dir = FileSys.getProjectDir(projPath);
		dir.then((data) => {console.log(data)});	
	*/
	


	let vertFile = FileSys.getFileContents(`${projPath}/scratch.vert`, encoding );
	vertFile.then((data) => {vertCodeMirror.setValue(data)});	

	let fragFile = FileSys.getFileContents(`${projPath}/scratch.frag`, encoding );
	fragFile.then((data) => {fragCodeMirror.setValue(data)});	


/*
	TODO: I'd like to have a canvas configuration pane as well to quickly toggle
	some stuff, line DRAW_MODE, CLEAR_COLOR, etc.

	let canvasConfigTab = document.createElement('div');
	canvasConfigTab.classList = ['tab-header'];
	let drawModeSelect = document.createElement('select');
	canvasConfigTab.innerHTML = 'Canvas Options';
	
	canvasPane.tab.appendChild(canvasConfigTab);
	canvasConfigTab.appendChild(drawModeSelect);
*/
	initEventListeners();
	PaneManager.initPaneListeners();

	let clearOpacity = 0.1;
	
	glCanvas.glMain(clearOpacity);

}

const glCanvas = require(`${__dirname}/src/GLCanvas`),
	Pane = require(`${__dirname}/src/ui/Pane`).Pane,
	FileSys = require(`${__dirname}/src/utils/FileSys`),
	PaneManager  = require(`${__dirname}/src/ui/PaneManager`).PaneManager,
	cnst = require(`${__dirname}/src/Constants`),
	Path = require('path'),
	fs = require('fs'),
	{ contextMenuTemplate } = require(`${__dirname}/src/ui/MenuTemplates`),
	{ ipcRenderer, remote} = require('electron'),
	{ Menu } = remote;

let global_pane_id = null, 
	global_closest_element = null,
	upperSection = document.getElementById(cnst.UPPER_SECTION),
	opacitySlider = document.getElementById(cnst.OPACITY_SLIDER),
	projName = 'untitled',
	projPath = `${__dirname}/sketches/${projName}`, 
	encoding = 'utf-8';


function updateWindowOpacity(value) {
	ipcRenderer.invoke('update-opacity', value);
}

function initEventListeners() {	
	const menu = Menu.buildFromTemplate(contextMenuTemplate);

	window.addEventListener('contextmenu', (e) => {
		e.preventDefault()
		menu.popup({ window: remote.getCurrentWindow() })
	}, false);

	opacitySlider.oninput = (e) => { updateWindowOpacity(Number(e.target.value)) }
	
	document.onmouseup = (e) => { global_pane_id = null; }
	
	document.onmousemove = (e) => {
		if(global_pane_id !== null) repositionPane(e.movementX, e.movementY);
	}
}



function setPaneID(id) { global_pane_id = id; }

function setClosestID(element) {
	if(global_closest_element) global_closest_element.style.zIndex = '0';
	global_closest_element = element;
	global_closest_element.style.zIndex = '1';
}

function createPane(id, name) {
	let pane = new Pane(id, setPaneID, setClosestID, name);
	upperSection.appendChild(pane.body);
	return pane;
}


/*	01-29-2021
	Right now there isnt a lot of different setup involved with
	shader panes and the canvas pane, but if the complexity grows they can serve as
	wrappers around createPane to handle shared initialization stuff
	and then handle the specifics for shader panes/canvas panes
 */

/*
function createCanvasPane(id, name)
{
	return createPane(id, name);
}

function createShaderPane(id, name)
{
	return createPane(id, name);
}
*/



/*	02-01-2021
	There should be a sidebar listing open panes, clicking on name brings it to the forefront
 */



function renderProcess() {
	let paneManager = new PaneManager();
	let statusBar = new Pane(cnst.BOTTOM_PANE, document.getElementById(cnst.STATUS_BAR));
	let vertPane = createPane(cnst.VERT_PANE, 'Vertex Shader');
	let fragPane = createPane(cnst.FRAG_PANE, 'Frag Shader');
	let canvasPane = createPane(cnst.CANVAS_PANE, 'WebGL Canvas');
	let canvas = document.createElement('canvas');
	canvas.id = 'canvas';
	canvasPane.body.appendChild(canvas);
	// let canvasConfigTab = document.createElement('div');
	// canvasConfigTab.classList = ['tab-header'];
	// let drawModeSelect = document.createElement('select');
	
	// canvasConfigTab.innerHTML = 'Canvas Options';



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


	let vertFile = FileSys.getFileContents(`${projPath}/scratch.vert`, encoding );
	vertFile.then((data) => {vertCodeMirror.setValue(data)});	

	let fragFile = FileSys.getFileContents(`${projPath}/scratch.frag`, encoding );
	fragFile.then((data) => {fragCodeMirror.setValue(data)});	

	


	// TODO: This is a terrible way to handle this, abstract loading out into FileSys
	// use async await to get contents of files
	// fs.readFile(`${projPath}/scratch.vert`, { encoding }, ((err, data) => {
	// 	if(err) {
	// 		console.error(err)
	// 		return err;
	// 	}
	// 	if(data) {
	// 		/*	02-02-2021
	// 			Code Mirror sections shouldnt be loaded here, but I couldnt get async to work tonight :(
	// 		 */
	// 		vertShader = data.toString();
	// 		let vertCodeMirror = CodeMirror(vertPane.body, {
	// 			lineNumbers: true,
	// 			theme: 'ambiance',
	// 			spellcheck: true,
	// 			value: vertShader,
	// 		});
	// 	}
	// }));


	// it should be this simple-looking:
	// const vertShader = fileSys.getFileContents(`${projPath}/scratch.vert`, encoding);
	// (async() => {
	// 	const ret = await fileSys.getFileContents(`${projPath}/scratch.vert`, encoding);
	// 	if(ret) console.log(ret)
		

	// })
	// if(vertShader) console.log(vertShader)

	


	
	// vertPane.body.appendChild(canvasConfigTab);
	// canvasConfigTab.appendChild(drawModeSelect);

	initEventListeners();


	let clearOpacity = 0.1;
	
	glCanvas.glMain(clearOpacity);

}




function repositionPane(deltaX, deltaY) {
	let pane = document.getElementById(global_pane_id);
	
	let { offsetWidth, offsetHeight } = pane; 
	let { clientWidth, clientHeight } = document.body;

	let left =  window.scrollX + pane.getBoundingClientRect().left
	let top = window.scrollY + pane.getBoundingClientRect().top 

	let newLeft = left + deltaX;
	newLeft = Math.min(newLeft, clientWidth - offsetWidth); 
	newLeft = Math.max(newLeft, 0); 
	pane.style.left = `${newLeft}px`;

	let newTop = top + deltaY;
	newTop = Math.min(newTop, clientHeight - offsetHeight);
	newTop = Math.max(newTop, 0);
	pane.style.top = `${newTop}px`;
}
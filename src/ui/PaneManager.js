const Pane 	= require(`${__dirname}/Pane`).Pane,
	FileSys = require(`../utils/FileSys`);

let globalPaneID = null,
	globalClosestPane = null;


function setGlobalPaneID(id) { 
	globalPaneID = id; 
}

function setClosestPane(element) {
	if(globalClosestPane) globalClosestPane.style.zIndex = '0';
	globalClosestPane = element;
	globalClosestPane.style.zIndex = '1';
}

function repositionPane(deltaX, deltaY) {
	let pane = document.getElementById(globalPaneID);
	
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


function initPaneListeners() {
	document.onmouseup = (e) => { globalPaneID = null; }
	document.onmousemove = (e) => {
		if(globalPaneID !== null) {
			repositionPane(e.movementX, e.movementY);

		}
	}
}


function createCanvasPane(id, name) {
	return createPane(id, name);
}

function createShaderPane(id, name) {
	let pane = createPane(id, name);

	let debugSaveButton = document.createElement('button');
	debugSaveButton.innerHTML = 'Save';
	debugSaveButton.onclick = FileSys.saveFileChanges;

	let debugCompileButton = document.createElement('button');
	debugCompileButton.innerHTML = 'Compile';

	pane.root.appendChild(debugSaveButton);
	pane.root.appendChild(debugCompileButton);

	return pane;
}



function createPane(id, name) {
	let pane = new Pane(id, setGlobalPaneID, setClosestPane, name);
	return pane;
}

module.exports = 
{
	setGlobalPaneID,
	setClosestPane,
	createCanvasPane,
	createShaderPane,
	initPaneListeners 
}
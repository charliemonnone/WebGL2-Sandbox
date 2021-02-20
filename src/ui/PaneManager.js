const Constants = require('../Constants');

let globalPaneID = null,
	globalClosestPane = null,
	canvasSection = document.getElementById(Constants.css.CANVAS_SECTION);

class Pane {
	constructor(id, name, interactive = false) {
		/*
			S = save, C = compile, 
			| 	Header	| <- Pane header
			|___________| <- CodeMirror
			|___________| ...
			|___________| ...
			|___________| ...
			|		S C | <- Controls area
		*/

		this.id = id;
		// the pane element proper
		this.root = document.createElement('div');
		this.root.id = id;


		//  the pane header tab
		this.tab = document.createElement('div');
		this.tab.innerHTML = name;

		this.root.appendChild(this.tab);

		if(interactive) {
			this.root.className = 'interactive-pane';
			this.tab.className = 'interactive-tab-header';
			this.root.onmousedown = () => { setClosestPane(this.root) }
			this.tab.onmousedown = () => { 
				setClosestPane(this.root)
				setGlobalPaneID(this.id); 
			}; 
			this.saveButton = document.createElement('button');
			this.saveButton.innerHTML = 'Save';
		
			this.compileButton = document.createElement('button');
			this.compileButton.innerHTML = 'Compile';
		
			this.root.appendChild(this.saveButton);
			this.root.appendChild(this.compileButton);
		}
		else {
			this.root.className = 'static-pane';
			this.tab.className = 'static-tab-header';
		}

	}
}


function setGlobalPaneID(id) { globalPaneID = id; }

function setClosestPane(element) {
	if(globalClosestPane) globalClosestPane.style.zIndex = '0';
	globalClosestPane = element;
	globalClosestPane.style.zIndex = '1';
}

function repositionPane(deltaX, deltaY) {
	let pane = document.getElementById(globalPaneID);
	
	let { offsetWidth, offsetHeight } = pane; 
	
	let canvasLeft = canvasSection.getBoundingClientRect().left

	let { clientWidth, clientHeight } = document.body;
	let left =  window.scrollX + pane.getBoundingClientRect().left
	let top = window.scrollY + pane.getBoundingClientRect().top 

	let newLeft = left + deltaX;
	newLeft = Math.min(newLeft, clientWidth - offsetWidth); 
	newLeft = Math.max(newLeft, canvasLeft); 
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

function createShaderPane(id, name) {
	let pane = createPane(id, name, true);
	let { left } = canvasSection.getBoundingClientRect();
	pane.root.style.left = `${left}px`;
	return pane;
}

function createPane(id, name, interactive, options) {
	let pane = new Pane(id, name, interactive, options );
	return pane;
}

module.exports = {
	setGlobalPaneID,
	setClosestPane,
	createPane,
	createShaderPane,
	initPaneListeners 
}
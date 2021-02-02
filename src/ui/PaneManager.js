const Pane = require(`${__dirname}/Pane`).Pane;
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

/*
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


function createPane(id, name) {
	let pane = new Pane(id, setGlobalPaneID, setClosestPane, name);
	upperSection.appendChild(pane.body);
	return pane;
}

module.exports = 
{
	setGlobalPaneID,
	setClosestPane,
	createPane,
	initPaneListeners 
}
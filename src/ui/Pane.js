
class Pane {
	constructor(id, setGlobalPaneID, setClosestPane, name) {
		this.id = id;
		this.htmlElem = document.createElement('div');
		this.htmlElem.className = 'pane';
		this.htmlElem.id = id;
		this.htmlElem.onmousedown = () => {
			setClosestPane(this.htmlElem)
		}

		// this.body.onresize = () => {

		// }
		
		/*	01-29-2021
			this.body.onresize, maybe to similar testing to repositionPane()
		 */

		this.tab = document.createElement('div');
		this.tab.className = 'tab-header';
		this.tab.innerHTML = name;
		this.tab.onmousedown = () => { 
			setClosestPane(this.htmlElem)
			setGlobalPaneID(this.id); 
		}; 
		this.htmlElem.appendChild(this.tab);
		
	}
}
exports.Pane = Pane;
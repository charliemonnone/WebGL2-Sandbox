class Pane {
	constructor(id, setGlobalPaneID, setClosestPane, name) {
		this.id = id;
		this.body = document.createElement('div');
		this.body.className = 'pane';
		this.body.id = id;
		this.body.onmousedown = () => {
			setClosestPane(this.body)
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
			setClosestPane(this.body)
			setGlobalPaneID(this.id); 
		}; 
		this.body.appendChild(this.tab);
		
	}
}
exports.Pane = Pane;
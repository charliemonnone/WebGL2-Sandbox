
class Pane {
	constructor(id, setGlobalPaneID, setClosestPane, name) {

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
		this.root.className = 'pane';
		this.root.id = id;
		this.root.onmousedown = () => { setClosestPane(this.root) }

		let entries = [];

		//  the pane header tab
		this.tab = document.createElement('div');
		this.tab.className = 'tab-header';
		this.tab.innerHTML = name;
		this.tab.onmousedown = () => { 
			setClosestPane(this.root)
			setGlobalPaneID(this.id); 
		}; 
		this.root.appendChild(this.tab);
		

	}
}
exports.Pane = Pane;
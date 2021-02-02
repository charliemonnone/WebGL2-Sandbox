
/*	Application Menu	*/
const appMenuTemplate = 
[
	{
		label: 'File',
		submenu:
		[
			{ role: 'quit', }
		]
	},
	{
		label: 'Edit',
		submenu: 
		[
			{ role: 'undo' },
			{ role: 'redo' },
			{ type: 'separator' },
			{ role: 'cut' },
			{ role: 'copy' },
			{ role: 'paste' }
		]
	},
	{
		label: 'View',
		submenu: 
		[
			{ role: 'reload' },
			{ role: 'toggledevtools' },
			{ type: 'separator' },
			{ label: 'Toggle Status bar' },
		]
	},

	{
		role: 'window',
		submenu: 
		[
			{ role: 'minimize' },
			{ role: 'close' }
		]
	},
]

/*	Context Menu	 */
const contextMenuTemplate = 
[
	{
		label: 'Reload',
		accelerator: 'Control+R',
		role: 'reload'

	},
	{
		type: 'separator'
	},
	{
		label: 'Panes',
		submenu:
		[
			{ label: 'Vertex Shader' },
			{ label: 'Fragment Shader' },
			{ label: 'Canvas' }
		]
	}
		
]


module.exports = { appMenuTemplate, contextMenuTemplate };
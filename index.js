const { app, BrowserWindow, BrowserView } = require("electron");
const path = require('path');

function boot () {
	let win = new BrowserWindow({ width: 1800, height: 1600 })
	win.on('closed', () => {
	  win = null
	})

	let view = new BrowserView({
		webPreferences: {
			preload:  path.join(__dirname, 'preload.js')
		}
	})
	win.setBrowserView(view)
	view.setBounds({ x: 0, y: 0, width: 1800, height:1600 })
	// view.webContents.loadURL('https://www.bbc.com');
	view.webContents.loadURL('https://reddit.com');

	view.webContents.on("did-frame-finish-load", function (e, isMainFrame, frameProcessId, frameRoutingId) {
		console.log(`frame finished loading. main/process/routing ${isMainFrame}, ${frameProcessId}, ${frameRoutingId}`)


		view.webContents.send("from_mainland", {"command": "track_frame", "frameRoutingId": frameRoutingId, "isMainFrame": isMainFrame})
		if (isMainFrame) {
				setTimeout(_ => {
					view.webContents.send("from_mainland", {"command": "trigger_access"});
				}, 2000);

		}
	});
	view.webContents.openDevTools();
}

app.on("ready", boot);

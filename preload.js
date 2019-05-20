var electron = require("electron");
global.ipc = electron.ipcRenderer;
global.webFrame = electron.webFrame;

global.tracker = {};

ipc.on("from_mainland", function (sender, data) {
	if (data.command === "track_frame") {
		tracker[data.frameRoutingId] = {"isMainFrame": data.isMainFrame};
	} else if (data.command === "trigger_access") {
		console.log("triggering lookup of frames");

		let trackerKeys = Object.keys(tracker);
		trackerKeys.forEach(function (frameId) {
			frameId = parseInt(frameId);
			let frameData = tracker[frameId];

			try	{
					console.log("frameId is " + frameId);
					let fr = webFrame.findFrameByRoutingId(frameId);
					if (fr) {
						console.log(`frame ${frameId} detected, injectng script`);
						fr.executeJavaScript(`console.log(">>>>>>>>>>>> frame url is ", window.location.href);`);

						if (frameData.isMainFrame) {
							fr.firstChild.executeJavaScript(`console.log("first child url is ", window.location.href);`)
						}
					}
			} catch (e) {
				console.log("Error is " + e);
			}
		});
	}
});

let _canvasKit

async function getCanvasKit() {
	if (!_canvasKit) {
		_canvasKit = await window.CanvasKitInit({
		    locateFile: (file) => './canvaskit.wasm', 
		}).ready()
	}
	return _canvasKit
}

export default getCanvasKit
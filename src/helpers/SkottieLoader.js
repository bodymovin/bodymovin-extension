import {
	getSavedVersion,
	lockedMinorVersion,
} from './skottie/skottie'

let _canvasKit

const delay = async delay => {
	return new Promise(function(resolve, reject) {
		setTimeout(resolve, delay)
	})
}

async function loadCanvasJs() {
	if (!window.CanvasKitInit) {
		var scriptTag = document.createElement('script')
		let jsPath = ''
		const savedVersions = await getSavedVersion()
		if (savedVersions.length) {
			var lastVersion = savedVersions[savedVersions.length - 1]
			// jsPath = `http://localhost:${getPort()}/fileFromPath?path=${encodeURIComponent(jsFilePath)}&type=${encodeURIComponent('text/javascript; charset=UTF-8')}`
			jsPath = `https://unpkg.com/canvaskit-wasm@${lastVersion.version}/bin/full/canvaskit.js`
		} else {
			// jsPath = `http://localhost:${getPort()}/canvaskit.js`
			jsPath = `https://unpkg.com/canvaskit-wasm@${lockedMinorVersion.join('.')}/bin/full/canvaskit.js`
		}
		// jsPath = 'https://unpkg.com/canvaskit-wasm@latest/bin/full/canvaskit.js'
		scriptTag.src = jsPath
		scriptTag.id = 'canvasKitElement'
		document.body.appendChild(scriptTag)
		let isCanvasKitReady = false
		while(!isCanvasKitReady) {
			if (window.CanvasKitInit) {
				isCanvasKitReady = true
			} else {
				await delay(250)
			}
		}
	}
}

async function getCanvasKit() {
	if (!_canvasKit) {
		await loadCanvasJs()
		let wasmPath = ''
		const savedVersions = await getSavedVersion()
		if (savedVersions.length) {
			var lastVersion = savedVersions[savedVersions.length - 1]
			// var wasmFilePath = lastVersion.wasm
			// wasmPath = `http://localhost:${getPort()}/fileFromPath?path=${encodeURIComponent(wasmFilePath)}&type=${encodeURIComponent('application/wasm')}`
			wasmPath = `https://unpkg.com/canvaskit-wasm@${lastVersion.version}/bin/full/canvaskit.wasm`
		} else {
			// wasmPath = `http://localhost:${getPort()}/canvaskit.wasm`
			wasmPath = `https://unpkg.com/canvaskit-wasm@${lockedMinorVersion.join('.')}/bin/full/canvaskit.wasm`
		}
		_canvasKit = await window.CanvasKitInit({
		    locateFile: (file) => wasmPath, 
		})
	}
	return _canvasKit
}

export default getCanvasKit
import {
	getSavedVersion
} from './skottie/skottie'
import { getPort } from './enums/networkData'

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
			var jsFilePath = lastVersion.js
			jsPath = `http://localhost:${getPort()}/fileFromPath?path=${jsFilePath}&type=${encodeURIComponent('text/javascript; charset=UTF-8')}`
		} else {
			jsPath = `http://localhost:${getPort()}/canvaskit.js`
		}
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
			var wasmFilePath = lastVersion.wasm
			wasmPath = `http://localhost:${getPort()}/fileFromPath?path=${wasmFilePath}&type=${encodeURIComponent('application/wasm')}`
		} else {
			wasmPath = `http://localhost:${getPort()}/canvaskit.wasm`
		}
		_canvasKit = await window.CanvasKitInit({
		    locateFile: (file) => wasmPath, 
		})
	}
	return _canvasKit
}

export default getCanvasKit
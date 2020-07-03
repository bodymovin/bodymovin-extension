import {
	getSavedVersion
} from './skottie/skottie'

let _canvasKit

const delay = async delay => {
	return new Promise(function(resolve, reject) {
		setTimeout(resolve, delay)
	})
}

async function loadCanvasJs() {
	const savedVersions = await getSavedVersion()
	if (savedVersions.length) {
		var lastVersion = savedVersions[savedVersions.length - 1]
		var jsFilePath =  lastVersion.js
		console.log(jsFilePath)
		var scriptTag = document.createElement('script')
		scriptTag.src = `http://localhost:3119/fileFromPath?path=${jsFilePath}&type=${encodeURIComponent('text/javascript; charset=UTF-8')}`
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
	console.log('getCanvasKit')
	if (!_canvasKit) {
		await loadCanvasJs()
		let wasmPath = ''
		const savedVersions = await getSavedVersion()
		if (savedVersions.length) {
			var lastVersion = savedVersions[savedVersions.length - 1]
			var wasmFilePath = lastVersion.wasm
			wasmPath = `http://localhost:3119/fileFromPath?path=${wasmFilePath}&type=${encodeURIComponent('application/wasm')}`
		} else {
			wasmPath = 'http://localhost:3119/canvaskit.wasm'
		}
		_canvasKit = await window.CanvasKitInit({
		    locateFile: (file) => wasmPath, 
		}).ready()
	}
	return _canvasKit
}

export default getCanvasKit
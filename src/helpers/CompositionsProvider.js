import csInterface from './CSInterfaceHelper'
import extensionLoader from './ExtensionLoader'
import {dispatcher} from './storeDispatcher'
import actions from '../redux/actions/actionTypes'
import {versionFetched, appVersionFetched} from '../redux/actions/generalActions'
import bodymovin2Avd from 'bodymovin-to-avd'

csInterface.addEventListener('bm:compositions:list', function (ev) {
	if(ev.data) {
		let compositions = (typeof ev.data === "string") ? JSON.parse(ev.data) : ev.data
		dispatcher({ 
				type: actions.COMPOSITIONS_UPDATED,
				compositions: compositions
		})
	} else {
	}
})

csInterface.addEventListener('bm:render:complete', function (ev) {
	//console.log('COMPLETE RENDER')
	if(ev.data) {
		let id = ev.data
		dispatcher({ 
				type: actions.RENDER_COMPLETE,
				id: id
		})
	} else {
	}
})

csInterface.addEventListener('bm:render:start', function (ev) {
	/*if(ev.data) {
		let id = ev.data
		dispatcher({ 
				type: actions.RENDER_COMPLETE,
				id: id
		})
	} else {
	}*/
	//console.log('STARTED RENDER')
})

csInterface.addEventListener('console:log', function (ev) {
	console.log('LOGGING:', ev.data)
		dispatcher({ 
				type: actions.GENERAL_LOG,
				data: ev.data
		})
})

csInterface.addEventListener('bm:render:update', function (ev) {
	if(ev.data) {
		let data = (typeof ev.data === "string") ? JSON.parse(ev.data) : ev.data
		dispatcher({ 
				type: actions.RENDER_UPDATE,
				data: data
		})
	} else {
	}
})

csInterface.addEventListener('bm:render:fonts', function (ev) {
	if(ev.data) {
		let data = (typeof ev.data === "string") ? JSON.parse(ev.data) : ev.data
		if(typeof data.fonts === "string") {
			data.fonts = JSON.parse(data.fonts)
		}
		dispatcher({ 
				type: actions.RENDER_FONTS,
				data: data
		})
		//browserHistory.push('/fonts')
	} else {
	}
})

csInterface.addEventListener('bm:image:process', function (ev) {
	if(ev.data) {
		let data = (typeof ev.data === "string") ? JSON.parse(ev.data) : ev.data
		
		//Fix for AE 2014
		if(data && data.should_compress === 'false') {
			data.should_compress = false
		}
		if(data && data.should_encode_images === 'false') {
			data.should_encode_images = false

		}
		if(data && typeof data.compression_rate === 'string') {
			data.compression_rate = Number(data.compression_rate)
		}
		//End fix for AE 2014

		dispatcher({ 
				type: actions.RENDER_PROCESS_IMAGE,
				data: data
		})
		//browserHistory.push('/fonts')
	} else {
	}
})

csInterface.addEventListener('bm:project:id', function (ev) {
	if(ev.data) {
		let data = (typeof ev.data === "string") ? JSON.parse(ev.data) : ev.data
		let id = data.id
		dispatcher({ 
				type: actions.PROJECT_SET_ID,
				id: id
		})
	} else {
	}
})

csInterface.addEventListener('bm:composition:destination_set', function (ev) {
	if(ev.data) {
		let compositionData = (typeof ev.data === "string") ? JSON.parse(ev.data) : ev.data
		dispatcher({ 
				type: actions.COMPOSITION_SET_DESTINATION,
				compositionData: compositionData
		})
	} else {
	}
})

csInterface.addEventListener('bm:create:avd', function (ev) {
	if(ev.data) {
		let animationData = (typeof ev.data === "string") ? JSON.parse(ev.data) : ev.data;
		animationData.layers = (typeof animationData.layers === "string") ? JSON.parse(animationData.layers) :  animationData.layers;
		animationData.assets = (typeof animationData.assets === "string") ? JSON.parse(animationData.assets) :  animationData.assets;
		//let animationData = (typeof data.animationData === "string") ? JSON.parse(data.animationData) : data.animationData;
		saveAVD(animationData);
	} else {
	}
})

csInterface.addEventListener('bm:alert', function (ev) {
	if(ev.data) {
		let data = (typeof ev.data === "string") ? JSON.parse(ev.data) : ev.data
		dispatcher({ 
				type: actions.WRITE_ERROR,
				pars: data.message.split('<br />')
		})
	} else {
	}
})

csInterface.addEventListener('bm:version', function (ev) {
	if(ev.data) {
		let data = (typeof ev.data === "string") ? JSON.parse(ev.data) : ev.data
		dispatcher(versionFetched(data.value))
	} else {
	}
})

csInterface.addEventListener('app:version', function (ev) {
	if(ev.data) {
		let data = (typeof ev.data === "string") ? JSON.parse(ev.data) : ev.data
		dispatcher(appVersionFetched(data.value))
	} else {
	}
})

function getCompositions() {
	let prom = new Promise(function(resolve, reject){
		extensionLoader.then(function(){
			csInterface.evalScript('$.__bodymovin.bm_compsManager.updateData()');
			resolve();
		})
	})
	return prom
}

function getDestinationPath(comp, alternatePath) {
	let destinationPath = ''
	if(comp.absoluteURI) {
		destinationPath = comp.absoluteURI
	} else if(alternatePath) {
		alternatePath = alternatePath.split('\\').join('\\\\')
		if(comp.settings.standalone) {
			alternatePath += 'data.js'
		} else {
			alternatePath += 'data.json'
		}
		destinationPath = alternatePath
	}
	extensionLoader.then(function(){
		var eScript = '$.__bodymovin.bm_compsManager.searchCompositionDestination(' + comp.id + ',"' + destinationPath+ '",' + comp.settings.standalone + ')'
		csInterface.evalScript(eScript)
	})
	let prom = new Promise(function(resolve, reject){
		resolve()
	})
	return prom
}

function renderNextComposition(comp) {
	extensionLoader.then(function(){
		var eScript = '$.__bodymovin.bm_compsManager.renderComposition(' + JSON.stringify(comp) + ')'
		csInterface.evalScript(eScript)
	})
	let prom = new Promise(function(resolve, reject){
		resolve()
	})
	return prom
}

function stopRenderCompositions() {
	extensionLoader.then(function(){
		var eScript = '$.__bodymovin.bm_compsManager.cancel()'
		csInterface.evalScript(eScript)
	})
	let prom = new Promise(function(resolve){
		resolve()
	})
	return prom
}

function setFonts(fontsInfo) {
	let prom = new Promise(function(resolve, reject){
		resolve()
	})
	var fontsInfoString = JSON.stringify({list:fontsInfo})

	extensionLoader.then(function(){
	    var eScript = '$.__bodymovin.bm_renderManager.setFontData(' + fontsInfoString + ')'
	    csInterface.evalScript(eScript)
	})
	return prom
}

function openInBrowser(url) {
	csInterface.openURLInDefaultBrowser(url)
	//csInterface.openURLInDefaultBrowser(url);
}

function getPlayer(gzipped) {
	let gzippedString = gzipped ? 'true' : 'false'
	extensionLoader.then(function(){
		var eScript = '$.__bodymovin.bm_downloadManager.getPlayer(' + gzippedString + ')';
	    csInterface.evalScript(eScript);
	})
}

function goToFolder(path) {
	extensionLoader.then(function(){
		var eScript = '$.__bodymovin.bm_compsManager.browseFolder("' + path.split('\\').join('\\\\') + '")';
	    csInterface.evalScript(eScript);
	})
}

function saveAVD(data) {
	bodymovin2Avd(data).then(function(avdData){
		var eScript = "$.__bodymovin.bm_dataManager.saveAVDData('" + avdData + "')";
	    csInterface.evalScript(eScript);
	}).catch(function(){
		extensionLoader.then(function(){
			var eScript = '$.__bodymovin.bm_dataManager.saveAVDFailed()';
			csInterface.evalScript(eScript);
		})
		dispatcher({ 
				type: actions.RENDER_AVD_FAILED
		})
	})
}

function getVersionFromExtension() {
	let prom = new Promise(function(resolve, reject){
		resolve()
	})
	extensionLoader.then(function(){
		var eScript = '$.__bodymovin.bm_renderManager.getVersion()';
	    csInterface.evalScript(eScript);
	})
	return prom
}

function imageProcessed(result) {
	extensionLoader.then(function(){
		var eScript = '$.__bodymovin.bm_sourceHelper.imageProcessed(';
		eScript += result.compressed;
		eScript += ',';
		if(result.encoded) {
			eScript += '"' + result.encoded_data + '"'
		} else {
			eScript += 'null';
		}
		eScript += ')';
	    csInterface.evalScript(eScript);
	})
}

export {
	getCompositions,
	getDestinationPath,
	renderNextComposition,
	stopRenderCompositions,
	setFonts,
	openInBrowser,
	getPlayer,
	goToFolder,
	getVersionFromExtension,
	imageProcessed,
	saveAVD
}
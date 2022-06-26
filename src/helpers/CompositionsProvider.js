import csInterface, {
	sendAsyncCommand,
	sendCommandWithListeners,
	getXMPValue,
} from './CSInterfaceHelper'
import extensionLoader from './ExtensionLoader'
import {dispatcher} from './storeDispatcher'
import actions from '../redux/actions/actionTypes'
import {versionFetched, appVersionFetched} from '../redux/actions/generalActions'
import {reportsSaved} from '../redux/actions/reportsActions'
import {processExpression} from '../redux/actions/renderActions'
import {saveFile as bannerSaveFile} from './bannerHelper'
import {saveFile as avdSaveFile} from './avdHelper'
import {saveFile as smilSaveFile} from './smilHelper'
import {splitAnimation} from './splitAnimationHelper'
import { getSimpleSeparator } from './osHelper'

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
		const id = data.id
		const name = data.name
		dispatcher({ 
				type: actions.PROJECT_SET_ID,
				id: id,
				name: name,
		})
	} else {
	}
})

csInterface.addEventListener('bm:temp:id', function (ev) {
	if(ev.data) {
		let data = (typeof ev.data === "string") ? JSON.parse(ev.data) : ev.data
		let id = data.id
		dispatcher({ 
				type: actions.PROJECT_SET_TEMP_ID,
				id: id
		})
	} else {
	}
})

csInterface.addEventListener('bm:project:path', function (ev) {

	if (ev.data) {
		let data = (typeof ev.data === "string") ? JSON.parse(ev.data) : ev.data
		let path = data.path
		dispatcher({ 
				type: actions.PROJECT_SET_PATH,
				path: path
		})
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

csInterface.addEventListener('bm:create:avd', async function (ev) {
	if(ev.data) {
		try {
			let data = (typeof ev.data === "string") ? JSON.parse(ev.data) : ev.data;
			await avdSaveFile(data.origin, data.destination)
			// let animationData = JSON.parse(data.animation);
			// saveAVD(animationData, data.destination);
			const eScript = "$.__bodymovin.bm_avdExporter.saveAVDDataSuccess()";
	    	csInterface.evalScript(eScript);
		} catch(err) {
	    	const eScript = '$.__bodymovin.bm_avdExporter.saveAVDFailed()';
	    	csInterface.evalScript(eScript);
		} 
	} else {
	}
})

csInterface.addEventListener('bm:create:smil', async function (ev) {
	if(ev.data) {
		try {
			let data = (typeof ev.data === "string") ? JSON.parse(ev.data) : ev.data;
			await smilSaveFile(data.origin, data.destination)
			const eScript = "$.__bodymovin.bm_smilExporter.saveSMILDataSuccess()";
	    	csInterface.evalScript(eScript);
		} catch(err) {
	    	const eScript = '$.__bodymovin.bm_smilExporter.saveSMILFailed()';
	    	csInterface.evalScript(eScript);
		} 
	} else {
	}
})

csInterface.addEventListener('bm:create:rive', function (ev) {
	if(ev.data) {
		let data = (typeof ev.data === "string") ? JSON.parse(ev.data) : ev.data;
		dispatcher({ 
				type: actions.RIVE_SAVE_DATA,
				origin: data.origin,
				destination: data.destination,
				fileName: decodeURIComponent(data.fileName),
		})
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

csInterface.addEventListener('bm:zip:banner', async function (ev) {
	try {
		if(ev.data) {
			const data = (typeof ev.data === "string") ? JSON.parse(ev.data) : ev.data
			////
			await bannerSaveFile(data.folderPath, data.destinationPath);
			csInterface.evalScript('$.__bodymovin.bm_bannerExporter.bannerFinished()');
		} else {
			throw new Error('Missing data')
		}
	} catch(err) {
		csInterface.evalScript('$.__bodymovin.bm_bannerExporter.bannerFailed()');
	}
})

csInterface.addEventListener('bm:split:animation', async function (ev) {
	try {
		if(ev.data) {
			const data = (typeof ev.data === "string") ? JSON.parse(ev.data) : ev.data
			////
			const splitResponse = await splitAnimation(data.origin, data.destination, decodeURIComponent(data.fileName), data.time);
			csInterface.evalScript('$.__bodymovin.bm_standardExporter.splitSuccess(' + splitResponse + ')');
		} else {
			throw new Error('Missing data')
		}
	} catch(err) {
		csInterface.evalScript('$.__bodymovin.bm_bannerExporter.splitFailed()');
	}
})

csInterface.addEventListener('bm:report:saved', async function (ev) {
	try {
		if(ev.data) {
			const data = (typeof ev.data === "string") ? JSON.parse(ev.data) : ev.data
			////
			dispatcher(reportsSaved(data.compId, data.reportPath));
		} else {
			throw new Error('Missing data')
		}
	} catch(err) {
		csInterface.evalScript('$.__bodymovin.bm_bannerExporter.splitFailed()');
	}
})

csInterface.addEventListener('bm:expression:process', async function (ev) {
	try {
		if(ev.data) {
			const data = (typeof ev.data === "string") ? JSON.parse(ev.data) : ev.data
			////
			dispatcher(processExpression(data));
		} else {
			throw new Error('Missing data')
		}
	} catch(err) {
		csInterface.evalScript('$.__bodymovin.bm_bannerExporter.splitFailed()');
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

function getProjectPath() {
	let prom = new Promise(function(resolve, reject){
		extensionLoader.then(function(){
			csInterface.evalScript('$.__bodymovin.bm_projectManager.getProjectPath()');
			resolve();
		})
	})
	return prom
}

function setLottiePaths(paths) {
	return new Promise(function(resolve, reject){
		extensionLoader.then(function(){
			
			var eScript = '$.__bodymovin.bm_bannerExporter.setLottiePaths(' + JSON.stringify(paths) + ')';
			csInterface.evalScript(eScript);
			resolve();
		})
	})
}

function getDestinationPath(comp, alternatePath, shouldUseCompNameAsDefault) {
	let destinationPath = ''
	const fileName = shouldUseCompNameAsDefault ? comp.name : 'data'
	if(comp.absoluteURI) { 
		destinationPath = comp.absoluteURI
	} else if(alternatePath) {
		alternatePath = alternatePath.split('\\').join('\\\\')
		const delimiter = getSimpleSeparator()
		if (alternatePath.charAt(alternatePath.length - 1) !== delimiter) {
			alternatePath += delimiter;
		}
		alternatePath += fileName
		if(comp.settings.export_modes.standalone) {
			alternatePath += '.js'
		} else if (comp.settings.export_modes.banner && comp.settings.banner.zip_files) {
			alternatePath += '.zip'
		} else {
			alternatePath += '.json'
		}
		destinationPath = alternatePath
	}
	var extension = 'json'
	if (comp.settings.export_modes.standalone) {
		extension = 'js'
	} else if (comp.settings.export_modes.banner && comp.settings.banner.zip_files) {
		extension = 'zip'
	}
	extensionLoader.then(function(){
		var eScript = '$.__bodymovin.bm_compsManager.searchCompositionDestination(' + comp.id + ',"' + destinationPath+ '","' + (fileName + '.' + extension) + '")'
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

function riveFileSaveSuccess() {
	extensionLoader.then(function(){
		var eScript = '$.__bodymovin.bm_riveExporter.saveSuccess()';
	    csInterface.evalScript(eScript);
	})
}

function riveFileSaveFailed() {
	extensionLoader.then(function(){
		var eScript = '$.__bodymovin.bm_riveExporter.saveFailed()';
	    csInterface.evalScript(eScript);
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

function imageProcessed(result, data) {
	extensionLoader.then(function(){
		var eScript = ''
		if(data.assetType === 'audio') {
			eScript += '$.__bodymovin.bm_audioSourceHelper.assetProcessed(';

		} else {
			eScript += '$.__bodymovin.bm_sourceHelper.imageProcessed(';
		}
		eScript += result.extension === 'jpg';
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

function initializeServer() {
	csInterface.requestOpenExtension("com.bodymovin.bodymovin_server", "");
}

function navigateToLayer(compositionId, layerIndex) {
	extensionLoader.then(function(){
		var eScript = `
		$.__bodymovin.bm_compsManager.navigateToLayer(${compositionId},${layerIndex})
	    `
	    csInterface.evalScript(eScript);
	})
}

async function getCompositionTimelinePosition() {
	return sendCommandWithListeners(
		'$.__bodymovin.bm_compsManager.getTimelinePosition',
		[],
		'bm:composition:timelinePosition',
		''
	);
}

async function setCompositionTimelinePosition(progress) {
	return sendAsyncCommand(
		'$.__bodymovin.bm_compsManager.setTimelinePosition',
		[progress],
	)
	
}

function expressionProcessed(id, data) {
	sendAsyncCommand(
		'$.__bodymovin.bm_expressionHelper.saveExpression',
		[data, id],
	)
}

async function getUserFolders() {
	return sendCommandWithListeners(
		'$.__bodymovin.bm_projectManager.getUserFolders',
		[],
		'bm:user:folders',
		''
	)
}

async function getSavingPath(path) {
	return sendCommandWithListeners(
		'$.__bodymovin.bm_projectManager.setDestinationPath',
		[
			path,
		],
		'bm:destination:selected',
		'bm:destination:cancelled'
	)
}

async function saveProjectDataToXMP(data) {
	return new Promise(async function(resolve, reject) {
		var eScript = '$.__bodymovin.bm_XMPHelper.setMetadata("config", \'' + JSON.stringify(data) + '\')';
		csInterface.evalScript(eScript);
		setStorageLocation('xmp');
		resolve();
	})
}

async function getProjectDataFromXMP() {
	return getXMPValue(
		"config",
		true,
	)
}

async function setStorageLocation(location) {
	return sendAsyncCommand(
		'$.__bodymovin.bm_XMPHelper.setMetadata',
		["storageLocation", location],
	)
}

async function getStorageLocation() {
	return getXMPValue(
		"storageLocation",
		false,
	)
}

async function getCompressedState() {
	try {
		const isCompressed = await getXMPValue(
			"isCompressed",
			false,
		)
		return isCompressed;
	} catch (error) {
		return false;
	}
}

async function setCompressedState(value) {
	return sendAsyncCommand(
		'$.__bodymovin.bm_XMPHelper.setMetadata',
		["isCompressed", value],
	)
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
	setLottiePaths,
	initializeServer,
	riveFileSaveSuccess,
	riveFileSaveFailed,
	getProjectPath,
	navigateToLayer,
	getCompositionTimelinePosition,
	setCompositionTimelinePosition,
	getUserFolders,
	expressionProcessed,
	getSavingPath,
	saveProjectDataToXMP,
	getProjectDataFromXMP,
	setStorageLocation,
	getStorageLocation,
	getCompressedState,
	setCompressedState,
}
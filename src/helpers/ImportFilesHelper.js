import csInterface from './CSInterfaceHelper'
import loadLottieData from './FileLoader'
import random from './randomGenerator'
import {hexToRgbAsNormalizedArray} from './colorConverter'

function sendCommand(commandName, commandArguments = []) {
	const prefix = '$.__bodymovin.bm_lottieImporter.'
	let command = prefix + commandName
	command += '('
	commandArguments.forEach((commandArgument, index) => {
		if (typeof commandArgument === 'string') {
			command += '"'	
			command += commandArgument	
			command += '"'	
		} else if (typeof commandArgument === 'object') {
			command += JSON.stringify(commandArgument)	
		} else {
			command += commandArgument	
		}
		if (index !== commandArguments.length - 1) {
			command += ','	
		}
	})
	command += ')'
	// csInterface.evalScript(command);
	console.log('SENT')
	console.log(command)
}

function createFolder(name = '') {
	sendCommand('createFolder', [name]);
}

function createComp(name, width, height, duration, compId) {
	sendCommand('createComp', [name, width, height, duration, compId]);
}

function createSolid(layerData, compId) {
	const layerId = random(10);
	layerData.__importId = layerId;
	const color = hexToRgbAsNormalizedArray(layerData.sc);
	sendCommand('createSolid', [
		color, 
		layerData.nm, 
		layerData.sw, 
		layerData.sw, layerData.op - layerData.ip, 
		layerId, 
		compId
	]);
	processTransform(layerData.ks, layerId)
}

function processTransform(transformData, layerId) {
	console.log(transformData)
	if (transformData.p) {
		if (transformData.p.k) {
			if (typeof transformData.p.k[0] === 'number') {
				sendCommand('setElementPosition', [transformData.p.k.filter((val, i) => i < 2), layerId]);
			} else {
				console.log(transformData.p.k)
			}
		}
	}
}

function createLayer(layerData, compId) {
	switch (layerData.ty) {
		case 1:
		createSolid(layerData, compId)
	}
}

function iterateLayers(layers, compId) {
	layers.forEach(layer => {
		createLayer(layer, compId)
	})
}


async function convertLottieFileFromPath(path) {
	try {
		sendCommand('reset');
		const lottieData = await loadLottieData(path)
		console.log('lottieData', lottieData)
		sendCommand('setFrameRate', [lottieData.fr]);
		createFolder(lottieData.nm)
		const mainCompId = random(10);
		createComp(lottieData.nm, lottieData.w, lottieData.h, lottieData.op - lottieData.ip, mainCompId);
		iterateLayers(lottieData.layers, mainCompId, lottieData.fr);
		// csInterface.evalScript('$.__bodymovin.bm_lottieImporter.importFromPath("' + encodeURIComponent(path) + '")');
	} catch(err) {
		console.log('ERRR')
		console.log(err)
	}
}

export {
	convertLottieFileFromPath
}
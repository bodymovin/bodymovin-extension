import loadLottieData from '../../FileLoader'
import random from '../../randomGenerator'
import {hexToRgbAsNormalizedArray} from '../../colorConverter'
import sendCommand from './commandHelper'
import processTransform from './transform'
import {setFrameRate} from './frameRateHelper'

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
		layerData.sh, 
		layerData.op - layerData.ip, 
		layerId, 
		compId
	]);
	processTransform(layerData.ks, layerId)
}

function createNull(layerData, compId) {
	const layerId = random(10);
	layerData.__importId = layerId;
	sendCommand('createNull', [
		layerData.op - layerData.ip, 
		layerId, 
		compId
	]);
	processTransform(layerData.ks, layerId)
}

function createLayer(layerData, compId) {
	switch (layerData.ty) {
		case 1:
		createSolid(layerData, compId)
		break;
		case 3:
		createNull(layerData, compId)
		break;
	}
}

function findLayerByIndex(layers, index) {
	return layers.find(layer => layer.ind === index)
}

function iterateLayers(layers, compId) {
	layers
	.reverse()
	.forEach(layer => {
		createLayer(layer, compId)
	})
	// Iterating twice so all layers have been created
	layers
	.forEach(layer => {
		if ('parent' in layer) {
			const parentLayer = findLayerByIndex(layers, layer.parent);
			sendCommand('setLayerParent', [layer.__importId, parentLayer.__importId]);
		}
	})
}


async function convertLottieFileFromPath(path) {
	try {
		sendCommand('reset');
		const lottieData = await loadLottieData(path)
		console.log('lottieData', lottieData)
		setFrameRate(lottieData.fr);
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
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

function createCompositionLayer(layerData, parentCompId, assets) {
	const compositionSourceData = assets.find(asset => asset.id === layerData.refId)
	if (!compositionSourceData.__created) {
		compositionSourceData.__created = true;
		const sourceCompId = random(10);
		compositionSourceData.__sourceId = sourceCompId;
		createComp(layerData.nm, layerData.w, layerData.h, layerData.op - layerData.ip, sourceCompId);
		iterateLayers(compositionSourceData.layers, sourceCompId, assets);
	}
	const layerId = random(10);
	sendCommand('addComposition', [
		compositionSourceData.__sourceId, 
		parentCompId,
		layerId,
	]);
	processTransform(layerData.ks, layerId)
	// console.log('createCompositionLayer', layerData)
	// console.log('createCompositionLayer', parentCompId)
	// console.log('createCompositionLayer', assets)
	// console.log('compositionLayers', compositionLayers)
}

function skipLayer(layerData) {
	console.log('SKIPPING LAYER: ', layerData)
}

function createLayer(layerData, compId, assets) {
	console.log(layerData)
	switch (layerData.ty) {
		case 0:
		createCompositionLayer(layerData, compId, assets);
		break;
		case 1:
		createSolid(layerData, compId)
		break;
		case 3:
		createNull(layerData, compId)
		break;
		default:
		skipLayer(layerData, compId)
	}
}

function findLayerByIndex(layers, index) {
	return layers.find(layer => layer.ind === index)
}

function iterateLayers(layers, compId, assets) {
	layers
	.reverse()
	.forEach(layer => {
		createLayer(layer, compId, assets)
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

function createCompositions(assets) {
	console.log(assets)
	assets.filter(asset => 'layers' in asset)
	.forEach(composition => {
		console.log(composition)
		// createComp(composition)
	})
}


async function convertLottieFileFromPath(path) {
	try {
		sendCommand('reset');
		const lottieData = await loadLottieData(path)
		console.log('lottieData', lottieData)
		setFrameRate(lottieData.fr);
		sendCommand('setFrameRate', [lottieData.fr]);
		createCompositions(lottieData.assets);
		createFolder(lottieData.nm)
		const mainCompId = random(10);
		createComp(lottieData.nm, lottieData.w, lottieData.h, lottieData.op - lottieData.ip, mainCompId);
		iterateLayers(lottieData.layers, mainCompId, lottieData.assets);
		// csInterface.evalScript('$.__bodymovin.bm_lottieImporter.importFromPath("' + encodeURIComponent(path) + '")');
	} catch(err) {
		console.log('ERRR')
		console.log(err)
	}
}

export {
	convertLottieFileFromPath
}
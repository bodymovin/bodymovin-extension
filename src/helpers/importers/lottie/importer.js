import loadLottieData from '../../FileLoader'
import random from '../../randomGenerator'
import {hexToRgbAsNormalizedArray} from '../../colorConverter'
import sendCommand, {registerUpdate, registerEnd, clear as clearCommands} from './commandHelper'
import {reset as resetAlerts} from './alertsHelper'
import processTransform from './transform'
import processShape from './shape'
import processMasks from './mask'
import {setFrameRate} from './frameRateHelper'

const _updateListeners = [];
const _endListeners = [];
const _failedListeners = [];

function _onUpdate(pendingCommands) {
	_updateListeners.forEach(listener => listener({
		state: 'processing',
		pendingCommands: pendingCommands,
	}))
}

function _onEnd() {
	_endListeners.forEach(listener => listener({
		state: 'ended'
	}))
}

function _onFailed(error) {
	_endListeners.forEach(listener => listener({
		state: 'failed',
		error,
	}))
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
		layerData.sh, 
		layerData.op - layerData.ip, 
		layerId, 
		compId
	]);
	processLayerExtraProps(layerData, layerId);
	processTransform(layerData.ks, layerId);
	processMasks(layerData.masksProperties, layerId);
}

function createNull(layerData, compId) {
	const layerId = random(10);
	layerData.__importId = layerId;
	sendCommand('createNull', [
		layerData.op - layerData.ip, 
		layerId, 
		compId
	]);
	processLayerExtraProps(layerData, layerId);
	processTransform(layerData.ks, layerId);
}

function createShapeLayer(layerData, compId) {
	const layerId = random(10);
	layerData.__importId = layerId;
	sendCommand('createShapeLayer', [
		layerId, 
		compId
	]);
	processLayerExtraProps(layerData, layerId);
	processShape(layerData, layerId);
	processTransform(layerData.ks, layerId);
}

function createCompositionLayer(layerData, parentCompId, assets) {
	const compositionSourceData = assets.find(asset => asset.id === layerData.refId)
	if (!compositionSourceData.__created) {
		compositionSourceData.__created = true;
		const sourceCompId = random(10);
		compositionSourceData.__sourceId = sourceCompId;
		createComp(layerData.nm, layerData.w, layerData.h, 9999, sourceCompId);
		iterateLayers(compositionSourceData.layers, sourceCompId, assets);
	}
	const layerId = random(10);
	sendCommand('addComposition', [
		compositionSourceData.__sourceId, 
		parentCompId,
		layerId,
	]);
	processLayerExtraProps(layerData, layerId);
	processTransform(layerData.ks, layerId);
}

function processLayerExtraProps(layerData, layerId) {

	if (layerData.st !== 0) {
		sendCommand('setLayerStartTime', [
			layerId,
			layerData.st, 
		]);
	}
	if (layerData.sr !== 1) {
		sendCommand('setLayerStretch', [
			layerId,
			layerData.sr * 100, 
		]);
	}
	if (layerData.ip !== 0) {
		sendCommand('setLayerInPoint', [
			layerId,
			layerData.ip, 
		]);
	}
	sendCommand('setLayerOutPoint', [
		layerId,
		layerData.op, 
	]);
}

function skipLayer(layerData) {
	console.log('SKIPPING LAYER: ', layerData)
}

function createLayer(layerData, compId, assets) {
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
		case 4:
		createShapeLayer(layerData, compId)
		break;
		default:
		skipLayer(layerData, compId)
	}
}

function findLayerByIndexProperty(layers, index) {
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
			const parentLayer = findLayerByIndexProperty(layers, layer.parent);
			sendCommand('setLayerParent', [layer.__importId, parentLayer.__importId]);
		}

		if ('tt' in layer) {
			sendCommand('setTrackMatte', [layer.__importId, layer.tt]);
		}
	})
}

function registerHandlers(onUpdate, onEnd, onFailed) {

	registerUpdate(_onUpdate);
	registerEnd(_onEnd);
	_updateListeners.push(onUpdate);
	_endListeners.push(onEnd);
	_failedListeners.push(onFailed);
}

function reset() {
	_updateListeners.length = 0;
	_endListeners.length = 0;
	_failedListeners.length = 0;
	resetAlerts();
	clearCommands();
}

async function convertFromPath(path, onUpdate, onEnd, onFailed) {
	try {
		reset();
		registerHandlers(onUpdate, onEnd, onFailed);
		sendCommand('reset');
		const lottieData = await loadLottieData(path);
		setFrameRate(lottieData.fr);
		sendCommand('setFrameRate', [lottieData.fr]);
		createFolder(lottieData.nm)
		const mainCompId = random(10);
		createComp(lottieData.nm, lottieData.w, lottieData.h, lottieData.op - lottieData.ip, mainCompId);
		iterateLayers(lottieData.layers, mainCompId, lottieData.assets);
		// csInterface.evalScript('$.__bodymovin.bm_lottieImporter.importFromPath("' + encodeURIComponent(path) + '")');
	} catch(err) {
		_onFailed(err)
	}
}

function cancelImport() {
	reset();
}

export {
	convertFromPath,
	cancelImport,
}
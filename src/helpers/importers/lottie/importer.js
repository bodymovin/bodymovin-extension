import loadLottieData from '../../FileLoader'
import random from '../../randomGenerator'
import {hexToRgbAsNormalizedArray} from '../../colorConverter'
import sendCommand, {registerUpdate, registerEnd, clear as clearCommands} from './commandHelper'
import {reset as resetAlerts} from './alertsHelper'
import processTransform from './transform'
import processShape from './shape'
import processText from './text'
import processMasks from './mask'
import {setFrameRate} from './frameRateHelper'
import {
	add as addAlert,
	get as getAlerts,
	setLayer,
	pushComp,
	popComp,
} from './alertsHelper'
import {
	importLottieAssetsFromPath,
	importLottieAssetsFromUrl,
} from './assets'

const _updateListeners = [];
const _endListeners = [];
const _failedListeners = [];
let _hasEnded = false;
let currentConversionId;

function _onUpdate(pendingCommands) {
	_updateListeners.forEach(listener => listener({
		state: 'processing',
		pendingCommands: pendingCommands,
	}))
}

function _onEnd() {
	if (_hasEnded) {
		const alerts = getAlerts()
		_endListeners.forEach(listener => listener({
			state: 'ended',
			alerts
		}))
	}
}

function _onFailed(error) {
	_failedListeners.forEach(listener => listener({
		state: 'failed',
		message: (error && error.message) ? error.message : 'There has been an error' ,
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

function createImageLayer(layerData, compId, assets) {
	const imageSourceData = assets.find(asset => asset.id === layerData.refId)
	const layerId = random(10);
	layerData.__importId = layerId;
	sendCommand('addImageLayer', [
		imageSourceData.__sourceId,
		compId,
		layerId
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
	processMasks(layerData.masksProperties, layerId);
}

function createTextLayer(layerData, compId) {
	const layerId = random(10);
	layerData.__importId = layerId;
	sendCommand('createTextLayer', [
		layerId, 
		compId,
	]);
	processLayerExtraProps(layerData, layerId);
	processText(layerData.t, layerId)
	processTransform(layerData.ks, layerId);
	processMasks(layerData.masksProperties, layerId);
	addAlert({type: 'message', message: 'Text layers are not fully supported'});
}

function createCompositionLayer(layerData, parentCompId, assets) {
	const compositionSourceData = assets.find(asset => asset.id === layerData.refId)
	if (!compositionSourceData.__created) {
		compositionSourceData.__created = true;
		const sourceCompId = random(10);
		compositionSourceData.__sourceId = sourceCompId;
		createComp(layerData.nm, layerData.w, layerData.h, 9999, sourceCompId);
		pushComp(layerData.nm);
		iterateLayers(compositionSourceData.layers, sourceCompId, assets);
		popComp(layerData.nm);
	}
	const layerId = random(10);
	layerData.__importId = layerId;
	sendCommand('addComposition', [
		compositionSourceData.__sourceId, 
		parentCompId,
		layerId,
	]);
	processLayerExtraProps(layerData, layerId);
	processTransform(layerData.ks, layerId);
	processMasks(layerData.masksProperties, layerId);
}

function processLayerExtraProps(layerData, layerId) {

	if (layerData.ip - layerData.st !== 0) {
		sendCommand('setLayerInPoint', [
			layerId,
			layerData.ip - layerData.st, 
		]);
	}
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
	if (layerData.nm) {
		sendCommand('setLayerName', [
			layerId,
			encodeURIComponent(layerData.nm), 
		]);
	}
	if (layerData.hd === true) {
		sendCommand('setElementAsDisabled', [
			layerId,
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
	setLayer(layerData.nm);
	switch (layerData.ty) {
		case 0:
		createCompositionLayer(layerData, compId, assets);
		break;
		case 1:
		createSolid(layerData, compId);
		break;
		case 2:
		createImageLayer(layerData, compId, assets);
		break;
		case 3:
		createNull(layerData, compId);
		break;
		case 4:
		createShapeLayer(layerData, compId);
		break;
		case 5:
		createTextLayer(layerData, compId);
		break;
		default:
		skipLayer(layerData, compId);
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

function addFootageToMainFolder(assets) {
	var footageIds = (assets || [])
	.filter(asset => asset.id && asset.w && asset.__sourceId)
	.map(asset => asset.__sourceId)

	if (footageIds.length) {
		sendCommand('addFootageToMainFolder', [footageIds]);
	}
}

function reset() {
	_hasEnded = false;
	_updateListeners.length = 0;
	_endListeners.length = 0;
	_failedListeners.length = 0;
	currentConversionId = '';
	resetAlerts();
	clearCommands();
}

async function convert(lottieData, onUpdate, onEnd, onFailed) {
	setFrameRate(lottieData.fr);
	sendCommand('setFrameRate', [lottieData.fr]);
	pushComp(lottieData.nm || 'Main Comp');
	createFolder(lottieData.nm);
	const mainCompId = random(10);
	addFootageToMainFolder(lottieData.assets);
	createComp(lottieData.nm, lottieData.w, lottieData.h, lottieData.op - lottieData.ip, mainCompId);
	iterateLayers(lottieData.layers, mainCompId, lottieData.assets);
}

async function loadLottieDataFromUrl(path) {
	const jsonDataResonse = await fetch(path, 
	{
		method: 'get',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		}
	})
	const jsonData = await jsonDataResonse.json()
	return jsonData;
}

async function convertFromUrl(path, onUpdate, onEnd, onFailed) {
	let _localConversionId = random(10);
	try {
		reset();
		currentConversionId = _localConversionId;
		registerHandlers(onUpdate, onEnd, onFailed);
		sendCommand('reset');
		const lottieData = await loadLottieDataFromUrl(path);
		await importLottieAssetsFromUrl(lottieData.assets, path);
		await convert(lottieData, onUpdate, onEnd, onFailed);
		_hasEnded = true;
	} catch(err) {
		if (currentConversionId === _localConversionId) {
			_onFailed(err);
			reset();
		}
	}
}

async function convertFromPath(path, onUpdate, onEnd, onFailed) {
	let _localConversionId = random(10);
	try {
		reset();
		currentConversionId = _localConversionId;
		registerHandlers(onUpdate, onEnd, onFailed);
		sendCommand('reset');
		const lottieData = await loadLottieData(path);
		await importLottieAssetsFromPath(lottieData.assets, path);
		await convert(lottieData, onUpdate, onEnd, onFailed);
		_hasEnded = true;
	} catch(err) {
		if (currentConversionId === _localConversionId) {
			_onFailed(err);
			reset();
		}
	}
}

function cancelImport() {
	reset();
}

export {
	convertFromPath,
	convertFromUrl,
	cancelImport,
}
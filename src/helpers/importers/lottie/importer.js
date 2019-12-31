import csInterface from '../../CSInterfaceHelper'
import loadLottieData from '../../FileLoader'
import random from '../../randomGenerator'
import {hexToRgbAsNormalizedArray} from '../../colorConverter'

var _frameRate = 0;

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
	csInterface.evalScript(command);
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
	if (transformData.p) {
		if (transformData.p.k) {
			if (typeof transformData.p.k[0] === 'number') {
				sendCommand('setElementTransformValue', ['position', transformData.p.k.filter((val, i) => i < 2), layerId]);
			} else {
				const keyframes = transformData.p.k;
				keyframes.forEach(keyframe => {
					sendCommand('setElementTransformKey', 
						[
							'position', 
							keyframe.t,
							keyframe.s.filter((val, i) => i < 2), 
							layerId
						]
					);
				})
				keyframes.forEach(keyframe => {
					/*sendCommand('setElementTransformTemporalKey', 
						[
							'position', 
							keyframe.t,
							keyframe.s.filter((val, i) => i < 2), 
							layerId
						]
					);*/
					console.log(keyframe)
				})
			}
		}

		if (transformData.r.k) {
			if (typeof transformData.r.k === 'number') {
				sendCommand('setElementTransformValue', ['rotation', transformData.r.k, layerId]);
			} else {
				const keyframes = transformData.r.k;
				console.log(keyframes)
				keyframes.forEach(keyframe => {
					sendCommand('setElementTransformKey', 
						[
							'rotation', 
							keyframe.t,
							keyframe.s, 
							layerId
						]
					);
				})
				const easings = []
				keyframes.forEach((keyframe, index) => {
					console.log('=========')
					var nextKeyIndex = index === keyframes.length - 1 ? 0 : index + 1
					console.log('nextKeyIndex', nextKeyIndex)
					if (!easings[index]) {
						easings[index] = []
					}
					if (!easings[index + 1]) {
						easings[index + 1] = []
					}
					if (keyframe.i && keyframe.o) {
						var nextKeyframe = {
							i: {x:[0.833], y:[0.833]},
							o: {x:[0.167], y:[0.167]},
							...keyframes[nextKeyIndex]
						};
						// bezierIn.x[k] = 1 - key.easeIn[k].influence / 100;
						// bezierOut.x[k] = lastKey.easeOut[k].influence / 100;
						var keyInInfluence = (keyframe.i.x[0] - 1) * -100;
						var lastKeyOutInfluence = (keyframe.o.x[0]) * 100;
						var duration = (nextKeyframe.t - keyframe.t) / _frameRate;
						console.log('index', index)
						// console.log('duration', duration)
						// console.log('duration by FR', duration / _frameRate)
						// yNormal = (key.value[k] - lastKey.value[k]);
						var yNormal = keyframes[index + 1].s[0] - keyframe.s[0];
						console.log(yNormal)

						var bezierInY = -(keyframe.i.y[0] - 1) * yNormal / duration;
						var bezierY = keyframe.o.y[0] * yNormal / duration;
						// console.log('bezierInY', bezierInY)
						// console.log('bezierY', bezierY)

						var lastKeyOutSpeed = bezierY / lastKeyOutInfluence * 100;
						var keyInSpeed = bezierInY / keyInInfluence * 100;
						console.log('lastKeyOutInfluence', lastKeyOutInfluence)
						console.log('lastKeyOutSpeed', lastKeyOutSpeed)
						console.log('keyInInfluence', keyInInfluence)
						console.log('keyInSpeed', keyInSpeed)


						// var bezierY = (lastKey.easeOut[k].speed*lastKey.easeOut[k].influence/100);
						// var bezierInY = (key.easeIn[k].speed*key.easeIn[k].influence/100);
						// bezierIn.y[k] = 1 - (bezierInY*duration)/yNormal;
						// bezierOut.y[k] = (bezierY*duration)/yNormal;

						
						easings[index][0] = [lastKeyOutSpeed, lastKeyOutInfluence]
						easings[index + 1][1] = [keyInSpeed, keyInInfluence]

						// var inKey = [keyInSpeed, keyInInfluence];
						// var outKey = [lastKeyOutSpeed, lastKeyOutInfluence];
						// sendCommand('setElementTemporalKeyAtIndex', 
						// 	[
						// 		'rotation', 
						// 		index + 1,
						// 		inKey, 
						// 		outKey,
						// 		layerId
						// 	]
						// );
					}
					console.log(keyframe)
				})
				easings.pop()
				easings[0][1] = [62, 16]
				easings[easings.length - 1][0] = [14, 16]
				console.log(easings);
				easings.forEach((easing, index) => {
					sendCommand('setElementTemporalKeyAtIndex', 
						[
							'rotation', 
							index + 1,
							easing[1], 
							easing[0],
							layerId
						]
					);
				})
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
		// console.log('lottieData', lottieData)
		_frameRate = lottieData.fr;
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
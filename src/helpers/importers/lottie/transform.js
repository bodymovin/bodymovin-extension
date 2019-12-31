import sendCommand from './commandHelper'
import {getFrameRate} from './frameRateHelper'

function addKeyframes(keyframes, propertyName, elementId) {
	console.log(keyframes)
	keyframes.forEach(keyframe => {
		sendCommand('setElementTransformKey', 
			[
				propertyName, 
				keyframe.t,
				keyframe.s, 
				elementId
			]
		);
	})
	const inSpeeds = []
	const inInfluences = []
	const outSpeeds = []
	const outInfluences = []
	const totalDimensions = Array.isArray(keyframes[0].i.x) ? keyframes[0].i.x.length : 1;
	keyframes.forEach((keyframe, index) => {
		if (keyframe.i && keyframe.o) {
			outSpeeds[index] = []
			outInfluences[index] = []
			inSpeeds[index + 1] = []
			inInfluences[index + 1] = []
			const inX = Array.isArray(keyframe.i.x) ? keyframe.i.x : [keyframe.i.x]
			inX.forEach((arrayElement, dimension) => {
				const inXDimension = Array.isArray(keyframe.i.x) ? keyframe.i.x[dimension] : keyframe.i.x;
				const inYDimension = Array.isArray(keyframe.i.y) ? keyframe.i.y[dimension] : keyframe.i.y;
				const outXDimension = Array.isArray(keyframe.o.x) ? keyframe.o.x[dimension] : keyframe.o.x;
				const outYDimension = Array.isArray(keyframe.o.y) ? keyframe.o.y[dimension] : keyframe.o.y;
				var nextKeyframe = keyframes[index + 1];
				var keyInInfluence = (inXDimension - 1) * -100;
				var lastKeyOutInfluence = (outXDimension) * 100;
				var duration = (nextKeyframe.t - keyframe.t) / getFrameRate();
				var yNormal = keyframes[index + 1].s[dimension] - keyframe.s[dimension];

				var bezierInY = -(inYDimension - 1) * yNormal / duration;
				var bezierY = outYDimension * yNormal / duration;

				var lastKeyOutSpeed = bezierY / lastKeyOutInfluence * 100;
				var keyInSpeed = bezierInY / keyInInfluence * 100;
				outSpeeds[index].push(lastKeyOutSpeed);
				outInfluences[index].push(lastKeyOutInfluence);
				inSpeeds[index + 1].push(keyInSpeed);
				inInfluences[index + 1].push(keyInInfluence);
			})

		}
	})

	var fillingArray = [];
	for(let i = 0; i < totalDimensions; i += 1) {
		fillingArray.push(1);
		
	}
	inSpeeds[0] = fillingArray;
	inInfluences[0] = fillingArray;
	outSpeeds.push(fillingArray);
	outInfluences.push(fillingArray);
	
	inSpeeds.forEach((easing, index) => {
		sendCommand('setElementTemporalKeyAtIndex', 
			[
				propertyName, 
				index + 1,
				inInfluences[index],
				inSpeeds[index], 
				outInfluences[index],
				outSpeeds[index], 
				elementId
			]
		);
	})
}

function processTransform(transformData, elementId) {
	if (transformData.p) {
		if (transformData.p && transformData.p.k) {
			if (typeof transformData.p.k[0] === 'number') {
				sendCommand('setElementTransformValue', ['position', transformData.p.k, elementId]);
			} else {
				console.log(transformData.p.k)
				addKeyframes(transformData.p.k, 'position', elementId)
			}
		}

		if (transformData.r && 'k' in transformData.r) {
			if (typeof transformData.r.k === 'number') {
				sendCommand('setElementTransformValue', ['rotation', transformData.r.k, elementId]);
			} else {
				addKeyframes(transformData.r.k, 'rotation', elementId)
			}
		}

		if (transformData.s && 'k' in transformData.s) {
			if (typeof transformData.s.k[0] === 'number') {
				sendCommand('setElementTransformValue', ['scale', transformData.s.k, elementId]);
			} else {
				// console.log(transformData.s)
				addKeyframes(transformData.s.k, 'scale', elementId)
			}
		}

		if (transformData.a && 'k' in transformData.a) {
			if (typeof transformData.a.k[0] === 'number') {
				sendCommand('setElementTransformValue', ['anchorPoint', transformData.a.k, elementId]);
			} else {
				// console.log(transformData.s)
				addKeyframes(transformData.a.k, 'anchorPoint', elementId)
			}
		}

		if (transformData.o && 'k' in transformData.o) {
			if (typeof transformData.o.k === 'number') {
				sendCommand('setElementTransformValue', ['opacity', transformData.o.k, elementId]);
			} else {
				addKeyframes(transformData.o.k, 'opacity', elementId)
			}
		}
	}
}

export default processTransform;
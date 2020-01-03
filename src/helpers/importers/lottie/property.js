import sendCommand from './commandHelper'
import {getFrameRate} from './frameRateHelper'

function formatProperty(property) {
	// This solves keyframed paths that are defined as an array of a single shape
	if (Array.isArray(property) && typeof property[0] === 'object' && 'i' in property[0]) {
		return property[0];
	}
	return property;
}

function addKeyframes(keyframes, propertyName, elementId) {
	console.log(keyframes)
	keyframes.forEach(keyframe => {
		sendCommand('setElementKey', 
			[
				propertyName, 
				keyframe.t,
				formatProperty(keyframe.s), 
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

const processProperty = (propertyName, propertyData, elementId, defaultValue) => {
	if (typeof propertyData === 'number' || typeof propertyData === 'string') {
		sendCommand('setElementPropertValue', [propertyName, propertyData, elementId]);
	} else if (propertyData && 'k' in propertyData) {
		if (typeof propertyData.k === 'number' || !Array.isArray(propertyData.k)) {
			if (defaultValue !== propertyData.k) {
				sendCommand('setElementPropertValue', [propertyName, formatProperty(propertyData.k), elementId]);
			}
		} else if (Array.isArray(propertyData.k) && typeof propertyData.k[0] === 'number') {
			let differentIndex = propertyData.k.findIndex((value, index) => defaultValue === undefined || defaultValue[index] !== value);
			if (differentIndex !== -1) {
				sendCommand('setElementPropertValue', [propertyName, propertyData.k, elementId]);
			}
		} else {
			addKeyframes(propertyData.k, propertyName, elementId)
		}
	}
}

export default processProperty
import sendCommand from './commandHelper'
import processProperty from './property'
import random from '../../randomGenerator'

function processTransform(transformData, elementId) {

	const transformId = random(10);
	sendCommand('assignIdToProp', ['transform', transformId, elementId])

	if (transformData.p) {
		if (transformData.p.s) {
			sendCommand('separateDimensions', [elementId]);
			processProperty('ADBE Position_0', transformData.p.x, transformId);
			processProperty('ADBE Position_1', transformData.p.y, transformId);
			if (transformData.p.z) {
				processProperty('ADBE Position_2', transformData.p.z, transformId);
			}
		} else {
			processProperty('Position', transformData.p, transformId);
		}
	}

	if (transformData.r) {
		processProperty('Rotation', transformData.r, transformId, 0);
	}

	if (transformData.rx) {
		processProperty('ADBE Rotate X', transformData.rx, transformId, 0);
	}

	if (transformData.ry) {
		processProperty('ADBE Rotate Y', transformData.ry, transformId, 0);
	}

	if (transformData.rz) {
		processProperty('ADBE Rotate Z', transformData.rz, transformId, 0);
	}

	if (transformData.s) {
		processProperty('Scale', transformData.s, transformId, [100, 100]);
	}

	if (transformData.a) {
		processProperty('Anchor Point', transformData.a, transformId);
	}

	if (transformData.o) {
		processProperty('Opacity', transformData.o, transformId);
	}

	if (transformData.so) {
		processProperty('Start Opacity', transformData.so, transformId);
	}

	if (transformData.eo) {
		processProperty('End Opacity', transformData.eo, transformId);
	}

	if (transformData.sk) {
		processProperty('Skew', transformData.sk, transformId, 0);
	}

	if (transformData.sa) {
		processProperty('Skew Axis', transformData.sa, transformId, 0);
	}

}

export default processTransform;
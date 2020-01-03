import sendCommand from './commandHelper'
import processProperty from './property'
import random from '../../randomGenerator'

function processTransform(transformData, elementId) {

	const transformId = random(10);
	sendCommand('assignIdToProp', ['transform', transformId, elementId])

	if (transformData.p) {
		if (transformData.p) {
			processProperty('Position', transformData.p, transformId);
		}

		if (transformData.r) {
			processProperty('Rotation', transformData.r, transformId, 0);
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
	}
}

export default processTransform;
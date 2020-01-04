import sendCommand from './commandHelper'
import processProperty from './property'
import random from '../../randomGenerator'

function createMask(maskData, elementId) {
	var maskId = random(10);
	sendCommand('createMask', [maskId, elementId, maskData.mode, maskData.inv]);
	processProperty('Mask Opacity', maskData.o, maskId, 100);
	processProperty('Mask Expansion', maskData.x, maskId, 0);
	if (maskData.f) {
		processProperty('Mask Feather', maskData.f, maskId, 0);
	}
	processProperty('maskShape', maskData.pt, maskId, null);
}

function processMasks(masks, elementId) {
	if (masks && masks.length) {
		masks.forEach((mask) => createMask(mask, elementId))
	}
}

export default processMasks;
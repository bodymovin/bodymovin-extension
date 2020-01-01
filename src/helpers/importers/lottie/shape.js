import sendCommand from './commandHelper'
import processTransform from './transform'
import {getFrameRate} from './frameRateHelper'
import random from '../../randomGenerator'
import processProperty from './property'

const groupHandler = (data, parentId) => {
	console.log('group');
	console.log(data, parentId);
	const groupId = random(10);
	sendCommand('createShapeGroup', [groupId, parentId]);
	iterateShapes(data.it, groupId); // eslint-disable-line no-use-before-define
}

const transformHandler = (data, parentId) => {
	processTransform(data, parentId);
}

const rectangleHandler = (data, parentId) => {
	const rectId = random(10);
	sendCommand('createRectangle', [rectId, parentId]);
	processProperty('Size', data.s, rectId, [100, 100]);
	processProperty('Position', data.p, rectId, [0, 0]);
	processProperty('Roundness', data.r, rectId, 0);
	console.log(data)
}

const fillHandler = (data, parentId) => {
	const id = random(10);
	sendCommand('createFill', [id, parentId]);
	processProperty('Color', data.c, id);
	processProperty('Opacity', data.o, id, 100);
	processProperty('Fill Rule', data.r, id);
	// TODO: Blend mode
	console.log(data)
}

const shapeHandlers = {
	gr: groupHandler,
	rc: rectangleHandler,
	fl: fillHandler,
	tr: transformHandler,
}
const iterateShapes = (shapes, parentId) => {
	shapes.forEach(shape => {
		if (shapeHandlers[shape.ty]) {
			shapeHandlers[shape.ty](shape, parentId)
		} else {
			console.log('TYPE NOT HANDLED: ', shape.ty);
		}
	})
}

const processShape = (layerData, layerId) => {
	iterateShapes(layerData.shapes, layerId)
}

export default processShape
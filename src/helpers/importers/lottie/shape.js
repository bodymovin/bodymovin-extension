import sendCommand from './commandHelper'
import {add as addAlert} from './alertsHelper'
import processTransform from './transform'
import random from '../../randomGenerator'
import processProperty from './property'
import gradientAlert from './alerts/gradientAlert'

const groupHandler = (data, parentId) => {
	const groupId = random(10);
	sendCommand('createShapeGroup', [groupId, parentId]);

	processProperty('name', encodeURIComponent(data.nm), groupId);
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
	processProperty('name', encodeURIComponent(data.nm), rectId);
}

const fillHandler = (data, parentId) => {
	const id = random(10);
	sendCommand('createFill', [id, parentId]);
	processProperty('Color', data.c, id);
	processProperty('Opacity', data.o, id, 100);
	processProperty('Fill Rule', data.r, id);
	processProperty('name', encodeURIComponent(data.nm), id);
	// TODO: Blend mode
}

const strokeHandler = (data, parentId) => {
	const id = random(10);
	sendCommand('createStroke', [id, parentId]);
	processProperty('Color', data.c, id);
	processProperty('Opacity', data.o, id, 100);
	processProperty('Stroke Width', data.w, id, 1);
	processProperty('Line Cap', data.lc, id, 1);
	processProperty('Line Join', data.lj, id, 1);
	if (data.lj === 1) {
		processProperty('Miter Limit', data.ml, id, 4);
	}
	processProperty('name', encodeURIComponent(data.nm), id);
	//TODO: dashes
}

const ellipseHandler = (data, parentId) => {
	const id = random(10);
	sendCommand('createEllipse', [id, parentId]);
	processProperty('Shape Direction', data.d, id);
	processProperty('Size', data.s, id, [100, 100]);
	processProperty('Position', data.p, id, [0, 0]);
	processProperty('name', encodeURIComponent(data.nm), id);
}

const starHandler = (data, parentId) => {
	const id = random(10);
	sendCommand('createStar', [id, parentId]);
	processProperty('Type', data.sy, id, 1);
	processProperty('Shape Direction', data.d, id, 1);
	processProperty('Points', data.pt, id, 5);
	processProperty('Position', data.p, id, [0, 0]);
	processProperty('Rotation', data.r, id, 0);
	if (data.sy === 1) {
		processProperty('Inner Radius', data.ir, id, 50);
		processProperty('Inner Roundness', data.is, id, 0);
	}
	processProperty('Outer Radius', data.or, id, 100);
	processProperty('Outer Roundness', data.os, id, 0);
	processProperty('name', encodeURIComponent(data.nm), id);
	
}

const shapeHandler = (data, parentId) => {
	const id = random(10);
	sendCommand('createShape', [id, parentId]);
	processProperty('ADBE Vector Shape', data.ks, id, null);
	// TODO: Blend mode
}

const repeaterHandler = (data, parentId) => {
	const id = random(10);
	sendCommand('createRepeater', [id, parentId]);
	processProperty('Copies', data.c, id);
	processProperty('Offset', data.o, id, 0);
	processProperty('Composite', data.m, id);
	processProperty('name', encodeURIComponent(data.nm), id);
	processTransform(data.tr, id);
}

const roundedCornersHandler = (data, parentId) => {
	const id = random(10);
	sendCommand('createRoundedCorners', [id, parentId]);
	processProperty('Radius', data.r, id);
	processProperty('name', encodeURIComponent(data.nm), id);
}

const trimPathHandler = (data, parentId) => {
	const id = random(10);
	sendCommand('createTrimPath', [id, parentId]);
	processProperty('Start', data.s, id, 0);
	processProperty('End', data.e, id, 100);
	processProperty('Offset', data.o, id, 0);
	processProperty('Trim Multiple Shapes', data.m, id);
	processProperty('name', encodeURIComponent(data.nm), id);

}

const gradientFillHandler = (data, parentId) => {
	const id = random(10);
	sendCommand('createGradientFill', [id, parentId]);
	processProperty('Colors', data.g.k, id, 100);
	processProperty('Opacity', data.o, id, 100);
	processProperty('Fill Rule', data.r, id, 1);
	processProperty('Blend Mode', data.bm, id, 0);
	processProperty('Start Point', data.s, id, [0,0]);
	processProperty('End Point', data.e, id, [100,0]);
	processProperty('Type', data.t, id, 1);
	if(data.t === 2){
		processProperty('Highlight Length', data.h, id, 0);
		processProperty('Highlight Angle', data.a, id, 0);
	}
	addAlert(gradientAlert(data));
	//
	processProperty('name', data.nm, id);

}

const gradientStrokeHandler = (data, parentId) => {
	const id = random(10);
	sendCommand('createGradientStroke', [id, parentId]);
	processProperty('Colors', data.g.k, id, 100);
	processProperty('Opacity', data.o, id, 100);
	processProperty('Stroke Width', data.w, id, 2);
	processProperty('Fill Rule', data.r, id, 1);
	processProperty('Blend Mode', data.bm, id, 0);
	processProperty('Start Point', data.s, id, [0,0]);
	processProperty('End Point', data.e, id, [100,0]);
	processProperty('Type', data.t, id, 1);
	if (data.t === 2){
		processProperty('Highlight Length', data.h, id, 0);
		processProperty('Highlight Angle', data.a, id, 0);
	}
	processProperty('Line Cap', data.lc, id, 1);
	processProperty('Line Join', data.lj, id, 1);
	if (data.lj === 1) {
		processProperty('Miter Limit', data.ml2, id, 4);
	}
	processProperty('name', encodeURIComponent(data.nm), id);

	addAlert(gradientAlert(data));
	//TODO: dashes

}

const shapeHandlers = {
	gr: groupHandler,
	rc: rectangleHandler,
	fl: fillHandler,
	tr: transformHandler,
	sh: shapeHandler,
	st: strokeHandler,
	el: ellipseHandler,
	sr: starHandler,
	rp: repeaterHandler,
	rd: roundedCornersHandler,
	tm: trimPathHandler,
	gf: gradientFillHandler,
	gs: gradientStrokeHandler,
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
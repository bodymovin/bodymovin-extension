import actionTypes from './actionTypes'

function initialize() {
	return {
		type: actionTypes.ANNOTATIONS_INITIALIZE
	}
}

function finalize() {
	return {
		type: actionTypes.ANNOTATIONS_FINALIZE
	}
}

function layersListFetched(layers) {
	return {
		type: actionTypes.ANNOTATIONS_LAYERS_LIST_FETCHED,
		layers,
	}
}

function annotationsListFetched(annotations) {
	return {
		type: actionTypes.ANNOTATIONS_LIST_FETCHED,
		annotations,
	}
}

function activateAnnotations(layerId, annotationId) {
	return {
		type: actionTypes.ANNOTATIONS_LAYER_ACTIVATE_ANNOTATIONS,
		layerId,
		annotationId,
	}
}

export {
	initialize,
	finalize,
	layersListFetched,
	activateAnnotations,
	annotationsListFetched,
}
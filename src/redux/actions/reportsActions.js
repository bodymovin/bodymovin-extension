import actionTypes from './actionTypes'

function navigateToLayer(layerIndex, compId) {
	return {
		type: actionTypes.REPORTS_LAYER_NAVIGATION,
		compId,
		layerIndex,
	}
}

export {
	navigateToLayer,
}
import actionTypes from './actionTypes'

function navigateToLayer(layerIndex, compId) {
	return {
		type: actionTypes.REPORTS_LAYER_NAVIGATION,
		compId,
		layerIndex,
	}
}

function reportsSaved(compId, reportPath) {
	return {
		type: actionTypes.REPORTS_SAVED,
		compId,
		reportPath,
	}
}

function reportsLoaded(data) {
	return {
		type: actionTypes.REPORTS_LOAD_SUCCESS,
		data,
	}
}

function reportsLoadFailed() {
	return {
		type: actionTypes.REPORTS_LOAD_FAILED,
	}
}

export {
	navigateToLayer,
	reportsSaved,
	reportsLoaded,
	reportsLoadFailed,
}
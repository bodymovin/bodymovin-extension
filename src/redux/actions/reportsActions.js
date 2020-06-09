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

function renderersUpdated(renderers) {
	return {
		type: actionTypes.REPORTS_RENDERERS_UPDATED,
		renderers,
	}
}

function messagesUpdated(messageTypes) {
	return {
		type: actionTypes.REPORTS_MESSAGES_UPDATED,
		messageTypes,
	}
}

export {
	navigateToLayer,
	reportsSaved,
	reportsLoaded,
	reportsLoadFailed,
	renderersUpdated,
	messagesUpdated,
}
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

function reportsLoadFailed(error) {
	return {
		type: actionTypes.REPORTS_LOAD_FAILED,
		error,
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

function importSelected() {
	return {
		type: actionTypes.REPORTS_IMPORT_SELECTED,
	}
}

function alertDismissed() {
	return {
		type: actionTypes.REPORTS_ALERT_DISMISSED,
	}
}

export {
	navigateToLayer,
	reportsSaved,
	reportsLoaded,
	reportsLoadFailed,
	renderersUpdated,
	messagesUpdated,
	importSelected,
	alertDismissed,
}
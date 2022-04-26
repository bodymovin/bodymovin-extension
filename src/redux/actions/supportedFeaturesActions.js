import actionTypes from './actionTypes'

function initialize() {
	return {
		type: actionTypes.SUPPORTED_FEATURES_INITIALIZE
	}
}

function finalize() {
	return {
		type: actionTypes.SUPPORTED_FEATURES_FINALIZE,
	}
}

function featuresLoaded(features) {
	return {
		type: actionTypes.SUPPORTED_FEATURES_LOAD_SUCCESS,
    features,
	}
}

function featuresLoadFailed(features) {
	return {
		type: actionTypes.SUPPORTED_FEATURES_LOAD_FAILED,
    features,
	}
}

function featuresSelectionUpdated(features) {
	return {
		type: actionTypes.SUPPORTED_FEATURES_SELECTION_UPDATED,
    features,
	}
}

export {
	initialize,
	finalize,
  featuresLoaded,
  featuresLoadFailed,
  featuresSelectionUpdated,
}
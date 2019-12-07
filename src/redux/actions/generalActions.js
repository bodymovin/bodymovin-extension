import actionTypes from './actionTypes'

function hideAlert() {
	return {
		type: actionTypes.ALERT_HIDE
	}
}

function versionFetched(version) {
	return {
		type: actionTypes.VERSION_FETCHED,
		version: version
	}
}

function appVersionFetched(version) {
	return {
		type: actionTypes.APP_VERSION_FETCHED,
		version: version
	}
}

function appInitialized() {
	return {
		type: actionTypes.APP_INITIALIZED,
	}
}

function appFocused() {
	return {
		type: actionTypes.APP_FOCUSED,
	}
}

export {
	hideAlert,
	versionFetched,
	appVersionFetched,
	appInitialized,
	appFocused,
}
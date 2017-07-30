import actionTypes from './actionTypes'

function hideAlert() {
	return {
		type: actionTypes.ALERT_HIDE
	}
}
function getPaths() {
	return {
		type: actionTypes.PATHS_GET
	}
}

function getVersion() {
	return {
		type: actionTypes.VERSION_GET
	}
}

function versionFetched(version) {
	return {
		type: actionTypes.VERSION_FETCHED,
		version: version
	}
}

export {
	hideAlert,
	getPaths,
	getVersion,
	versionFetched
}
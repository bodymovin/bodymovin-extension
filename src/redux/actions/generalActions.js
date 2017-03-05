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

export {
	hideAlert,
	getPaths
}
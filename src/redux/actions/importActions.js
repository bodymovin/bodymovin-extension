import actionTypes from './actionTypes'

function importLottieFile() {
	return {
		type: actionTypes.IMPORT_LOTTIE_IMPORT_FILE
	}
}

function importLeave() {
	return {
		type: actionTypes.IMPORT_LEAVE
	}
}

function lottieProcessStart() {
	return {
		type: actionTypes.IMPORT_LOTTIE_PROCESS_START
	}
}

function lottieProcessUpdate(data) {
	return {
		type: actionTypes.IMPORT_LOTTIE_PROCESS_UPDATE,
		data,
	}
}

function lottieProcessEnd(data) {
	return {
		type: actionTypes.IMPORT_LOTTIE_PROCESS_END,
		data,
	}
}

function lottieProcessFailed(error) {
	return {
		type: actionTypes.IMPORT_LOTTIE_PROCESS_FAILED,
		error,
	}
}

function lottieProcessCancel() {
	return {
		type: actionTypes.IMPORT_LOTTIE_PROCESS_CANCEL
	}
}

export {
	importLottieFile,
	importLeave,
	lottieProcessStart,
	lottieProcessUpdate,
	lottieProcessEnd,
	lottieProcessCancel,
	lottieProcessFailed,
}
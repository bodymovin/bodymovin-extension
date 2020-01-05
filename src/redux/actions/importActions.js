import actionTypes from './actionTypes'

function importLottieFile() {
	return {
		type: actionTypes.IMPORT_LOTTIE_IMPORT_FILE
	}
}

function importLottieFileFromUrl(path) {
	return {
		type: actionTypes.IMPORT_LOTTIE_LOAD_URL,
		path
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

function lottieImportFileSuccess(path) {
	return {
		type: actionTypes.IMPORT_LOTTIE_IMPORT_FILE_SUCCESS,
		path
	}
}

function lottieImportFileFailed() {
	return {
		type: actionTypes.IMPORT_LOTTIE_IMPORT_FILE_FAILED,
	}
}

function nasaImageLoaded(data) {
	return {
		type: actionTypes.NASA_IMAGE_LOADED,
		data,
	}
}

function catFactLoaded(data) {
	return {
		type: actionTypes.CAT_FACT_LOADED,
		data,
	}
}

export {
	importLottieFile,
	importLottieFileFromUrl,
	importLeave,
	lottieProcessStart,
	lottieProcessUpdate,
	lottieProcessEnd,
	lottieProcessCancel,
	lottieProcessFailed,
	lottieImportFileSuccess,
	lottieImportFileFailed,
	nasaImageLoaded,
	catFactLoaded,
}
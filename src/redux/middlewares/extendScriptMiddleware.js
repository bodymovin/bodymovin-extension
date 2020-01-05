import actionTypes from '../actions/actionTypes'
import {
	lottieProcessUpdate,
	lottieProcessEnd,
	lottieProcessFailed,
} from '../actions/importActions'
import {
	convertFromPath as convertLottieFileFromPath,
	convertFromUrl as convertLottieFileFromURL,
	cancelImport as cancelLottieImport,
} from '../../helpers/importers/lottie/importer'

function handleImportLottieSuccess(action, store) {

	const onUpdate = (data) => {
		store.dispatch(lottieProcessUpdate(data))
	}
	const onEnd = (data) => {
		store.dispatch(lottieProcessEnd(data))
	}
	const onFailed = (error) => {
		store.dispatch(lottieProcessFailed(error))
	}

	convertLottieFileFromPath(action.path, onUpdate, onEnd, onFailed);
}

function handleImportLottieLoadUrl(action, store) {

	const onUpdate = (data) => {
		store.dispatch(lottieProcessUpdate(data))
	}
	const onEnd = (data) => {
		store.dispatch(lottieProcessEnd(data))
	}
	const onFailed = (error) => {
		store.dispatch(lottieProcessFailed(error))
	}

	convertLottieFileFromURL(action.path, onUpdate, onEnd, onFailed);
}

function handleImportLeave(action, store) {
	cancelLottieImport();
}

function handleImportCancel(action, store) {
	cancelLottieImport();
}

const actionHandlers = {}
actionHandlers[actionTypes.IMPORT_LOTTIE_IMPORT_FILE_SUCCESS] = handleImportLottieSuccess
actionHandlers[actionTypes.IMPORT_LOTTIE_LOAD_URL] = handleImportLottieLoadUrl
actionHandlers[actionTypes.IMPORT_LEAVE] = handleImportLeave
actionHandlers[actionTypes.IMPORT_LOTTIE_PROCESS_CANCEL] = handleImportCancel

const extendScriptMiddleware = function(store) {
	return function(next) {
		return function(action) {
			next(action)
			if(actionHandlers[action.type]) {
				actionHandlers[action.type](action, store)
			}
		}
	}
}

export default extendScriptMiddleware

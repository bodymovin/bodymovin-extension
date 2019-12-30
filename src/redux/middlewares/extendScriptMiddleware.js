import actionTypes from '../actions/actionTypes'
import {convertLottieFileFromPath} from '../../helpers/ImportFilesHelper'

function handleImportLottieSuccess(action) {
	convertLottieFileFromPath(action.path);
}

const actionHandlers = {}
actionHandlers[actionTypes.IMPORT_LOTTIE_IMPORT_FILE_SUCCESS] = handleImportLottieSuccess

const extendScriptMiddleware = function() {
	return function(next) {
		return function(action) {
			next(action)
			if(actionHandlers[action.type]) {
				actionHandlers[action.type](action)
			}
		}
	}
}

export default extendScriptMiddleware

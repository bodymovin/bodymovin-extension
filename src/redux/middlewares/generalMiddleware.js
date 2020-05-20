import actionTypes from '../actions/actionTypes'
import {
	setLocalPath,
} from '../../helpers/FileLoader'
import {
	activateAnnotations	
} from '../../helpers/AnnotationsBridge'

function handleProjectPath(action, store) {
	setLocalPath('Project', action.path);
}

function handleAnnotationsActivate(action, store) {
	activateAnnotations(action.layerId, action.annotationId);
}

const actionHandlers = {}
actionHandlers[actionTypes.PROJECT_SET_PATH] = handleProjectPath
actionHandlers[actionTypes.ANNOTATIONS_LAYER_ACTIVATE_ANNOTATIONS] = handleAnnotationsActivate

const extendScriptMiddleware = function(store) {
	return function(next) {
		return function(action) {
			if(actionHandlers[action.type]) {
				actionHandlers[action.type](action, store)
			}
			next(action)
		}
	}
}

export default extendScriptMiddleware

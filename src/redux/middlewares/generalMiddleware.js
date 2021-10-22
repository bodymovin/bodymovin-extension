import actionTypes from '../actions/actionTypes'
import {
	setLocalPath,
	setTempId,
} from '../../helpers/FileLoader'
import {
	activateAnnotations	
} from '../../helpers/AnnotationsBridge'
import {
	navigateToLayer	
} from '../../helpers/CompositionsProvider'

function handleProjectPath(action, store) {
	setLocalPath('Project', action.path);
}

function handleAnnotationsActivate(action, store) {
	activateAnnotations(action.layerId, action.annotationId);
}

function handleLayerNavigation(action, store) {
	navigateToLayer(action.compId, action.layerIndex);
}

function handleTempId(action) {
	setTempId(action.id);
}

const actionHandlers = {}
actionHandlers[actionTypes.PROJECT_SET_PATH] = handleProjectPath
actionHandlers[actionTypes.ANNOTATIONS_LAYER_ACTIVATE_ANNOTATIONS] = handleAnnotationsActivate
actionHandlers[actionTypes.REPORTS_LAYER_NAVIGATION] = handleLayerNavigation
actionHandlers[actionTypes.PROJECT_SET_TEMP_ID] = handleTempId

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

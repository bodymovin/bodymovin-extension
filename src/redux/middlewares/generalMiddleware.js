import actionTypes from '../actions/actionTypes'
import {
	setLocalPath,
} from '../../helpers/FileLoader'

function handleProjectPath(action, store) {
	setLocalPath('Project', action.path);
}

const actionHandlers = {}
actionHandlers[actionTypes.PROJECT_SET_PATH] = handleProjectPath

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

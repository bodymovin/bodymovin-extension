import actionTypes from '../actions/actionTypes'
import messageTypes from '../../helpers/enums/messageTypes'
import errorCodes from '../../helpers/enums/errorCodes'

let initialState = {
	reports: [],
	path: '',
	data: {},
	settings: {
		renderers: [
			{
				id: 'all',
				label: 'All',
				isSelected: true,
			},
			{
				id: 'browser',
				label: 'Browser',
				isSelected: true,
			},
			{
				id: 'skottie',
				label: 'Skottie',
				isSelected: true,
			},
			{
				id: 'ios',
				label: 'iOS',
				isSelected: true,
			},
			{
				id: 'android',
				label: 'Android',
				isSelected: true,
			}
		],
		messageTypes: [
			{
				id: 'all',
				label: 'All',
				isSelected: true,
			},
			{
				id: 'warning',
				label: 'Warning',
				isSelected: true,
			},
			{
				id: 'error',
				label: 'Error',
				isSelected: true,
			}
		],
		builders: [
			{
				id: 'all',
				label: 'All',
				isSelected: true,
			},
			{
				id: 'expressions',
				label: 'Expressions',
				isSelected: true,
			},
			{
				id: 'wiggle',
				label: 'Wiggle',
				isSelected: true,
			},
			{
				id: 'separateDimensions',
				label: 'Separate dimensions',
				isSelected: true,
			},
			{
				id: 'orientAlongPath',
				label: 'Orient along path',
				isSelected: true,
			},
			{
				id:'unhandled layer',
				label: 'Unhandled Layers',
				isSelected: true,
			},
			{
				id:'three d layer',
				label: 'Three dimensional layer',
				isSelected: true,
			},
			{
				id:'motion blur',
				label: 'Motion blur',
				isSelected: true,
			},
			{
				id:'disabled layer',
				label: 'Disbled layer',
				isSelected: true,
			},
			{
				id:'effects',
				label: 'Effects',
				isSelected: true,
			},
			{
				id:'unhandled shape',
				label: 'Unhandled shape property',
				isSelected: true,
			},
			{
				id:'merge paths',
				label: 'Merge paths',
				isSelected: true,
			},
			{
				id:'text animators',
				label: 'Text Animators',
				isSelected: true,
			},
			{
				id:'large image',
				label: 'Large assets',
				isSelected: true,
			},
			{
				id:'illustrator asset',
				label: 'Illustrator assets',
				isSelected: true,
			},
			{
				id:'camera layer',
				label: 'Camera layer',
				isSelected: true,
			},
			{
				id:'audio layer',
				label: 'Audio layer',
				isSelected: true,
			},
			{
				id:'light layer',
				label: 'Light layer',
				isSelected: true,
			},
			{
				id:'adjustment layer',
				label: 'Adjustment layer',
				isSelected: true,
			},
			{
				id:'failed layer',
				label: 'Failed layer',
				isSelected: true,
			},
			{
				id:'unsupported style',
				label: 'Unsupported style',
				isSelected: true,
			},
			{
				id:'large mask',
				label: 'Large masks',
				isSelected: true,
			},
			{
				id:'filter size',
				label: 'Filter size',
				isSelected: true,
			},

		]
	},
	message: {
		type: messageTypes.NONE,
		text: '',
	}
}

function handleReportsViewSwitch(state, action) {
	return {
		...state,
		path: action.path,
	}
}

function setReportsData(state, action) {
	return {
		...state,
		data: action.data,
		message: initialState.message,
	}
}

function updateRenderers(state, action) {
	return {
		...state,
		settings: {
			...state.settings,
			renderers: action.renderers,
		}
	}
}

function updateMessages(state, action) {
	return {
		...state,
		settings: {
			...state.settings,
			messageTypes: action.messageTypes,
		}
	}
}

function updateBuilders(state, action) {
	return {
		...state,
		settings: {
			...state.settings,
			builders: action.builders,
		}
	}
}

function setStoredData(state, action) {
	const reports = action.projectData.reports || {
		renderers: [],
		messageTypes: [],
	}
	return {
		...state,
		settings: {
			...state.settings,
			renderers: state.settings.renderers.map(renderer => {
				const cachedRenderer = reports.renderers.find(cached => cached.id === renderer.id)
				return cachedRenderer || renderer
			}),
			messageTypes: state.settings.messageTypes.map(messageType => {
				const cachedMessageType = reports.messageTypes.find(cached => cached.id === messageType.id)
				return cachedMessageType || messageType
			}),
		}
	}
}

function showLoadErrorMessage(state, action) {
	return {
		...state,
		message: {
			type: messageTypes.ALERT,
			text: 'The animation failed to load. Check if the file exists and is a valid report.'
		}
	}
}

function handleLoadError(state, action) {
	if (action.error && action.error.errorCode === errorCodes.FILE_CANCELLED) {
		return state
	} else {
		return showLoadErrorMessage(state, action)
	}
}

function dismissAlertMessage(state, action) {
	return {
		...state,
		message: initialState.message,
	}
}

export default function project(state = initialState, action) {
	switch (action.type) {
		case actionTypes.GOTO_REPORTS:
		return handleReportsViewSwitch(state, action);
		case actionTypes.REPORTS_LOAD_SUCCESS:
		return setReportsData(state, action);
		case actionTypes.REPORTS_RENDERERS_UPDATED:
		return updateRenderers(state, action);
		case actionTypes.REPORTS_MESSAGES_UPDATED:
		return updateMessages(state, action);
		case actionTypes.REPORTS_BUILDERS_UPDATED:
		return updateBuilders(state, action);
	    case actionTypes.PROJECT_STORED_DATA:
	      return setStoredData(state, action)
	    case actionTypes.REPORTS_LOAD_FAILED:
	      return handleLoadError(state, action)
	    case actionTypes.REPORTS_ALERT_DISMISSED:
	      return dismissAlertMessage(state, action)
		default:
		return state
	}
}
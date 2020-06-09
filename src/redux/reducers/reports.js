import actionTypes from '../actions/actionTypes'

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
		default:
		return state
	}
}
import actionTypes from '../actions/actionTypes'

let initialState = {
	layers: [],
	annotations: [],
}

function updateLayers(state, action) {
	if (JSON.stringify(action.layers) !== JSON.stringify(state.layers)) {
		return {
			...state,
			layers: action.layers,
		}
	} else {
		return state
	}
}

function updateAnnotations(state, action) {
	return {
		...state,
		annotations: action.annotations,
	}
}

export default function project(state = initialState, action) {
	switch (action.type) {
		case actionTypes.ANNOTATIONS_LAYERS_LIST_FETCHED:
			return updateLayers(state, action);
		case actionTypes.ANNOTATIONS_LIST_FETCHED:
			return updateAnnotations(state, action);
		default:
			return state
	}
}
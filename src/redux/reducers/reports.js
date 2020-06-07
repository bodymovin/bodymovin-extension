import actionTypes from '../actions/actionTypes'

let initialState = {
	reports: [],
	path: '',
	data: {},
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

export default function project(state = initialState, action) {
  switch (action.type) {
  	case actionTypes.GOTO_REPORTS:
  		return handleReportsViewSwitch(state, action);
  	case actionTypes.REPORTS_LOAD_SUCCESS:
  		return setReportsData(state, action);
    default:
      return state
  }
}
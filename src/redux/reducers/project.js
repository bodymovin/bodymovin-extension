import actionTypes from '../actions/actionTypes'

let initialState = {
	id: '',
	version: ''
}

export default function project(state = initialState, action) {
  switch (action.type) {
    case actionTypes.PROJECT_SET_ID:
      return {...state, ...{id: action.id}}
    case actionTypes.VERSION_FETCHED:
      return {...state, ...{version: action.version}}
    default:
      return state
  }
}
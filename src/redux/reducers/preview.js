import actionTypes from '../actions/actionTypes'

let initialState = {
	progress: 0,
  animationData: null,
	path: null,
  totalFrames:0
}

export default function project(state = initialState, action) {
  switch (action.type) {
    case actionTypes.PREVIEW_ANIMATION_LOADED:
      return {...state, ...{animationData: action.animationData, path: action.path}}
    case actionTypes.PREVIEW_ANIMATION_PROGRESS:
      return {...state, ...{progress: action.progress}}
    case actionTypes.PREVIEW_TOTAL_FRAMES:
      return {...state, ...{totalFrames: action.totalFrames}}
    default:
      return state
  }
}
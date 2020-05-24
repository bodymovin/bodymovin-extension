import actionTypes from '../actions/actionTypes'
import Variables from '../../helpers/styles/variables'

let initialState = {
	progress: 0,
  animationData: null,
	path: null,
  totalFrames:0,
  backgroundColor: Variables.colors.gray,
}

function setStoredData(state, action) {
  return {
    ...state,
    backgroundColor: (action.projectData.preview && action.projectData.preview.backgroundColor)
      ? action.projectData.preview.backgroundColor
      : Variables.colors.gray
  }
}

export default function project(state = initialState, action) {
  switch (action.type) {
    case actionTypes.PREVIEW_ANIMATION_LOADED:
      return {...state, ...{
        animationData: action.animationData,
        assetsData: action.assetsData,
        path: action.path}
      }
    case actionTypes.PREVIEW_ANIMATION_PROGRESS:
      return {...state, ...{progress: action.progress}}
    case actionTypes.PREVIEW_TOTAL_FRAMES:
      return {...state, ...{totalFrames: action.totalFrames}}
    case actionTypes.PREVIEW_COLOR_UPDATE:
      return {...state, ...{backgroundColor: action.color}}
    case actionTypes.PROJECT_STORED_DATA:
      return setStoredData(state, action)
    default:
      return state
  }
}
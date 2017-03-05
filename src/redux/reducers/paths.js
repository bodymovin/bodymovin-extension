import actionTypes from '../actions/actionTypes'

let initialState = {
	destinationPath: '',
  previewPath: ''
}

function setDestinationPath(state, action) {
  let newState = {...state}
    let destinationPath = action.compositionData.destination.substring(0,action.compositionData.destination.lastIndexOf('\\') + 1)
    newState.destinationPath = destinationPath
  return newState
}

function setPreviewPath(state, action) {
  let newState = {...state}
  let previewPath = action.path.substring(0,action.path.lastIndexOf('\\') + 1)
  newState.previewPath = previewPath
  return newState
}

export default function project(state = initialState, action) {
  switch (action.type) {
    case actionTypes.COMPOSITION_SET_DESTINATION:
      return setDestinationPath(state, action)
    case actionTypes.PREVIEW_FILE_BROWSED:
      return setPreviewPath(state, action)
    case actionTypes.PATHS_FETCHED:
      return action.pathsData
    default:
      return state
  }
}
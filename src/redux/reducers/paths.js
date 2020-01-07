import actionTypes from '../actions/actionTypes'

let initialState = {
	destinationPath: '',
  previewPath: '',
  importPath: '',
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

function setImportPath(state, action) {
  let newState = {...state}
  let importPath = action.path.substring(0,action.path.lastIndexOf('\\') + 1)
  newState.importPath = importPath
  return newState
}

function handlePathsDataFetched(state, action) {
  return {
    ...state,
    ...action.pathsData,
  }
}

export default function project(state = initialState, action) {
  switch (action.type) {
    case actionTypes.COMPOSITION_SET_DESTINATION:
      return setDestinationPath(state, action)
    case actionTypes.PREVIEW_FILE_BROWSED:
      return setPreviewPath(state, action)
    case actionTypes.IMPORT_LOTTIE_IMPORT_FILE_SUCCESS:
      return setImportPath(state, action)
    case actionTypes.PATHS_FETCHED:
      return handlePathsDataFetched(state, action)
    default:
      return state
  }
}
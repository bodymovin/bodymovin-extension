import actionTypes from '../actions/actionTypes'

let initialState = {
  documentedFeatures: null,
  selectedFeatures: [],
  status: 'idle',
}

function updateFeatures(state, action) {
  return {
    ...state,
    status: 'loaded',
    documentedFeatures: action.features,
  }
}

function setStatusAsFailed(state) {
  return {
    ...state,
    status: 'failed',
  }
}

function updateSelectedFeatures(state, action) {
  if (JSON.stringify(state.selectedFeatures) === JSON.stringify(action.features)) {
    return state;
  }
  return {
    ...state,
    selectedFeatures: action.features,
  }
}

export default function supported_features(state = initialState, action) {
  switch (action.type) {
    case actionTypes.SUPPORTED_FEATURES_LOAD_SUCCESS:
      return updateFeatures(state, action);
    case actionTypes.SUPPORTED_FEATURES_SELECTION_UPDATED:
      return updateSelectedFeatures(state, action);
    case actionTypes.SUPPORTED_FEATURES_LOAD_FAILED:
      return setStatusAsFailed(state);
    default:
      return state
  }
}
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
  const flattenedFeaturesDictionary = action.features.reduce((acc, feature)=>{
    acc[feature.matchName] = feature;
    return acc;
  }, {});
  const flattenedFeatures = [];
  for (var s in flattenedFeaturesDictionary) {
    if (flattenedFeaturesDictionary.hasOwnProperty(s)) {
      flattenedFeatures.push(flattenedFeaturesDictionary[s]);
    }
  }

  if (JSON.stringify(state.selectedFeatures) === JSON.stringify(flattenedFeatures)) {
    return state;
  }
  return {
    ...state,
    selectedFeatures: flattenedFeatures,
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
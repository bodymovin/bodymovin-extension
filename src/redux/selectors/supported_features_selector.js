import { createSelector } from 'reselect'

const getSupportedFeatures = (state) => state.supported_features

const supportedFeaturesSelector = createSelector(
  [ getSupportedFeatures ],
  (features) => {
  	return features
  }
)

export default supportedFeaturesSelector
import { createSelector } from 'reselect'
import supportedFeaturesSelector from './supported_features_selector'

function buildFeaturesList(documentedFeatures, selectedFeatures) {
  return selectedFeatures.map(selectedFeature => {
    const featureData = {
      name: selectedFeature.name,
      matchName: selectedFeature.matchName,
    }
    if (documentedFeatures && documentedFeatures.features[selectedFeature.matchName]) {
      var documentData = documentedFeatures.features[selectedFeature.matchName]
      featureData.link = documentedFeatures.rootPath + documentData.file_name
      featureData.name = featureData.name || documentData.name;
    }
    return featureData;
  })
}

const supportedFeaturesViewSelector = createSelector(
  [ supportedFeaturesSelector ],
  (featuresReducer) => {
  	return {
      features: buildFeaturesList(featuresReducer.documentedFeatures, featuresReducer.selectedFeatures)
    }
  }
)

export default supportedFeaturesViewSelector
import { call, takeEvery, take , race, select, put } from 'redux-saga/effects'
import { delay } from 'redux-saga'
import actions from '../actions/actionTypes'
import {
	getSelectedProperties,	
} from '../../helpers/SupportedFeaturesBridge'
import supportedFeaturesSelector from '../selectors/supported_features_selector'
import { featuresLoaded, featuresLoadFailed, featuresSelectionUpdated } from '../actions/supportedFeaturesActions'
import callApi from '../../helpers/sync/canilottie'

function *ping() {
	while(true) {
		const selectedProperties = yield call(getSelectedProperties)
    yield put(featuresSelectionUpdated(selectedProperties));
		yield call(delay, 250)
	}
}

function *initialize(action) {
	try{
		yield race({
			ping: call(ping),
			finalize: take(actions.SUPPORTED_FEATURES_FINALIZE),
		})
	} catch(err) {
	}
}

function *getTemplates() {
  const supportedFeaturesData = yield select(supportedFeaturesSelector)
  if (!supportedFeaturesData.documentedFeatures) {
    try {
      const jsonData = yield call(callApi);
      yield put(featuresLoaded(jsonData));
    } catch (error) {
      yield put(featuresLoadFailed());
    }

  }
}

export default [
  takeEvery(actions.SUPPORTED_FEATURES_INITIALIZE, initialize),
  takeEvery(actions.SUPPORTED_FEATURES_INITIALIZE, getTemplates),
]
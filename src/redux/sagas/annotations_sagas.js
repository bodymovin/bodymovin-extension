import { call, takeEvery, take , race, put } from 'redux-saga/effects'
import { delay } from 'redux-saga'
import actions from '../actions/actionTypes'
import {
	getCurrentLayers,	
	getAvailableAnnotation,	
} from '../../helpers/AnnotationsBridge'
import {
	annotationsListFetched,
} from '..//actions/annotationActions'


function *ping() {
	while(true) {
		getCurrentLayers()
		yield call(delay, 250)
	}
}

function *initialize(action) {
	try{
		yield race({
			ping: call(ping),
			finalize: take(actions.ANNOTATIONS_FINALIZE),
		})
	} catch(err) {
	}
}

function *getAvailalbeAnnotations() {
	try {
		const availableAnnotations = yield call(getAvailableAnnotation)
		yield put(annotationsListFetched(availableAnnotations))
	} catch(error) {
		console.log(error)
	}
}

export default [
	takeEvery(actions.ANNOTATIONS_INITIALIZE, initialize),
	takeEvery(actions.ANNOTATIONS_INITIALIZE, getAvailalbeAnnotations),
]
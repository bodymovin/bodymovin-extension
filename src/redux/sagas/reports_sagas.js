import actions from '../actions/actionTypes'
import { call, takeEvery, take , race, put } from 'redux-saga/effects'
import loadBodymovinFileData from '../../helpers/FileLoader'
import { 
	reportsLoaded,
	reportsLoadFailed,
} from '../actions/reportsActions'

function *getReportData(action) {
	try {
		let animationData = yield call(loadBodymovinFileData, action.path)
		yield put(reportsLoaded(animationData))
	} catch(err) {
		console.log(err)
		yield put(reportsLoadFailed())
	}
}

export default [
  takeEvery(actions.GOTO_REPORTS, getReportData),
]
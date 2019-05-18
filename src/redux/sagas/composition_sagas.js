import { call, put, take, fork, select, takeEvery } from 'redux-saga/effects'
import actions from '../actions/actionTypes'
import {saveSettingsToLocalStorage, getSettingsFromLocalStorage} from '../../helpers/localStorageHelper'
import {getCompositions, getDestinationPath, renderNextComposition, stopRenderCompositions} from '../../helpers/CompositionsProvider'
import getRenderComposition from '../selectors/render_composition_selector'
import storingPathsSelector from '../selectors/storing_paths_selector'
import settingsSelector from '../selectors/settings_selector'
import {applySettingsFromCache} from '../actions/compositionActions'

function *getCSCompositions(action) {
	while(true) {
		yield take(actions.COMPOSITIONS_GET_COMPS)
		yield call(getCompositions)
	}
}

function *getCompositionDestination() {
	while(true) {
		let action = yield take(actions.COMPOSITION_GET_DESTINATION)
		try{
			let paths = yield select(storingPathsSelector)
			const compositions = yield call(getDestinationPath, action.comp, paths.destinationPath)
			if (compositions) {
				yield put({ 
						type: actions.COMPOSITIONS_UPDATED,
						compositions: compositions
				})
			}
		} catch(err) {

		}
	}
}

function *startRender() {
	while(true) {
		yield take([actions.RENDER_START,actions.RENDER_COMPLETE])
		let comp = yield select(getRenderComposition)
		if(comp) {
			yield call(renderNextComposition, comp)
		} else {
			yield put({ 
				type: actions.RENDER_FINISHED
			})
		}
	}
}

function *stopRender(action) {
	yield call(stopRenderCompositions)
}

function *goToSettings() {
	yield put({ 
		type: actions.GOTO_SETTINGS
	})
}

function *saveSettings() {
	let settings = yield select(settingsSelector)
	yield call(saveSettingsToLocalStorage, settings)
}

function *applySettings(action) {
	try {
		const settings = yield call(getSettingsFromLocalStorage)
		yield put(applySettingsFromCache(settings, action.allComps))
	} catch(err) {
	}
}

export default [
  fork(getCSCompositions),
  fork(getCompositionDestination),
  fork(startRender),
  takeEvery(actions.RENDER_STOP, stopRender),
  takeEvery(actions.COMPOSITION_DISPLAY_SETTINGS, goToSettings),
  takeEvery(actions.SETTINGS_REMEMBER, saveSettings),
  takeEvery(actions.SETTINGS_APPLY, applySettings),
]
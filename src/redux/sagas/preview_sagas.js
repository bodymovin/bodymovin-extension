import { call, put, takeEvery, select, all, race, take } from 'redux-saga/effects'
import { delay } from 'redux-saga'
import actions from '../actions/actionTypes'
import fileBrowser from '../../helpers/FileBrowser'
import loadBodymovinFileData, {loadArrayBuffer} from '../../helpers/FileLoader'
import storingPathsSelector from '../selectors/storing_paths_selector'
import timelineLockSelector from '../selectors/preview_lock_timeline_selector'
import {
	timelineUpdated,
} from '../actions/previewActions'
import {getSimpleSeparator} from '../../helpers/osHelper'
import {
	getLatestVersion as getLatestSkottieVersion,
	getSavedVersion as getSkottieSavedVersions,
	saveLatestVersion as saveSkottieLatestVersion,
	initialize as initializeSkottie,
} from '../../helpers/skottie/skottie'
import {
	getCompositionTimelinePosition,
	setCompositionTimelinePosition,
} from '../../helpers/CompositionsProvider'


function *browseFile() {
	try{
		let paths = yield select(storingPathsSelector)
		let fileData = yield call(fileBrowser, paths.previewPath)
		yield put({ 
				type: actions.PREVIEW_FILE_BROWSED,
				path: fileData.fsName
		})
	} catch(err) {

	}
}

function *buildAssetData(path, asset) {
	const filePath = path + asset.u + asset.p
	const assetFile = yield call(loadArrayBuffer, filePath)
	return {
		name: asset.p,
		data: assetFile,
	}
}

function *loadAssets(path, assets) {
	try {
		const assetsPath = path.substr(0, path.lastIndexOf(getSimpleSeparator()) + 1)
		const filesData = yield all( 
		assets
			.filter(asset => 'id' in asset)
			.map(asset => buildAssetData(assetsPath, asset))
		)
		return filesData.reduce((accumulator, asset)=>{
			accumulator[asset.name] = asset.data
			return accumulator
		}, {})
	} catch(err) {
		return {}
	} 
}

function *loadBodymovinFile(action) {
	try{
		let animationData = yield call(loadBodymovinFileData, action.path)
		const assetsData = yield call(loadAssets, action.path, animationData.assets)
		yield put({ 
				type: actions.PREVIEW_ANIMATION_LOADED,
				animationData: animationData,
				assetsData,
				path: action.path
		})
	} catch(err) {
		yield put({ 
				type: actions.PREVIEW_ANIMATION_LOAD_FAILED
		})
	}
}

function *ping() {
	while(true) {
		try {
			const timelineData = yield call(getCompositionTimelinePosition)
			if (timelineData.active) {
				yield put(timelineUpdated(timelineData.data))
			}
		} catch(err) {
		}
		yield call(delay, 50)
	}
}

function *timelineLockPing() {
	while(true) {
		yield race({
			ping: call(ping),
			progress: take(actions.PREVIEW_ANIMATION_PROGRESS),
		})
		yield call(delay, 1000)
	}
}

function *timelineLock() {
	while(true) {
		const shouldLockTimeline = yield select(timelineLockSelector)
		if (shouldLockTimeline) {
			yield race({
				toggle: take(actions.PREVIEW_LOCK_TIMELINE_TOGGLE),
				timelineLockPing: call(timelineLockPing),
			})
		} else {
			yield take(actions.PREVIEW_LOCK_TIMELINE_TOGGLE)
		}
	}
}

function *timelineUpdate() {
	while(true) {
		const action = yield take(actions.PREVIEW_ANIMATION_PROGRESS)
		const shouldLockTimeline = yield select(timelineLockSelector)
		if (shouldLockTimeline) {
			setCompositionTimelinePosition(action.progress)
		}
	}
}

function *handleTimelineLock() {
	yield race({
		finalize: take(actions.PREVIEW_FINALIZE),
		timelineLock: call(timelineLock),
		timelineUpdate: call(timelineUpdate),
	})
}

function *searchSkottieUpdates() {
	try {
		yield call(initializeSkottie)
		const latestVersion = yield call(getLatestSkottieVersion)
		const savedVersions = yield call(getSkottieSavedVersions)
		if (!savedVersions.length || savedVersions[savedVersions.length - 1].version !== latestVersion) {
			saveSkottieLatestVersion(latestVersion)
		}
	} catch(err) {
		console.log(err)
	}
}

export default [
  takeEvery(actions.PREVIEW_BROWSE_FILE, browseFile),
  takeEvery([
  	actions.PREVIEW_FILE_BROWSED,
  	actions.PREVIEW_ANIMATION,
  ]
  , loadBodymovinFile),
  takeEvery(actions.PREVIEW_INITIALIZE, handleTimelineLock),
  takeEvery(actions.PREVIEW_INITIALIZE, searchSkottieUpdates),
]
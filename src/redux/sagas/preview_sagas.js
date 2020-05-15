import { call, put, takeEvery, select, all } from 'redux-saga/effects'
import actions from '../actions/actionTypes'
import fileBrowser from '../../helpers/FileBrowser'
import loadBodymovinFileData, {loadArrayBuffer} from '../../helpers/FileLoader'
import storingPathsSelector from '../selectors/storing_paths_selector'
import {getSimpleSeparator} from '../../helpers/osHelper'

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

export default [
  takeEvery(actions.PREVIEW_BROWSE_FILE, browseFile),
  takeEvery(actions.PREVIEW_FILE_BROWSED, loadBodymovinFile)
]
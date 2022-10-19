import { call, take, put, takeEvery, fork, select } from 'redux-saga/effects'
import actions from '../actions/actionTypes'
import {saveFontsFromLocalStorage, getFontsFromLocalStorage} from '../../helpers/localStorageHelper'
import {setFonts, imageProcessed, dataCompressed } from '../../helpers/CompositionsProvider'
import renderFontSelector from '../selectors/render_font_selector'
import setFontsSelector from '../selectors/set_fonts_selector'
import imageProcessor from '../../helpers/ImageProcessorHelper'
import dataCompressor from '../../helpers/DataCompressorHelper'

function *searchStoredFonts(action) {
	try{
		let storedFonts = yield call(getFontsFromLocalStorage, action.data.fonts)
		yield put({ 
				type: actions.RENDER_STORED_FONTS_FETCHED,
				storedFonts: storedFonts
		})
	} catch(err) {

	}
}

function *saveFonts() {
	try{
		let fontsInfo = yield select(setFontsSelector)
		setFonts(fontsInfo)
	} catch(err) {

	}
}

function *storeFontData() {
	while(true) {
		let action = yield take([actions.RENDER_UPDATE_FONT_ORIGIN, actions.RENDER_UPDATE_INPUT])
		try{
			let fonts = yield select(renderFontSelector)
			let fontData
			let i = 0, len = fonts.length
			while(i<len) {
				if(fonts[i].fName === action.item.fName){
					fontData = fonts[i]
					break
				}
				i += 1
			}
			saveFontsFromLocalStorage(fontData)
		}catch(err) {
			console.log('err:', err)
		}
	}
}

function *processImage(action) {
	let response = yield call(imageProcessor, action.data)
	imageProcessed(response)
}

function *compressData(action) {
	let response = yield call(dataCompressor, action.data)
	dataCompressed(response)
}

export default [
  takeEvery(actions.RENDER_FONTS, searchStoredFonts),
  takeEvery(actions.RENDER_SET_FONTS, saveFonts),
  takeEvery(actions.RENDER_PROCESS_IMAGE, processImage),
  takeEvery(actions.TG_COMPRESS, compressData),
  fork(storeFontData)
]
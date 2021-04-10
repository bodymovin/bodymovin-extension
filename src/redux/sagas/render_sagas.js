import { call, take, put, takeEvery, fork, select, all } from 'redux-saga/effects'
import actions from '../actions/actionTypes'
import {saveFontsFromLocalStorage, getFontsFromLocalStorage} from '../../helpers/localStorageHelper'
import {setFonts, imageProcessed, riveFileSaveSuccess, riveFileSaveFailed, expressionProcessed} from '../../helpers/CompositionsProvider'
import renderFontSelector from '../selectors/render_font_selector'
import setFontsSelector from '../selectors/set_fonts_selector'
import imageProcessor from '../../helpers/ImageProcessorHelper'
import {saveFile as riveSaveFile} from '../../helpers/riveHelper'
import {getEncodedFile} from '../../helpers/FileLoader'
import expressionProcessor from '../../helpers/expressions/expressions'

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

function *handleRenderFonts(action) {
	if (!action.data.bundleFonts) {
		yield call(searchStoredFonts, action)
	} else {
		let fontsInfo = yield select(setFontsSelector)
		fontsInfo = fontsInfo.map((font, index) => {
			return {
				...font,
				origin: 3,
			}
		})
		if (action.data.inlineFonts) {
			const inlines = action.data.fonts.map(async function(font, index) {
				let fontData
				try {
					fontData = await getEncodedFile(font.originalLocation)
				} catch(err) {
					fontData = ''
				}
				return fontData
			})
			const files = yield all(inlines)
			fontsInfo = fontsInfo.map((font, index) => {
				return {
					...font,
					fPath: files[index],
				}
			})
		}
		setFonts(fontsInfo)
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
	try{
		let response = yield call(imageProcessor, action.data)
		imageProcessed(response, action.data)
	} catch (err) {
		console.log(err)
	}
}

function *saveRiveFile(action) {
	try{
		yield call(riveSaveFile, action.origin, action.destination, action.fileName)
		yield call(riveFileSaveSuccess)
	} catch(err) {
		console.log(err)
		yield call(riveFileSaveFailed)
	}
}

function *processExpression(action) {
	const expressionData = yield call(expressionProcessor, action.data.text);
	yield call(expressionProcessed, action.data.id, expressionData);
}

export default [
	takeEvery(actions.RENDER_FONTS, handleRenderFonts),
	takeEvery(actions.RENDER_SET_FONTS, saveFonts),
	takeEvery(actions.RENDER_PROCESS_IMAGE, processImage),
	takeEvery(actions.RIVE_SAVE_DATA, saveRiveFile),
	takeEvery(actions.RENDER_PROCESS_EXPRESSION, processExpression),
	fork(storeFontData)
]
import actionTypes from './actionTypes'

function startRender(comp) {
	return {
		type: actionTypes.RENDER_START
	}
}

function stopRender(comp) {
	return {
		type: actionTypes.RENDER_STOP
	}
}

function updateFontOrigin(origin, item) {
	return {
		type: actionTypes.RENDER_UPDATE_FONT_ORIGIN,
		item: item,
		origin: origin
	}
}

function updateInput(value, inputName, item) {
	return {
		type: actionTypes.RENDER_UPDATE_INPUT,
		item: item,
		inputName: inputName,
		value: value
	}
}

function setFonts() {
	return {
		type: actionTypes.RENDER_SET_FONTS
	}
}

function showRenderBlock(pars) {
	return {
		type: actionTypes.RENDER_BLOCK,
		pars: pars
	}
}

export {
	startRender,
	stopRender,
	updateFontOrigin,
	updateInput,
	setFonts,
	showRenderBlock
}
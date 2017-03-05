import csInterface from './CSInterfaceHelper'

function setCompositionSelection(comp) {
	var eScript = 'bm_compsManager.setCompositionSelectionState(' + comp.id + ',' + comp.selected + ')'
    csInterface.evalScript(eScript)
}

export {
	setCompositionSelection
}
import csInterface from './CSInterfaceHelper'
import extensionLoader from './ExtensionLoader'

function setCompositionSelection(comp) {
	extensionLoader.then(function(){
		var eScript = '$.__bodymovin.bm_compsManager.setCompositionSelectionState(' + comp.id + ',' + comp.selected + ')'
	    csInterface.evalScript(eScript)
	})
}

export {
	setCompositionSelection
}
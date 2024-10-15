import csInterface from './CSInterfaceHelper'
import extensionLoader from './ExtensionLoader'
import {dispatcher} from './storeDispatcher'
import {
	layersListFetched,
} from '../redux/actions/annotationActions'

csInterface.addEventListener('bm:annotations:list', function (ev) {
	if(ev.data) {
		let layers = (typeof ev.data === "string") ? JSON.parse(ev.data) : ev.data
		dispatcher(layersListFetched(layers))
	}
})

async function getCurrentLayers() {
	await extensionLoader
	extensionLoader.then(function(){
		var eScript = '$.__bodymovin.bm_annotationsManager.getLayers()';
	    csInterface.evalScript(eScript);
	})
}

async function activateAnnotations(layerId, annotationId) {
	await extensionLoader
	var eScript = '$.__bodymovin.bm_annotationsManager.activateAnnotations("' + layerId + '","' + annotationId + '")';
	csInterface.evalScript(eScript);
}

async function getAvailableAnnotation() {
	return new Promise(async function(resolve, reject) {
		function handleAnnotations(ev) {
			if (ev.data) {
				const annotations = (typeof ev.data === "string") ? JSON.parse(ev.data) : ev.data
				resolve(annotations)
			}
			csInterface.removeEventListener('bm:annotations:annotationsList', handleAnnotations)
		}
		csInterface.addEventListener('bm:annotations:annotationsList', handleAnnotations)

		await extensionLoader;
		var eScript = '$.__bodymovin.bm_annotationsManager.getAvailableAnnotation()';
	    csInterface.evalScript(eScript);
	})
	
}

export {
	getCurrentLayers,
	activateAnnotations,
	getAvailableAnnotation,
}
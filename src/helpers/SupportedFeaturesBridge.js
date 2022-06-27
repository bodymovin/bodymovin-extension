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
	} else {
	}
})

async function getSelectedProperties() {
	return new Promise(async function(resolve, reject) {
		function handleProperties(ev) {
			if (ev.data) {
				const annotations = (typeof ev.data === "string") ? JSON.parse(ev.data) : ev.data
				resolve(annotations)
			}
			csInterface.removeEventListener('bm:properties:list', handleProperties)
		}
		csInterface.addEventListener('bm:properties:list', handleProperties)

		await extensionLoader;
		var eScript = '$.__bodymovin.bm_projectManager.getSelectedProperties()';
	    csInterface.evalScript(eScript);
	})
	
}

export {
	getSelectedProperties,
}
import csInterface from './CSInterfaceHelper'
import extensionLoader from './ExtensionLoader'

var resolve, reject

csInterface.addEventListener('bm:file:uri', function (ev) {
	resolve(ev.data)
})

csInterface.addEventListener('bm:file:cancel', function (ev) {
	reject()
})

function browseFile(path) {
    var promise = new Promise(function(_resolve, _reject) {
    	resolve = _resolve
    	reject = _reject
    })
    
    extensionLoader.then(function(){
        path = path ? path.replace(/\\/g,"\\\\") : ''
        var eScript = 'bm_main.browseFile("' + path + '")';
        csInterface.evalScript(eScript);
    })
    return promise
}

export default browseFile
import {getFileData} from './CompositionsProvider'

function loadBodymovinFileData(path) {
	var reject, resolve
    var promise = new Promise(function(_resolve, _reject) {
    	resolve = _resolve
    	reject = _reject
    })
    var result = window.cep.fs.readFile(path)
    try {
	    if(result.err === 0) {
	    	var jsonData = JSON.parse(result.data)
	    	if(jsonData.v) {
    			resolve(jsonData)
	    	}
	    } else {
            reject()
        }
    } catch(err) {
        reject()
    }

    return promise
}

export default loadBodymovinFileData

async function loadFileData(path) {
    const value = await getFileData(path)
    return Promise.resolve(value)
    
}

export {
    loadFileData
}
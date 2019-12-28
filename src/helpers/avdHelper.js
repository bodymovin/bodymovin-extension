import bodymovin2Avd from 'bodymovin-to-avd'
import csInterface from './CSInterfaceHelper'
import extensionLoader from './ExtensionLoader'

function writeFile(path, data) {
	return new Promise((resolve, reject) => {
		var result = window.cep.fs.writeFile(path, data);
		if (0 !== result.err) {
			reject(result.err)
		} else {
			resolve(true)
		}
	})
}

async function saveFile(origin, destination) {
	console.log(origin, destination)
	var jsonDataResult = window.cep.fs.readFile(origin)
	if (0 !== jsonDataResult.err) {
		throw new Error(jsonDataResult.err)
	} else {
		var jsonData = jsonDataResult.data;
		var jsonObject = JSON.parse(jsonData);
		var avdData = await bodymovin2Avd(jsonObject);
		await writeFile(destination, avdData);
	}
}

export {
 saveFile
}
import bodymovin2SMIL from 'bodymovin-to-smil'

function writeFile(path, data) {
	return new Promise((resolve, reject) => {
		var result = window.cep.fs.writeFile(path, data);
		if (0 !== result.err) {
			reject(result.err);
		} else {
			resolve(true);
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
		var smilData = await bodymovin2SMIL(jsonObject);
		await writeFile(destination, smilData);
	}
}

export {
 saveFile
}
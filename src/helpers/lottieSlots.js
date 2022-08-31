import loadBodymovinFileData from './FileLoader'
import { getSimpleSeparator } from './osHelper'
import convertAnimation from './slots/converter';

const createSlots = async (origin, destination, fileName, prettyPrint) => {
	var path = origin + getSimpleSeparator() + fileName + '.json';
	var destination = destination + getSimpleSeparator() + fileName + '.json';
	try {
		const jsonData = await loadBodymovinFileData(path);
		convertAnimation(jsonData);
		window.cep.fs.writeFile(destination, JSON.stringify(jsonData, null, prettyPrint ? '\t' : ''));
	} catch (error) {
		console.log('ERROR', error)
	}
}

export {
	createSlots
}
import fs from '../fs_proxy'
import nodePath from '../path_proxy'
import {getUserFolders} from '../CompositionsProvider'

let storingFolder = ''
let storingDataFileName = 'data2.json'
const lockedMinorVersion = [0,33,0];

const createDataFile = async () => {
	return {
		versions: [],
	}
}

const getFolder = async () => {
	if (!storingFolder) {
		const userFolders = await getUserFolders()
		const path = [
			userFolders.userData,
			nodePath.sep + 'bodymovin',
			nodePath.sep + 'skottie',
			nodePath.sep + 'builds',
		]
		let currentPath = ''

		for (let i = 0; i < path.length; i += 1) {
			currentPath += path[i];
			// console.log(currentPath)
			if (!fs.existsSync(currentPath)) {
				fs.mkdirSync(currentPath);
			}
		}
		storingFolder = path.join('')
	}
	return storingFolder
}

const getLatestVersion = async () => {
	const packageResponse = await fetch('https://unpkg.com/canvaskit-wasm@latest/package.json');
	const packageData = await packageResponse.json();
	const versionParts = packageData.version.split('.');
	if (Number(versionParts[1]) === Number(lockedMinorVersion[1])) {
		return packageData.version;
		// return packageData.version.replace(/\W/g, '');
	}
	return '';
}

const saveDataFile = async data => {

	const folder = await getFolder()
	const storingDataFilePath = folder + nodePath.sep + storingDataFileName
	fs.writeFileSync(storingDataFilePath, JSON.stringify(data))
}

const getDataFile = async () => {
	const folder = await getFolder()
	const storingDataFilePath = folder + nodePath.sep + storingDataFileName
	if (!fs.existsSync(storingDataFilePath)) {
		const dataFile = await createDataFile()
		await saveDataFile(dataFile)
	}
	const fileData = fs.readFileSync(storingDataFilePath, 'utf8')
	return JSON.parse(fileData)
}

const initialize = async () => {
	await getFolder()
	await getDataFile()

	return true
}

const getSavedVersion = async () => {
	const dataFile = await getDataFile()
	return dataFile.versions
}

const saveLatestVersion = async version => {
	// const files = await Promise.all([
	// 	fetch('https://unpkg.com/canvaskit-wasm@latest/bin/full/canvaskit.js'),
	// 	fetch('https://unpkg.com/canvaskit-wasm@latest/bin/full/canvaskit.wasm'),
	// ])
	// const savingFolder = await getFolder()
	// const fileName = version.split('.').join('_').replace(/\W/g, '')
	// const jsBuffer = await files[0].arrayBuffer()
	// const jsFilePath = savingFolder + nodePath.sep + fileName + '.js'
	// fs.writeFileSync(jsFilePath, Buffer.from(jsBuffer))
	// const wasmBuffer = await files[1].arrayBuffer()
	// const wasmFilePath = savingFolder + nodePath.sep + fileName + '.wasm'
	// fs.writeFileSync(wasmFilePath, Buffer.from(wasmBuffer))
	const dataFile = await getDataFile()
	dataFile.versions.push({
		version,
		// wasm: wasmFilePath,
		// js: jsFilePath,
	})
	await saveDataFile(dataFile)
}

export {
	initialize,
	getLatestVersion,
	getDataFile,
	getSavedVersion,
	saveLatestVersion,
	lockedMinorVersion,
}
import {CSInterface} from './CSInterface'
import extensionLoader from './ExtensionLoader'
var csInterface = new CSInterface();

function sendCommand(prefix, commandName, commandArguments = []) {
	let command = prefix + commandName
	command += '('
	commandArguments.forEach((commandArgument, index) => {
		if (typeof commandArgument === 'string') {
			command += '"'	
			command += commandArgument	
			command += '"'	
		} else if (typeof commandArgument === 'object') {
			command += JSON.stringify(commandArgument)	
		} else {
			command += commandArgument	
		}
		if (index !== commandArguments.length - 1) {
			command += ','	
		}
	})
	command += ')'
	csInterface.evalScript(command);
	// console.log(command)
}

function sendCommandWithListeners(command, commandArguments, successEvent, failedEvent) {
	return new Promise(async function(resolve, reject) {
		function onData(ev) {
			if (ev.data) {
				const data = (typeof ev.data === "string")
				? JSON.parse(ev.data)
				: ev.data
				resolve(data)
			}
			csInterface.removeEventListener(successEvent, onData)
			if (failedEvent) {
				csInterface.removeEventListener(failedEvent, onFail)
			}
		}
		function onFail() {
			reject()
		}
		csInterface.addEventListener(successEvent, onData)
		if (failedEvent) {
			csInterface.addEventListener(failedEvent, onFail)
		}
		await extensionLoader;
		sendCommand('', command, commandArguments)
	})
}
async function getXMPValue(property, isJSON) {
	const result = await sendCommandWithListeners(
		'$.__bodymovin.bm_XMPHelper.getMetadataFromCep',
		[property, isJSON],
		`bm:xmpData:success:${property}`,
		`bm:xmpData:failed:${property}`,
	)
	return result.value;
}

async function sendAsyncCommand(command, commandArguments = []) {
	await extensionLoader;
	sendCommand('', command, commandArguments);
}

export default csInterface

export {
	sendCommand,
	sendAsyncCommand,
	sendCommandWithListeners,
	getXMPValue,
}
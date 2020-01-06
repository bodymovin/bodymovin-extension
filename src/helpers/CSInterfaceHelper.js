import {CSInterface} from './CSInterface'
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

export default csInterface

export {
	sendCommand
}
import {sendCommand} from '../../CSInterfaceHelper'

const lottieCommandHandler = (commandName, commandArguments = []) => {
	const prefix = '$.__bodymovin.bm_lottieImporter.'
	sendCommand(prefix, commandName, commandArguments)
}

export default lottieCommandHandler
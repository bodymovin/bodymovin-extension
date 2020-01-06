import {sendCommand} from '../../CSInterfaceHelper'

const _commands = [];
let _onUpdate = () =>{};
let _onEnd = () =>{};
let _commandTimeout = null;
const prefix = '$.__bodymovin.bm_lottieImporter.';

const commandsTimeout = {
	createFolder: 50,
	createComp: 50,
	createSolid: 50,
	createNull: 50,
	createShapeLayer: 50,
	addComposition: 50,
	setLayerStartTime: 50,
	setLayerStretch: 50,
	setLayerInPoint: 50,
	setLayerOutPoint: 50,
	setLayerParent: 50,
	reset: 1,
	setFrameRate: 1,
	createMask: 50,
	setElementKey: 50,
	setElementTemporalKeyAtIndex: 50,
	setElementPropertyValue: 50,
	setElementPropertyExpression: 50,
	createShapeGroup: 50,
	createRectangle: 50,
	createFill: 50,
	createStroke: 50,
	createEllipse: 50,
	createStar: 50,
	createShape: 50,
	createRepeater: 50,
	createRoundedCorners: 50,
	createTrimPath: 50,
	createGradientFill: 50,
	createGradientStroke: 50,
	assignIdToProp: 50,
	setInterpolationTypeAtKey: 50,
	setSpatialTangentsAtKey: 50,
}

const getTimeout = (command) => {
	// return 1;
	return commandsTimeout[command] || 50;
}

const sendNextCommand = () => {
	_commandTimeout = null;
	if (_commands.length) {
		const nextCommand = _commands.shift();
		sendCommand(prefix, nextCommand.name, nextCommand.arguments);
		// This is to prevent an onUpdate state when animation has not been loaded yet
		if (nextCommand.name !== 'reset') {
			_onUpdate(_commands.length);
		}
		_commandTimeout = setTimeout(sendNextCommand, getTimeout(nextCommand.name));
	} else {
		_onEnd();
	}
	// console.log(_commands.length)

}

const lottieCommandHandler = (commandName, commandArguments = []) => {
	_commands.push({
		name: commandName,
		arguments: commandArguments,
	});
	if (_commandTimeout === null) {
		sendNextCommand();
	}
}

const registerUpdate = (handler) => {
	_onUpdate = handler;
}

const registerEnd = (handler) => {
	_onEnd = handler;
}

const clear = () => {
	_commands.length = 0;
	_onUpdate = () => {}
	_onEnd = () => {}
	clearTimeout(_commandTimeout);
	_commandTimeout = null;

}

export default lottieCommandHandler

export {
	registerUpdate,
	registerEnd,
	clear,
}
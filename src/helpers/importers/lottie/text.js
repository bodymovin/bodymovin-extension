import random from '../../randomGenerator'
import sendCommand from './commandHelper'

const getTextDocumentData = (textDocumentData) => {
	if ('k' in textDocumentData) {
		return textDocumentData.k
	} else {
		return [
			{
				s: textDocumentData
			}
		]
	}
}

const processText = (textData, layerId) => {
	const textDocumentData = getTextDocumentData(textData.d)
	const sourceTextIdId = random(10);
	sendCommand('assignIdToProp', ['Source Text', sourceTextIdId, layerId]);
	if (textDocumentData.length === 1) {
		const textDocumentValue = textDocumentData[0].s
		sendCommand('setTextDocumentValue',
			[
				layerId, 
				encodeURIComponent(textDocumentValue.t),
				textDocumentValue.s,
				encodeURIComponent(textDocumentValue.f),
				textDocumentValue.fc,
				textDocumentValue.tr,
				textDocumentValue.j,
				textDocumentValue.ls || 0,
			]
		);
	} else {
		textDocumentData.forEach(textDocument => {
			const textDocumentValue = textDocument.s
			sendCommand('setTextDocumentValueAtTime',
				[
					layerId,
					textDocument.t,
					encodeURIComponent(textDocumentValue.t),
					textDocumentValue.s,
					encodeURIComponent(textDocumentValue.f),
					textDocumentValue.fc,
					textDocumentValue.tr,
					textDocumentValue.j,
					textDocumentValue.ls || 0,
				]
			);
		})
	}
}

export default processText
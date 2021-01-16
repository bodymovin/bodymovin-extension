import { getPort } from './enums/networkData'

const ping = async() => {
	const response = await fetch(`http://localhost:${getPort()}/ping/`);
	const textResponse = await response.text();
	return textResponse
}

export {
	ping
}
import { getPort } from './enums/networkData'
import { fetchWithId } from './FileLoader'

const ping = async() => {
	const response = await fetchWithId(`http://localhost:${getPort()}/ping/`);
	const textResponse = await response.text();
	return textResponse
}

export {
	ping
}
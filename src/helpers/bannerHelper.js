import { getPort } from './enums/networkData'
import { fetchWithId } from '../helpers/FileLoader'

const saveFile = async (origin, destination) => {
	const encodedImageResponse = await fetchWithId(`http://localhost:${getPort()}/createBanner/`, 
	{
		method: 'post',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			origin: encodeURIComponent(origin),
			destination: encodeURIComponent(destination),
		})
	})
	const jsonResponse = await encodedImageResponse.json()
	if(jsonResponse.status === 'success') {
		return true;
	} else {
		throw new Error(jsonResponse.message);
	}
}

export {
 saveFile
}
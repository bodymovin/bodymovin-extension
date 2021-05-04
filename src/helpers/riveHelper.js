import { fetchWithId } from './FileLoader'

const saveFile = async (origin, destination, fileName) => {
	const encodedImageResponse = await fetchWithId('http://localhost:3119/convertToFlare/', 
	{
		method: 'post',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			origin: encodeURIComponent(origin),
			destination: encodeURIComponent(destination),
			fileName: encodeURIComponent(fileName),
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
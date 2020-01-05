const NasaApiKey = 'SrFGbqEtBKuKJgvnJqsg59I3Ezk2UOCrCcNvh59l'

async function loadMarsImage() {
	const curiosityUrl = `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=1000&api_key=${NasaApiKey}`
	const requestResult = await fetch(curiosityUrl,
	{
		method: 'get',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		}
	})
	const requestJson = await requestResult.json()
	return requestJson.photos[Math.floor(Math.random() * requestJson.photos.length)];
}

async function loadImage() {
	const options = [
		loadMarsImage
	]

	const imageLoader = options[Math.floor(Math.random() * options.length)];
	return imageLoader()
}

export default loadImage
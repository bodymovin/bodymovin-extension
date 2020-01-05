//

async function loadCatFact() {
	const curiosityUrl = `https://cat-fact.herokuapp.com/facts/random`
	const requestResult = await fetch(curiosityUrl,
	{
		method: 'get',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		}
	})
	return requestResult.json()
}

async function loadFact() {
	const options = [
		loadCatFact
	]

	const factLoader = options[Math.floor(Math.random() * options.length)];
	return factLoader()
}

export default loadFact
const ping = async() => {
	const response = await fetch('http://localhost:3119/ping/');
	const textResponse = await response.text();
	return true
}

export {
	ping
}
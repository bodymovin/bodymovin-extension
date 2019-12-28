const splitAnimation = async (origin, destination, fileName, time) => {
	const encodedImageResponse = await fetch('http://localhost:3119/splitAnimation/', 
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
			time: time,
		})
	})
	const jsonResponse = await encodedImageResponse.json()
	if(jsonResponse.status === 'success') {
		return jsonResponse.totalSegments;
	} else {
		throw new Error(jsonResponse.message);
	}
}

export {
 splitAnimation
}
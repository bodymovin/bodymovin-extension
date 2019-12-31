let _frameRate = 0

const setFrameRate = (value) => {
	_frameRate = value
}

const getFrameRate = () => _frameRate

export {
	setFrameRate,
	getFrameRate,
}
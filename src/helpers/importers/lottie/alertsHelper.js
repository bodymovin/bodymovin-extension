const _alerts = [];

const add = (message) => {
	_alerts.push(message)
}

const get = () => [..._alerts];

const reset = () => {
	_alerts.length = 0;
}

export {
	add,
	get,
	reset,
}
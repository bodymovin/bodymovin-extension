const _alerts = [];

const add = (message) => {
	_alerts.push({
		message
	})
}

const reset = () => {
	_alerts.length = 0;
}

export {
	add,
	reset,
}
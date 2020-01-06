const _alerts = [];
const _compsStack = [];
let _currentLayer = '';

const add = (message) => {
	_alerts.push({
		...message,
		layer: _currentLayer,
		comp: _compsStack.length ? _compsStack[_compsStack.length - 1] : '',
	})
}

const get = () => [..._alerts];

const reset = () => {
	_alerts.length = 0;
	_compsStack.length = 0;
}

const setLayer = (name) => {
	_currentLayer = name;
}

const pushComp = (name) => {
	_compsStack.push(name);
}

const popComp = () => {
	_compsStack.pop();
}

export {
	add,
	get,
	reset,
	setLayer,
	pushComp,
	popComp,
}
function getProjectFromLocalStorage(id) {
	let resolve, reject
	let prom = new Promise(function(_resolve, _reject){
		resolve = _resolve
		reject = _reject
	})
	try {
		var project = localStorage.getItem('project_' + id);
		if(project) {
			resolve(JSON.parse(project))
		} else {
			reject()
		}
	} catch(err) {
		reject()
	}
	return prom
}

function saveProjectToLocalStorage(data, id) {
	let resolve, reject
	let prom = new Promise(function(_resolve, _reject){
		resolve = _resolve
		reject = _reject
	})
	try {
		let serialized = JSON.stringify(data)
		localStorage.setItem('project_' + id, serialized)
		resolve()
	} catch(err) {
		reject()
	}
	return prom
}

function getFontsFromLocalStorage(fonts) {
	let resolve, reject
	let prom = new Promise(function(_resolve, _reject){
		resolve = _resolve
		reject = _reject
	})
	var storedFonts = JSON.parse(localStorage.getItem('fonts'))
	storedFonts = storedFonts || []
	let len = storedFonts.length, i = 0
	let storedFont
	let storedData = fonts.map(function(item){
		storedFont = {
			fName: item.name,
			data:null
		}
		i = 0
		while(i<len){
			if(item.name === storedFonts[i].fName){
				storedFont.data = storedFonts[i]
			}
			i += 1
		}
		return storedFont
	})
	if(storedData) {
		resolve(storedData)
	} else {
		reject()
	}
	return prom
}

function saveFontsFromLocalStorage(font) {
	let resolve
	let prom = new Promise(function(_resolve){
		resolve = _resolve
	})
	var storedFonts = JSON.parse(localStorage.getItem('fonts'))
	storedFonts = storedFonts ? storedFonts : []
	let i = 0, len = storedFonts.length
	while(i<len){
		if(storedFonts[i].fName === font.fName){
			storedFonts[i] = font
			break
		}
		i += 1
	}
	if(i === len) {
		storedFonts.push(font)
	}
	localStorage.setItem('fonts', JSON.stringify(storedFonts))
	resolve()
	return prom
}

function getPathsFromLocalStorage(){
	let resolve, reject
	let prom = new Promise(function(_resolve, _reject){
		resolve = _resolve
		reject = _reject
	})
	try {
		var paths = localStorage.getItem('paths');
		if(paths) {
			resolve(JSON.parse(paths))
		} else {
			reject()
		}
	} catch(err) {
		reject()
	}
	return prom
}

function savePathsToLocalStorage(paths) {
	let resolve
	let prom = new Promise(function(_resolve){
		resolve = _resolve
	})
	localStorage.setItem('paths', JSON.stringify(paths))
	resolve()
	return prom
}

function saveSettingsToLocalStorage(settings) {
	return new Promise((resolve, reject) => {
		try {
			localStorage.setItem('defaultSettings', JSON.stringify(settings))
			resolve()
		} catch(err) {
			reject()
		}
	})
}

function getSettingsFromLocalStorage(paths) {
	return new Promise((resolve, reject) => {
		try {
			var settings = localStorage.getItem('defaultSettings');
			if(settings) {
				resolve(JSON.parse(settings))
			} else {
				reject()
			}
		} catch(err) {
			reject()
		}
	})
}

export {
	getProjectFromLocalStorage,
	saveProjectToLocalStorage,
	getFontsFromLocalStorage,
	saveFontsFromLocalStorage,
	getPathsFromLocalStorage,
	savePathsToLocalStorage,
	getSettingsFromLocalStorage,
	saveSettingsToLocalStorage,
}
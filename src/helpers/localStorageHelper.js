import LZString from 'lz-string';

const PROJECT_PREFIX = 'project_';

function getProjectFromLocalStorageById(id) {
	return new Promise(function(resolve, reject){
		try {
			var project = localStorage.getItem(id);
			if(project) {
				try {
					var decompressed = LZString.decompress(project);
					if (decompressed) {
						project = decompressed;
					} else { 
						console.log('NOT COMPRESSED');
					}
				} catch (error) {
				}
				resolve(JSON.parse(project));
			} else {
				reject();
			}
		} catch(err) {
			reject();
		}
	})
}

async function getProjectFromLocalStorage(id) {
	return getProjectFromLocalStorageById(PROJECT_PREFIX + id);
}

// var overflow = 'a';
// for(var i = 0; i < 1000000; i += 1) {
// 	overflow += 'a';
// }

function saveProjectToLocalStorage(data, id) {
	let resolve, reject
	let prom = new Promise(function(_resolve, _reject){
		resolve = _resolve
		reject = _reject
	})
	try {
		let serialized = JSON.stringify(data)
		var compressed = LZString.compress(serialized);
		localStorage.setItem(PROJECT_PREFIX + id, compressed)
		// localStorage.setItem('overflow_', overflow)
		resolve()
	} catch(err) {
		reject(err)
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

async function getAllProjectsNamedFromLocalStorage() {
	const namedProjects = [];
	for (let key in localStorage) {
		if (!localStorage.hasOwnProperty(key)) {
				continue;
		}
		if (key.substring(0, PROJECT_PREFIX.length) === PROJECT_PREFIX) {
			try {
				
				const project = await getProjectFromLocalStorageById(key);
				if (project.name) {
					const jsonString = JSON.stringify(project);
					const size = (jsonString.length * 2);
					namedProjects.push({
						id: key,
						size: (size / 1024).toFixed(2) + " KB",
						name: decodeURIComponent(project.name),
					})
				}
			} catch (error) {
				// continue
			}
		}
	}
	return namedProjects;
}

function clearLocalStorage() {
	while (localStorage.length) {
		var key = localStorage.key(0);
		localStorage.removeItem(key);
	}
}

function clearProjectsInLocalStorage(ids) {
	for (let key in localStorage) {
		if (!localStorage.hasOwnProperty(key)) {
				continue;
		}
		if (ids.includes(key) || (ids.length === 0 && key.substring(0, PROJECT_PREFIX.length) === PROJECT_PREFIX))
		localStorage.removeItem(key);
	}
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
	clearLocalStorage,
	getAllProjectsNamedFromLocalStorage,
	clearProjectsInLocalStorage,
}
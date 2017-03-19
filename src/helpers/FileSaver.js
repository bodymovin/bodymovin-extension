function saveFile(data, formats, name) {
	var result;
	try {
		result = window.cep.fs.showSaveDialogEx('Select location', '', formats, name);
	} catch(err) {
		result = window.cep.fs.showOpenDialog(false, true);
	}
	if(result.data) {
		var targetFilePath = (result.data instanceof Array) ? result.data[0] + '/snapshot.svg' : result.data;
		var writeResult = window.cep.fs.writeFile(targetFilePath, data);
		if (0 !== writeResult.err) {
			console.log('ERROR: ', writeResult.err)
		}
	}
}

export default saveFile
function saveFile(data, formats, name) {
	var result = window.cep.fs.showSaveDialogEx('Select location', '', formats, name);
	if(result.data) {
		var targetFilePath = result.data;
		var writeResult = window.cep.fs.writeFile(targetFilePath, data);
		if (0 !== writeResult.err) {
		}
	}
}

export default saveFile
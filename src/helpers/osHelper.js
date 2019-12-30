import csInterface from './CSInterfaceHelper'

const getSeparator = () => {
	var sep;
	var OSVersion = csInterface.getOSInformation();
	if (OSVersion.indexOf("Windows") >= 0) {
		sep = '\\\\';
	} else {
		sep = '/';
	}
	return sep;
}

export {
	getSeparator
}
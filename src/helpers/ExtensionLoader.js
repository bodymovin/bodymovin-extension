import {SystemPath} from './CSInterface'
import csInterface from './CSInterfaceHelper'

var fileName = 'initializer.jsx';
var promise = new Promise(loadJSX);
var isRunning = false;

function loadJSX(resolve, reject) {
	function init(){
		if(isRunning) {
			return;
		}
		isRunning = true;
    	var extensionRoot = csInterface.getSystemPath(SystemPath.EXTENSION) + "/jsx/";
    	csInterface.evalScript('$.evalFile("' + extensionRoot + fileName + '");'
    	, function(){
			window.removeEventListener('focus', init);
			window.removeEventListener('click', init);
			window.removeEventListener('mousedown', init);
			window.removeEventListener('mouseenter', init);
			window.removeEventListener('mouseover', init);
			window.removeEventListener('mousemove', init);
			resolve();
    	});
	}
	window.addEventListener('focus', init);
	window.addEventListener('click', init);
	window.addEventListener('mousedown', init);
	window.addEventListener('mouseenter', init);
	window.addEventListener('mouseover', init);
	window.addEventListener('mousemove', init);
}

export default promise;
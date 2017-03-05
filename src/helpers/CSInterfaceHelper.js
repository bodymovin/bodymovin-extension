import {SystemPath, CSInterface} from './CSInterface'
var csInterface = new CSInterface();

function loadJSX(fileName, cb) {
    var extensionRoot = csInterface.getSystemPath(SystemPath.EXTENSION) + "/jsx/";
    csInterface.evalScript('$.evalFile("' + extensionRoot + fileName + '")', cb);
}

loadJSX('initializer.jsx')

export default csInterface
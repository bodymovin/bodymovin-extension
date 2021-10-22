import csInterface from './CSInterfaceHelper'
import extensionLoader from './ExtensionLoader'
import errorCodes from './enums/errorCodes'

function browseFolder(path) {

    return new Promise(function(resolve, reject) {
      function onSuccess(ev) {
        resolve(ev.data);
        removeListeners();
    
      }
      
      function onCancel() {
        reject({errorCode: errorCodes.FILE_CANCELLED});
        removeListeners();
      }

      function removeListeners() {
        csInterface.removeEventListener('bm:folder:uri', onSuccess)
        csInterface.removeEventListener('bm:folder:cancel', onCancel)
      }

    	csInterface.addEventListener('bm:folder:uri', onSuccess)
      csInterface.addEventListener('bm:folder:cancel', onCancel)
    
      extensionLoader.then(function(){
          path = path ? path.replace(/\\/g,"\\\\") : ''
          var eScript = '$.__bodymovin.bm_compsManager.browseFolderFromPath("' + path + '")';
          csInterface.evalScript(eScript);
      })
    })
}

export default browseFolder
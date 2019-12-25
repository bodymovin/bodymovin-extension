/*jslint vars: true , plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global bm_eventDispatcher, bm_generalUtils, bm_downloadManager, File, $*/

$.__bodymovin.bm_dataManager = (function () {
    var ob = {};
    var _endCallback;
    var _destinationPath;
    var JSON = $.__bodymovin.JSON;
    var bm_eventDispatcher = $.__bodymovin.bm_eventDispatcher;
    var bm_downloadManager = $.__bodymovin.bm_downloadManager;
    var bm_generalUtils = $.__bodymovin.bm_generalUtils;
    var bm_bannerExporter = $.__bodymovin.bm_bannerExporter;
    var bm_standardExporter = $.__bodymovin.bm_standardExporter;
    var bm_demoExporter = $.__bodymovin.bm_demoExporter;
    var bm_fileManager = $.__bodymovin.bm_fileManager;
    var layerTypes = $.__bodymovin.layerTypes;
    
    function separateComps(layers, comps) {
        var i, len = layers.length;
        for (i = 0; i < len; i += 1) {
            if (layers[i].ty === layerTypes.precomp && layers[i].compId) {
                comps.push({
                    id: layers[i].compId,
                    layers: layers[i].layers
                });
                separateComps(layers[i].layers, comps);
                delete layers[i].compId;
                delete layers[i].layers;
            }
        }
    }
    
    function deleteLayerParams(layers) {
        var i, len = layers.length;
        for (i = 0; i < len; i += 1) {
            delete layers[i].isValid;
            delete layers[i].isGuide;
            delete layers[i].render;
            delete layers[i].enabled;
            if (layers[i].ty === layerTypes.precomp && layers[i].layers) {
                deleteLayerParams(layers[i].layers);
            }
        }
    }
    
    function deleteExtraParams(data, settings) {
        if (data.fonts.length === 0) {
            delete data.fonts;
            delete data.chars;
        } else {
            if (!settings.glyphs) {
                delete data.chars;
            }
        }
        deleteLayerParams(data.layers);
    }

    function exportAVDVersion(data) {
        bm_eventDispatcher.sendEvent('bm:create:avd', data);
    }

    function saveAVDData(data) {
        var filePathName = _destinationPath.substr(_destinationPath.lastIndexOf('/') + 1);
        filePathName = filePathName.substr(0, filePathName.lastIndexOf('.'));
        var folderPath = _destinationPath.substr(0, _destinationPath.lastIndexOf('/') + 1);
        folderPath += filePathName + '.xml';
        var dataFile = new File(folderPath);
        dataFile.open('w', 'TEXT', '????');
        dataFile.encoding = 'UTF-8';
        try {
            dataFile.write(data);
            dataFile.close();
        } catch (err) {
            bm_eventDispatcher.sendEvent('bm:alert', {message: 'Could not write file.<br /> Make sure you have enabled scripts to write files. <br /> Edit > Preferences > General > Allow Scripts to Write Files and Access Network '});
        }
        _endCallback();
    }

    function saveAVDFailed() {
        bm_eventDispatcher.sendEvent('bm:alert', {message: 'Could not create AVD file'});
        _endCallback();
    }
    
    function saveData(data, destinationPath, config, callback) {

        var destinationFile = new File(destinationPath);
        var destinationFolder = destinationFile.parent;
        var destinationFileName = destinationFile.name;
        var destinationFileNameWithoutExtension = destinationFileName.substr(0, destinationFileName.lastIndexOf('.'));

        _endCallback = callback;
        _destinationPath = destinationPath;
        deleteExtraParams(data, config);
        separateComps(data.layers, data.comps);

        var stringifiedData = JSON.stringify(data);
        stringifiedData = stringifiedData.replace(/\n/g, '');
        bm_fileManager.addFile(destinationFileNameWithoutExtension + '.json', ['raw'], stringifiedData);


        ////
        var dataFile, segmentPath, fullFilePathName, filePathName;
        fullFilePathName = destinationPath.substr(destinationPath.lastIndexOf('/') + 1);





        dataFile = new File(destinationPath);
        ////
        if (config.demo) {
            bm_demoExporter.save(destinationPath);
        }
        if (config.export_mode === 'standard') {
            bm_standardExporter.save(destinationPath, config);
        } else if (config.export_mode === 'banner') {
            bm_bannerExporter.save(destinationPath, config, callback);
        } else {
            if (config.export_mode === 'standalone') {
                var bodymovinJsStr = bm_downloadManager.getStandaloneData();
                stringifiedData = bodymovinJsStr.replace("\"__[ANIMATIONDATA]__\"",  stringifiedData );
                stringifiedData = stringifiedData.replace("\"__[STANDALONE]__\"", 'true');
            }
            bm_fileManager.addFile(fullFilePathName, ['raw'], stringifiedData);
            if(config.avd) {
                exportAVDVersion(data);
            } else {
                _endCallback();
            }

        }

        ////
        
    }
    
    ob.saveData = saveData;
    ob.saveAVDData = saveAVDData;
    ob.saveAVDFailed = saveAVDFailed;
    
    return ob;
}());
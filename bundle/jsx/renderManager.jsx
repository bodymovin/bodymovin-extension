/*jslint vars: true , plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global app, File, bm_dataManager, Folder, $ */

$.__bodymovin.bm_renderManager = (function () {
    'use strict';
    var bm_eventDispatcher = $.__bodymovin.bm_eventDispatcher;
    var bm_projectManager = $.__bodymovin.bm_projectManager;
    var bm_compsManager = $.__bodymovin.bm_compsManager;
    var bm_dataManager = $.__bodymovin.bm_dataManager;
    var layerTypes = $.__bodymovin.layerTypes;
    var bm_layerElement = $.__bodymovin.bm_layerElement;
    var bm_ProjectHelper = $.__bodymovin.bm_ProjectHelper;
    var bm_fileManager = $.__bodymovin.bm_fileManager;
    var reportManager = $.__bodymovin.bm_reportsManager;
    var settingsHelper = $.__bodymovin.bm_settingsHelper;
    var versionHelper = $.__bodymovin.bm_versionHelper;
    
    var ob = {}, pendingLayers = [], pendingComps = [], destinationPath, fsDestinationPath, currentCompID, totalLayers, currentLayer, hasExpressionsFlag;
    var currentExportedComps = [];
    var processesState = {
        render: 'idle',
        report: 'idle',
    }

    function getParentData(layers, id) {
        var i = 0, len = layers.length;
        while(i < len) {
            if(layers[i].ind === id) {
                return layers[i];
            }
            i += 1;
        }
    }
    
    function restoreParents(layers) {
        
        var layerData, parentData, i, len = layers.length, hasChangedState = false;
        for (i = 0; i < len; i += 1) {
            layerData = layers[i];
            if (layerData.parent){
            }
            if (layerData.parent !== undefined && layerData.render !== false) {
                parentData = getParentData(layers, layerData.parent);
                if (parentData.render === false) {
                    parentData.ty = layerTypes.nullLayer;
                    hasChangedState = true;
                    parentData.render = true;
                    if (parentData.isValid === false || parentData.isGuide === false) {
                        parentData.isValid = true;
                    }
                    if(parentData.tt){
                        delete parentData.tt;
                    }
                    if(parentData.td){
                        delete parentData.td;
                    }
                }
            }
        }
        if (hasChangedState) {
            restoreParents(layers);
        }
    }

    /*function removeHiddenContent(shapes) {
        if(shapes) {
            var i = 0, len = shapes.length;
            while(i < len) {
                if(shapes[i].hd) {
                    shapes.splice(i,1);
                    i -= 1;
                    len -= 1;
                } else if(shapes[i].ty === 'gr') {
                    removeHiddenContent(shapes[i].it);
                }
                i += 1;
            }
        }
    }*/
    
    function createLayers(comp, layers, framerate, deepTraversing) {
        var currentCompSettings = settingsHelper.get();
        var i, len = comp.layers.length, layerInfo, layerData, prevLayerData;
        for (i = 0; i < len; i += 1) {
            layerInfo = comp.layers[i + 1];
            layerData = bm_layerElement.prepareLayer(layerInfo, currentCompSettings.should_include_av_assets);
            ob.renderData.exportData.ddd = layerData.ddd === 1 ? 1 : ob.renderData.exportData.ddd;
            if(currentCompSettings.hiddens && layerData.enabled === false){
                layerData.render = true;
                layerData.enabled = true;
                if(!layerData.td){
                    layerData.hd = true;
                }
            }
            if(currentCompSettings.guideds && layerData.isGuide === true){
                layerData.render = true;
                layerData.hd = true;
            }
            if (layerData.td && prevLayerData && prevLayerData.td) {
                prevLayerData.td = false;
                if (prevLayerData.enabled === false && !currentCompSettings.hiddens) {
                    prevLayerData.render = false;
                }
            } else if (layerData.tt) {
                if (layerData.render === false) {
                    if (prevLayerData.enabled === false && !currentCompSettings.hiddens) {
                        prevLayerData.render = false;
                    }
                    delete prevLayerData.td;
                    delete layerData.tt;
                } else if (prevLayerData.render === false) {
                    delete layerData.tt;
                }
            }
            layers.push(layerData);
            pendingLayers.push({data: layerData, layer: layerInfo, framerate: framerate});
            prevLayerData = layerData;
        }
        restoreParents(layers);
        for (i = 0; i < len; i += 1) {
            layerData = layers[i];
            layerInfo = comp.layers[i + 1];
            bm_layerElement.checkLayerSource(layerInfo, layerData);
            if (layerData.ty === layerTypes.text) {
                $.__bodymovin.bm_textShapeHelper.addComps();
            }
            if (layerData.ty === layerTypes.precomp && layerData.render !== false && layerData.compId) {
                currentExportedComps.push(layerData.compId);
                if(deepTraversing){
                    layerData.layers = [];
                    createLayers(layerInfo.source, layerData.layers, framerate, deepTraversing);
                }
            }
        }
    }

    function render(comp, destination, fsDestination, compSettings) {

        $.__bodymovin.bm_sourceHelper.reset();
        $.__bodymovin.bm_textShapeHelper.reset();

        if(!bm_fileManager.createTemporaryFolder()) {
            return;
        };

        processesState.render = 'working';
        processesState.report = 'working';

        ////
        app.beginUndoGroup("Render Bodymovin Animation");
        currentExportedComps = [];
        hasExpressionsFlag = false;
        currentCompID = comp.id;
        settingsHelper.set(compSettings)

        bm_ProjectHelper.init();
        bm_eventDispatcher.sendEvent('bm:render:update', {type: 'update', message: 'Starting Render', compId: currentCompID, progress: 0});
        destinationPath = destination;
        fsDestinationPath = fsDestination;
        bm_layerElement.reset();
        pendingLayers.length = 0;
        pendingComps.length = 0;
        var exportData = {
            v : versionHelper.get(),
            fr : comp.frameRate,
            ip : comp.workAreaStart * comp.frameRate,
            op : (comp.workAreaStart + comp.workAreaDuration) * comp.frameRate,
            w : comp.width,
            h : comp.height,
            nm: comp.name,
            ddd : 0,
            assets : [],
            comps : [],
            fonts : [],
            layers : [],
            markers : []
            
        };
        currentExportedComps.push(currentCompID);
        ob.renderData.exportData = exportData;
        ob.renderData.firstFrame = exportData.ip * comp.frameRate;
        createLayers(comp, exportData.layers, exportData.fr, true);
        exportExtraComps(exportData);
        exportCompMarkers(exportData, comp);
        exportMotionBlur(exportData, comp);
        totalLayers = pendingLayers.length;
        currentLayer = 0;
        createReport();
        app.scheduleTask('$.__bodymovin.bm_renderManager.renderNextLayer();', 20, false);
    }

    function onReportFail(error) {
        bm_eventDispatcher.log('REPORT FAILED');
        if (error) {
            bm_eventDispatcher.log(error.message);
            bm_eventDispatcher.log(error.line);
            bm_eventDispatcher.log(error.fileName);
        }
        bm_eventDispatcher.log($.stack);
        processesState.report = 'ended';
        checkProcesses();
    }

    function onReportComplete(report) {
        var reportData = report.serialize();
        var currentCompSettings = settingsHelper.get();
        var reportPath = bm_dataManager.saveReport(reportData, destinationPath);
        bm_eventDispatcher.log();
        bm_eventDispatcher.sendEvent('bm:report:saved',
            {
                compId: currentCompID,
                reportPath: reportPath,
            });
        processesState.report = 'ended';
        checkProcesses();
    }

    function createReport() {
        if (settingsHelper.shouldIncludeReport()) {
            var comp = bm_projectManager.getCompositionById(currentCompID);
            reportManager.createReport(comp, onReportComplete, onReportFail);
        } else {
            processesState.report = 'ended';
            checkProcesses();
        }
    }

    function checkProcesses() {
        if (processesState.report === 'ended' && processesState.render === 'ended') {
            clearData();
            bm_eventDispatcher.sendEvent('bm:render:update', {type: 'update', message: 'Render finished', compId: currentCompID, progress: 1, isFinished: true, fsPath: fsDestinationPath});
        } else if(processesState.render === 'ended') {
            bm_eventDispatcher.sendEvent('bm:render:update', {type: 'update', message: 'Finishing Report', compId: currentCompID, progress: 1});
        }
    }

    function exportMotionBlur(exportData, comp) {
        if (comp.motionBlur && settingsHelper.shouldIncludeNotSupportedProperties()) {
            exportData.mb = {
              sa : comp.shutterAngle,
              sp : comp.shutterPhase,
              spf: comp.motionBlurSamplesPerFrame,
              asl: comp.motionBlurAdaptiveSampleLimit
            };
        }
    }

    function exportCompMarkers(exportData, comp) {
        
        if(comp.markerProperty && comp.markerProperty.numKeys >= 1) {
            var markerProperty = comp.markerProperty;
            var markersList = exportData.markers;
            var len = markerProperty.numKeys, markerElement;
            var markerData;
            for (var i = 0; i < len; i += 1) {
                markerData = {};
                markerElement = markerProperty.keyValue(i + 1);
                markerData.tm = markerProperty.keyTime(i + 1) * exportData.fr;
                markerData.cm = markerElement.comment;
                markerData.dr = markerElement.duration * exportData.fr;
                markersList.push(markerData);
            }
        }
    }

    function exportExtraComps(exportData){
        var currentCompSettings = settingsHelper.get();
        if(currentCompSettings.extraComps.active) {
            var list = currentCompSettings.extraComps.list;
            var i, len = list.length, compData;
            var j, jLen = currentExportedComps.length;
            for(i=0;i<len;i+=1){
                j = 0;
                while(j<jLen){
                    if(currentExportedComps[j] === list[i]){
                        break;
                    }
                    j += 1;
                }
                if(j===jLen){
                    var comp = bm_projectManager.getCompositionById(list[i]);
                    compData = {
                        layers: [],
                        id: comp.id,
                        nm: comp.name,
                        xt: 1,
                        w: comp.width,
                        h: comp.height
                    };
                    createLayers(comp, compData.layers, exportData.fr, false);
                    exportData.comps.push(compData);
                }
            }
        }
    }
    
    function reset() {
        pendingLayers.length = 0;
        pendingComps.length = 0;

        settingsHelper.set(null)
        bm_ProjectHelper.end();
    }

    function dataSaved() {
        processesState.render = 'ended';
        checkProcesses();
    }

    function clearData() {
        reset();
        $.__bodymovin.bm_textShapeHelper.removeComps();
        bm_compsManager.renderComplete();
        app.endUndoGroup();
    }
    
    function saveData() {
        var currentCompSettings = settingsHelper.get();
        bm_eventDispatcher.sendEvent('bm:render:update', {type: 'update', message: 'Saving data ', compId: currentCompID, progress: 1});
        try {
            bm_dataManager.saveData(ob.renderData.exportData, destinationPath, currentCompSettings, dataSaved);
        } catch(err) {
            bm_eventDispatcher.sendEvent('bm:alert', {message: 'Could not export files <br /> Is Preferences > Scripting & Expressions > Allow Scripts to Write Files and Access Network enabled?'});
            bm_eventDispatcher.sendEvent('bm:render:update', {type: 'update', message: 'Render Failed ', compId: currentCompID, progress: 1, isFinished: false, fsPath: fsDestinationPath});
        }
    }
    
    function clearUnrenderedLayers(layers) {
        var i, len = layers.length;
        for (i = 0; i < len; i += 1) {
            if (layers[i].render === false) {
                layers.splice(i, 1);
                i -= 1;
                len -= 1;
            } else if (layers[i].ty === layerTypes.precomp && layers[i].layers) {
                clearUnrenderedLayers(layers[i].layers);
            }
        }
    }
    
    /*function clearNames(layers) {
        if (hasExpressionsFlag) {
            return;
        }
        var i, len = layers.length;
        for (i = 0; i < len; i += 1) {
            layers[i].nm = null;
            delete layers[i].nm;
            if (layers[i].ty === layerTypes.precomp && layers[i].layers) {
                clearNames(layers[i].layers);
            }
        }
        
    }*/
    
    function removeExtraData() {
        clearUnrenderedLayers(ob.renderData.exportData.layers);
        bm_ProjectHelper.end();
        /* Todo check if "clearNames" it changes filesize significantly */
        //clearNames(ob.renderData.exportData.layers);
    }
    
    function renderNextLayer() {
        if (bm_compsManager.cancelled) {
            return;
        }
        var currentCompSettings = settingsHelper.get();
        if (pendingLayers.length) {
            var nextLayerData = pendingLayers.pop();
            currentLayer += 1;
            bm_eventDispatcher.sendEvent('bm:render:update', {type: 'update', message: 'Rendering layer: ' + nextLayerData.layer.name, compId: currentCompID, progress: currentLayer / totalLayers});
            bm_layerElement.renderLayer(nextLayerData, currentCompSettings.hiddens, renderLayerComplete);
            /*if (nextLayerData.data.ty === 4 && !currentCompSettings.hiddens) {
                removeHiddenContent(nextLayerData.data.shapes);
            }*/
        } else {
            removeExtraData();
            $.__bodymovin.bm_sourceHelper.exportImages(destinationPath, ob.renderData.exportData.assets, currentCompID, currentCompSettings.original_names, currentCompSettings.original_assets);
        }
    }
    
    function checkFonts() {
        var fonts = $.__bodymovin.bm_sourceHelper.getFonts();
        var exportData;
        if (fonts.length === 0) {
            saveData();
        } else {
            var currentCompSettings = settingsHelper.get();
            if (currentCompSettings.glyphs) {
                var fontsInfo = {
                    list: []
                };
                var list = fontsInfo.list;
                var i, len = fonts.length, fontOb;
                for (i = 0; i < len; i += 1) {
                    fontOb = {};
                    fontOb.fName = fonts[i].name;
                    fontOb.fFamily = fonts[i].family;
                    fontOb.fStyle = fonts[i].style;
                    list.push(fontOb);
                }
                exportData = ob.renderData.exportData;
                exportData.fonts = fontsInfo;
                $.__bodymovin.bm_textShapeHelper.exportFonts(fontsInfo);
                $.__bodymovin.bm_textShapeHelper.exportChars(fontsInfo);
            } else {
                exportData = ob.renderData.exportData;
                bm_eventDispatcher.sendEvent('bm:render:fonts', {type: 'save', compId: currentCompID, fonts: fonts});
            }
        }
    }
    
    function setChars(chars) {
        if (bm_compsManager.cancelled) {
            return;
        }
        //bm_eventDispatcher.sendEvent('bm:render:chars', {type: 'save', compId: currentCompID, chars: chars});
        var i, len = chars.length;
        for (i = 0; i < len; i += 1) {
            delete chars[i].font;
        }
        setCharsData(chars)
    }
    
    function setFontData(fontData) {
        var exportData = ob.renderData.exportData;
        exportData.fonts = fontData;
        $.__bodymovin.bm_textShapeHelper.exportFonts(fontData);
        //$.__bodymovin.bm_textShapeHelper.exportChars(fontData);
        saveData();
    }
    
    function setCharsData(charData) {
        var exportData = ob.renderData.exportData;
        exportData.chars = charData;
        saveData();
    }
    
    function imagesReady() {
        checkFonts();
    }
    
    function renderLayerComplete() {
        app.scheduleTask('$.__bodymovin.bm_renderManager.renderNextLayer();', 20, false);
    }
    
    function hasExpressions() {
        hasExpressionsFlag = true;
    }

    function getVersion() {
        bm_eventDispatcher.sendEvent('bm:version', {value: versionHelper.get()});
        bm_eventDispatcher.sendEvent('app:version', {value: app.version});
    }
    
    ob.renderData = {
        exportData : {
            assets : []
        }
    };
    ob.render = render;
    ob.renderNextLayer = renderNextLayer;
    ob.setChars = setChars;
    ob.imagesReady = imagesReady;
    ob.setFontData = setFontData;
    ob.setCharsData = setCharsData;
    ob.hasExpressions = hasExpressions;
    ob.getVersion = getVersion;
    
    return ob;
}());
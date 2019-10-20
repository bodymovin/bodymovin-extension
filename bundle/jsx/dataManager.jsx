/*jslint vars: true , plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global bm_eventDispatcher, bm_generalUtils, bm_downloadManager, File*/

$.__bodymovin.bm_dataManager = (function () {
    'use strict';
    var ob = {};
    var animationSegments;
    var segmentCount = 0;
    var _endCallback;
    var _destinationPath;
    var JSON = $.__bodymovin.JSON;
    var bm_eventDispatcher = $.__bodymovin.bm_eventDispatcher;
    var bm_downloadManager = $.__bodymovin.bm_downloadManager;
    var bm_generalUtils = $.__bodymovin.bm_generalUtils;
    var layerTypes = $.__bodymovin.layerTypes;
    
    function addCompsToSegment(layers, comps, segmentComps) {
        var i, len = layers.length, j, jLen;
        for (i = 0; i < len; i += 1) {
            if (layers[i].ty === layerTypes.precomp) {
                j = 0;
                jLen = comps.length;
                while (j < jLen) {
                    if (comps[j].id === layers[i].refId) {
                        segmentComps.push(comps.splice(j, 1)[0]);
                        addCompsToSegment(segmentComps[segmentComps.length - 1].layers, comps, segmentComps);
                        break;
                    }
                    j += 1;
                }
            }
        }
    }
    
    function splitAnimation(data, time) {
        var comps = data.comps;
        var layers = data.layers;
        var frameRate = data.fr;
        var totalFrames = data.op - data.ip;
        var i, len = layers.length, j, jLen;
        var currentSegment = time * frameRate;
        var segmentLength = time * frameRate;
        animationSegments = [];
        var currentPeriod, segments, segmentComps;
        for (i = 0; i < len; i += 1) {
            if (layers[i].ip < currentSegment) {
                if (layers[i].ty === layerTypes.precomp) {
                    if (!segmentComps) {
                        segmentComps = [];
                    }
                    j = 0;
                    jLen = comps.length;
                    while (j < jLen) {
                        if (comps[j].id === layers[i].refId) {
                            segmentComps.push(comps.splice(j, 1)[0]);
                            addCompsToSegment(segmentComps[segmentComps.length - 1].layers, comps, segmentComps);
                            break;
                        }
                        j += 1;
                    }
                }
            }
        }
        if (data.assets && segmentComps && segmentComps.length) {
            data.assets = data.assets.concat(segmentComps);
            if (data.comps) {
                delete data.comps;
            }
        } else {
            data.assets = segmentComps;
        }
        
        var timeData;
        
        while (currentSegment < totalFrames) {
            currentPeriod = null;
            segmentComps = null;
            for (i = 0; i < len; i += 1) {
                if (layers[i].ip >= currentSegment && layers[i].ip < currentSegment + segmentLength) {
                    if (!segments) {
                        segments = [];
                    }
                    if (layers[i].ty === layerTypes.precomp) {
                        if (!segmentComps) {
                            segmentComps = [];
                        }
                        j = 0;
                        jLen = comps.length;
                        while (j < jLen) {
                            if (comps[j].id === layers[i].refId) {
                                segmentComps.push(comps.splice(j, 1)[0]);
                                addCompsToSegment(segmentComps[segmentComps.length - 1].layers, comps, segmentComps);
                                break;
                            }
                            j += 1;
                        }
                    }
                    if (!currentPeriod) {
                        timeData = currentSegment / frameRate;
                        currentPeriod = {
                            layers: []
                        };
                        segmentCount += 1;
                    }
                    var randomId = bm_generalUtils.random(10);
                    layers[i].id = randomId;
                    currentPeriod.layers.push(layers[i]);
                    layers[i] = {
                        id: randomId,
                        ty: 99
                    };
                }
            }
            if (currentPeriod) {
                currentPeriod.assets = segmentComps;
                animationSegments.push(currentPeriod);
                segments.push({
                    time: timeData
                });
            }
            currentSegment += segmentLength;
        }
        data.segments = segments;
    }
    
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
        delete data.markers;
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

    var base64Decode = function F(s)  
    {  
        var ALPHA = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";  
        
        F.cache || F.cache = {  
            RE_NON_ALPHA: new RegExp('[^' + ALPHA + ']'),  
            RE_BAD_EQUALS: /\=([^=]|\=\=)/  
            };  
    
        if( (n % 4) || F.cache.RE_NON_ALPHA.test(s) || F.cache.RE_BAD_EQUALS.test(s) )  
            {  
            throw Error("Invalid Base64 data");  
            }  
    
        var    fChr = String.fromCharCode,  
            n = s.length >>> 0,  
            a = [],  
            c = 0,  
            i0, i1, i2, i3,  
            b, b0, b1, b2;  
    
        while( c < n )  
            {  
            i0 = ALPHA.indexOf(s[c++]);  
            i1 = ALPHA.indexOf(s[c++]);  
            i2 = ALPHA.indexOf(s[c++]);  
            i3 = ALPHA.indexOf(s[c++]);  
            
            b = (i0 << 18) + (i1 << 12) + ((i2 & 63) << 6) + (i3 & 63);  
            b0 = (b & (255 << 16)) >> 16;  
            b1 = (i2 == 64) ? -1 : (b & (255 << 8)) >> 8;  
            b2 = (i3 == 64) ? -1 : (b & 255);  
    
            a[a.length] = fChr(b0);  
            if( 0 <= b1 ) a[a.length] = fChr(b1);  
            if( 0 <= b2 ) a[a.length] = fChr(b2);  
            }  
    
        // Cleanup and return  
        // ---  
        s = a.join('');  
        a.length = 0;  
        a = fChr = null;  
        return s;  
    };  

    function humanFileSize(size) {
        var i = Math.floor( Math.log(size) / Math.log(1024) );
        return ( size / Math.pow(1024, i) ).toFixed(2) * 1 + ' ' + ['B', 'kB', 'MB', 'GB', 'TB'][i];
    }

    function dataCompressed(base64Data) {
        var buf = base64Decode(base64Data)
        if (buf.length > 1024 * 64) {
            bm_eventDispatcher.sendEvent('bm:alert', {message: 'Failed!<br />Result file size of ' + humanFileSize(buf.length) + ' exceeds the limit of 64 KB.<br />Optimize or simplify your composition to meet the criteria'});
            _endCallback();
            return;
        }

        try {
            var f = new File(_destinationPath);
            f.encoding = "BINARY";
            f.open ("w");
            f.write(buf)
            f.close()
    
        } catch (errr) {
            bm_eventDispatcher.sendEvent('bm:alert', {message: 'Could not write file.<br /> Make sure you have enabled scripts to write files. <br /> Edit > Preferences > General > Allow Scripts to Write Files and Access Network '});
        }

        _endCallback();
    }

    function checkItems(items, shapes) {
        var error = null;
        if (items != null) {
            var i, itemsLen = items.length;

            for (i = 0; i < itemsLen; i += 1) {
                if (items[i].ty == "rp") {
                    error = 'Composition should not include any Repeaters';
                    break;
                }
                if (items[i].ty == "sr") {
                    error = 'Composition should not include any Star Shapes';
                    break;
                }
                if (items[i].ty == "gs") {
                    error = 'Composition should not include any Gradient Strokes';
                    break;
                }

                if (error == null && shapes == true) {
                    error = checkItems(items[i].it, false)
                    if (error != null) {
                        break;
                    }
                }
            }
        }
        return error;
    }

    function checkLayers(layers) {
        var error = null;
        if (layers != null) {
            var i, layersLen = layers.length;
loop:
            for (i = 0; i < layersLen; i += 1) {
                if (layers[i].ddd != null && layers[i].ddd != 0) {
                    error = 'Composition should not include any 3D Layers';
                    break;
                }
                if (layers[i].sr != null && layers[i].sr != 1) {
                    error = 'Composition should not include any Time Stretching';
                    break;
                }
                if (layers[i].tm != null) {
                    error = 'Composition should not include any Time Remapping';
                    break;
                }
                if (layers[i].ty === 1) {
                    error = 'Composition should not include any Solids';
                    break;
                }
                if (layers[i].ty === 2) {
                    error = 'Composition should not include any Images';
                    break;
                }
                if (layers[i].ty === 5) {
                    error = 'Composition should not include any Texts';
                    break;
                }
                if (layers[i].ty === 9) {
                    error = 'Composition should not include any Videos';
                    break;
                }
                if (layers[i].hasMask === true || layers[i].masksProperties != null) {
                    error = 'Composition should not include any Masks';
                    break;
                }
                if (layers[i].ao === 1) {
                    error = 'Composition should not include any Auto-Oriented Layers';
                    break;
                }

                error = checkItems(layers[i].shapes, true);
                if (error != null) {
                    break;
                }
            }
        }
        return error;
    }
    
    function saveData(data, destinationPath, config, callback) {
        _endCallback = callback;
        _destinationPath = destinationPath;
        deleteExtraParams(data, config);
        separateComps(data.layers, data.comps);

        if (data.comps) {
            if (data.assets) {
                data.assets = data.assets.concat(data.comps);
            } else {
                data.assets = data.comps;
            }
            data.comps = null;
            delete data.comps;
        }

        var string = JSON.stringify(data);
        string = string.replace(/\n/g, '');

        var error = null;

        var frameRate = data.fr;
        if (frameRate != 30.0 && frameRate != 60.0) {
            error = 'Composition framerate must be exactly 30 or 60 FPS';
        }

        var totalFrames = data.op - data.ip;

        var duration = totalFrames / frameRate;
        if (error == null && duration > 3.0) {
            error = 'Composition duration must be not greater than 3 seconds';
        }

        if (error == null && !((data.w == 100 && data.h == 100) || (data.w == 512 && data.h >= 512 && data.h <= 832 && data.h % 16 == 0) || (data.h == 512 && data.w >= 512 && data.w <= 832 && data.w % 16 == 0))) {
           error = 'Composition dimensions should be exactly 512x512px (or 100x100px for sticker set thumbnail)';
        }

        if (error == null && data.ddd != null && data.ddd != 0) {
            error = 'Composition should not include any 3D Layers';
        }

        var assets = data.assets;
        if (error == null && assets != null) {
            var i, assetsLen = assets.length;
            for (i = 0; i < assetsLen; i += 1) {
                var layers = assets[i].layers;
                error = checkLayers(layers);
                if (error != null) {
                    break;
                }
            }
        }

        if (error == null) {
            error = checkLayers(data.layers);            
        }

        if (error != null) {
            bm_eventDispatcher.sendEvent('bm:alert', {message: 'Render Failed!<br />' + error});
            _endCallback()
            return
        }

        bm_eventDispatcher.sendEvent('tg:compress', {path: destinationPath, message: string});
        
        animationSegments = [];
        segmentCount = 0;
    }
    
    ob.saveData = saveData;
    ob.saveAVDData = saveAVDData;
    ob.saveAVDFailed = saveAVDFailed;
    ob.dataCompressed = dataCompressed;
    
    return ob;
}());
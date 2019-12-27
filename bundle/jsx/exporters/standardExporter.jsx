/*jslint vars: true , plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global File, Folder, $*/

$.__bodymovin.bm_standardExporter = (function () {

    var layerTypes = $.__bodymovin.layerTypes;
    var JSON = $.__bodymovin.JSON;
    var bm_fileManager = $.__bodymovin.bm_fileManager;
    var bm_generalUtils = $.__bodymovin.bm_generalUtils;
    var exporterHelpers = $.__bodymovin.bm_exporterHelpers;
	var ob = {}
    var animationSegments;
	var _callback;
    
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

    function moveCompsAssetsToCompsArray(data) {
    	if(!data.assets) {
    		return;
    	}
		var assets = data.assets;
		var comps = [];
		var i = 0, len = assets.length;
		var splicedComp;
		while (i < len) {
			if (assets[i].layers) {
				splicedComp = assets.splice(i, 1);
				comps.push(splicedComp[0]);
				i -= 1;
				len -= 1;
			}
			i += 1;
		}
		data.comps = comps;
    }

	function splitAnimation(data, time) {
		moveCompsAssetsToCompsArray(data);
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
	    } else if(segmentComps) {
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

	function save(destinationPath, config, callback) {

		_callback = callback;

		if (config.export_modes.standard) {
			var destinationData = exporterHelpers.parseDestination(destinationPath, '');

			var destinationFile = new File(destinationData.folder.fsName);
			destinationFile.changePath(destinationData.fileName + '.json');

			var rawFiles = bm_fileManager.getFilesOnPath(['raw']);
			var animationStringData = exporterHelpers.getJsonData(rawFiles);
			var data = JSON.parse(animationStringData);

	        var dataFile, string;
			if (config.segmented) {
			    splitAnimation(data, config.segmentedTime);
			    var i, len = animationSegments.length;
			    // filePathName = destinationPath.substr(destinationPath.lastIndexOf('/') + 1);
			    for (i = 0; i < len; i += 1) {
			        dataFile = new File(destinationData.folder.fsName);
			        dataFile.changePath(destinationData.fileName + '_' + i + '.json');
			        dataFile.open('w', 'TEXT', '????');
			        dataFile.encoding = 'UTF-8';
			        string = JSON.stringify(animationSegments[i]);
        			string = string.replace(/\n/g, '');
			        try {
			            dataFile.write(string); //DO NOT ERASE, JSON UNFORMATTED
			            //dataFile.write(JSON.stringify(ob.renderData.exportData, null, '  ')); //DO NOT ERASE, JSON FORMATTED
			            dataFile.close();
			        } catch (err) {
			        	// TODO: handle error
			        }
			    }
			}

	        destinationFile.open('w', 'TEXT', '????');
	        destinationFile.encoding = 'UTF-8';
	        string = JSON.stringify(data);
			string = string.replace(/\n/g, '');
	        try {
	            destinationFile.write(string); //DO NOT ERASE, JSON UNFORMATTED
	            //destinationFile.write(JSON.stringify(ob.renderData.exportData, null, '  ')); //DO NOT ERASE, JSON FORMATTED
	            destinationFile.close();
				_callback(exporterHelpers.exportTypes.STANDARD, exporterHelpers.exportStatuses.SUCCESS);
	        } catch (err) {
				_callback(exporterHelpers.exportTypes.STANDARD, exporterHelpers.exportStatuses.FAILED);
	        }
			exporterHelpers.saveAssets(rawFiles, destinationData.folder);
		} else {
			_callback(exporterHelpers.exportTypes.STANDARD, exporterHelpers.exportStatuses.SUCCESS);
		}

	}

	ob.save = save;
    
    return ob;
}());
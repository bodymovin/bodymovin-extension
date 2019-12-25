/*jslint vars: true , plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global File, Folder, $*/

$.__bodymovin.bm_standardExporter = (function () {

	var bm_eventDispatcher = $.__bodymovin.bm_eventDispatcher;
    var layerTypes = $.__bodymovin.layerTypes;
    var JSON = $.__bodymovin.JSON;
    var bm_fileManager = $.__bodymovin.bm_fileManager;
    var bm_generalUtils = $.__bodymovin.bm_generalUtils;
	var ob = {}
    var animationSegments;

    function getJsonData(rawFiles) {
    	var i = 0, len = rawFiles.length;
    	while(i < len) {
    		if(rawFiles[i].name.indexOf('.json') !== -1) {
    			break;
    		}
    		i += 1;
    	}
    	var fileData = bm_fileManager.getFileById(rawFiles[i].id);
    	var jsonFile = fileData.file;
    	jsonFile.open('r');
    	var content = jsonFile.read();

    	jsonFile.close();
    	return content;
    }
    
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

	    if (segmentComps) {
	    	bm_eventDispatcher.log(segmentComps.length)
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

	function saveAssets(rawFiles, destinationFolder) {
		var i = 0, len = rawFiles.length;
		// TODO improve this solution
		while(i < len) {
			if(rawFiles[i].name.indexOf('.json') === -1) {
				var fileData = bm_fileManager.getFileById(rawFiles[i].id);
				if (fileData) {
					var file = fileData.file;
					if(file.exists) {
						var destinationFileFolder = new Folder(destinationFolder.fsName);
						// TODO improve this solution even more
						destinationFileFolder.changePath('images');
						if (!destinationFileFolder.exists) {
							destinationFileFolder.create();
						}
						var destinationFile = new File(destinationFileFolder.fsName);
						destinationFile.changePath(file.name);
						if (!file.copy(destinationFile.fsName)) {
							bm_eventDispatcher.log('COPY FAILED')
						}
					}
				}
			}
			i += 1;
		}
	}

	function save(destinationPath, config) {

		var originalDestinationFile = new File(destinationPath);
		var destinationFileName = originalDestinationFile.name;
		var renderDestinationFolder = new Folder(originalDestinationFile.parent);
		renderDestinationFolder.changePath('render');
		if (!renderDestinationFolder.exists) {
			renderDestinationFolder.create();
		}
		var destinationFile = new File(renderDestinationFolder.fsName);
		destinationFile.changePath(destinationFileName);

		var rawFiles = bm_fileManager.getFilesOnPath(['raw']);
		var animationStringData = getJsonData(rawFiles);
		var data = JSON.parse(animationStringData);

        var dataFile, string;
		if (config.segmented) {
		    splitAnimation(data, config.segmentedTime);
		    var i, len = animationSegments.length;
		    // filePathName = destinationPath.substr(destinationPath.lastIndexOf('/') + 1);
		    for (i = 0; i < len; i += 1) {
		        dataFile = new File(renderDestinationFolder.fsName);
		        dataFile.changePath('data_' + i + '.json');
		        dataFile.open('w', 'TEXT', '????');
		        dataFile.encoding = 'UTF-8';
		        string = JSON.stringify(animationSegments[i]);
		        try {
		            dataFile.write(string); //DO NOT ERASE, JSON UNFORMATTED
		            //dataFile.write(JSON.stringify(ob.renderData.exportData, null, '  ')); //DO NOT ERASE, JSON FORMATTED
		            dataFile.close();
		        } catch (err) {
		            bm_eventDispatcher.sendEvent('bm:alert', {message: 'Could not write file.<br /> Make sure you have enabled scripts to write files. <br /> Edit > Preferences > General > Allow Scripts to Write Files and Access Network '});
		        }
		    }
		} else {
			if (data.comps) {
			    if (data.assets) {
			        data.assets = data.assets.concat(data.comps);
			    } else {
			        data.assets = data.comps;
			    }
			    data.comps = null;
			    delete data.comps;
			}
		}

        destinationFile.open('w', 'TEXT', '????');
        destinationFile.encoding = 'UTF-8';
        string = JSON.stringify(data);
        try {
            destinationFile.write(string); //DO NOT ERASE, JSON UNFORMATTED
            //destinationFile.write(JSON.stringify(ob.renderData.exportData, null, '  ')); //DO NOT ERASE, JSON FORMATTED
            destinationFile.close();
        } catch (err) {
            bm_eventDispatcher.sendEvent('bm:alert', {message: 'Could not write file.<br /> Make sure you have enabled scripts to write files. <br /> Edit > Preferences > General > Allow Scripts to Write Files and Access Network '});
        }

		saveAssets(rawFiles, renderDestinationFolder);
	}

	ob.save = save;
    
    return ob;
}());
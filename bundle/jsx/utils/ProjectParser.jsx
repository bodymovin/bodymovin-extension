/*global $, app, File*/

$.__bodymovin.bm_ProjectHelper = (function(){

    var bm_generalUtils = $.__bodymovin.bm_generalUtils;
    var bm_eventDispatcher = $.__bodymovin.bm_eventDispatcher;
    var JSON = $.__bodymovin.JSON;
    var fileString = '';
    var parsedProjectData = null;

    var ob = {};
    ob.init = init;
    ob.getGradientData = getGradientData;
    ob.getGradientDataByRef = getGradientDataByRef;
    ob.end = end;

    function init(){
        fileString = '';
        parsedProjectData = null;
    }

    function end(){
        fileString = '';
        parsedProjectData = null;
    }

    function getProjectData(){
        var proj = app.project;
        var ff = proj.file;
        if(!ff) {
            fileString = '';
        } else {
            var demoFile = new File(ff.absoluteURI);
            var isAE26OrAbove = parseFloat(app.version) >= 26;
            var isOpen;
            if (isAE26OrAbove) {
                demoFile.encoding = 'BINARY';
                isOpen = demoFile.open('r', 'BINARY', '????');
            } else {
                isOpen = demoFile.open('r', 'TEXT', '????');
                //demoFile.encoding = 'UTF-8';
            }
            if (isOpen) {
                fileString = demoFile.read(demoFile.length);
                demoFile.close();
            } else {
                fileString = '';
            }
        }
        parsedProjectData = null;
    }

    function ByteArray(data) {
        this.data = data || '';
        this._position = 0;
    }

    ByteArray.prototype.bytesAvailable = function() {
        return this.data.length - this._position;
    };

    ByteArray.prototype.empty = function() {
        return !this.data || this.data.length === 0;
    };

    ByteArray.prototype.length = function() {
        return this.data.length;
    };

    ByteArray.prototype.position = function() {
        return this._position;
    };

    ByteArray.prototype.setPosition = function(value) {
        if (value >= 0 && value <= this.data.length) {
            this._position = value;
        }
    };

    ByteArray.prototype.skip = function(size) {
        this._position = Math.min(this.data.length, this._position + size);
    };

    ByteArray.prototype.readUint8 = function() {
        if (this.bytesAvailable() < 1) {
            return 0;
        }
        var value = this.data.charCodeAt(this._position) & 255;
        this._position += 1;
        return value;
    };

    ByteArray.prototype.readInt8 = function() {
        var value = this.readUint8();
        if (value > 127) {
            value -= 256;
        }
        return value;
    };

    ByteArray.prototype.readUint16 = function() {
        if (this.bytesAvailable() < 2) {
            return 0;
        }
        var position = this._position;
        var data = this.data;
        var value = (((data.charCodeAt(position) & 255) << 8) | (data.charCodeAt(position + 1) & 255)) >>> 0;
        this._position += 2;
        return value;
    };

    ByteArray.prototype.readUint32 = function() {
        if (this.bytesAvailable() < 4) {
            return 0;
        }
        var position = this._position;
        var data = this.data;
        var value = ((((data.charCodeAt(position) & 255) << 24) >>> 0) + ((data.charCodeAt(position + 1) & 255) << 16) + ((data.charCodeAt(position + 2) & 255) << 8) + (data.charCodeAt(position + 3) & 255)) >>> 0;
        this._position += 4;
        return value;
    };

    ByteArray.prototype.readInt32 = function() {
        var value = this.readUint32();
        if (value > 2147483647) {
            value -= 4294967296;
        }
        return value;
    };

    ByteArray.prototype.readBytes = function(length) {
        if (this.bytesAvailable() < length) {
            return new ByteArray('');
        }
        var bytes = new ByteArray(this.data.substr(this._position, length));
        this._position += length;
        return bytes;
    };

    ByteArray.prototype.readUTF8String = function() {
        var start = this._position;
        while (this._position < this.data.length && (this.data.charCodeAt(this._position) & 255) !== 0) {
            this._position += 1;
        }
        return decodeUtf8String(this.data.substring(start, this._position));
    };

    function decodeUtf8String(value) {
        try {
            return decodeURIComponent(escape(value));
        } catch (error) {
            return value;
        }
    }

    function getEmptyTag() {
        return {
            name: '',
            bytes: new ByteArray('')
        };
    }

    function readKeyName(bytes) {
        if (bytes.bytesAvailable() < 4) {
            return '';
        }
        var name = bytes.data.substr(bytes.position(), 4);
        bytes.skip(4);
        return name;
    }

    function readTag(bytes) {
        if (bytes.bytesAvailable() < 8) {
            return getEmptyTag();
        }
        var tag = getEmptyTag();
        tag.name = readKeyName(bytes);
        var length = bytes.readUint32();
        tag.bytes = bytes.readBytes(length);
        if (bytes.position() % 2 === 1) {
            bytes.skip(1);
        }
        return tag;
    }

    function readBody(bytes) {
        var tag = readTag(bytes);
        if (tag.bytes.bytesAvailable() < 4) {
            return new ByteArray('');
        }
        tag.bytes.skip(4);
        return tag.bytes.readBytes(tag.bytes.bytesAvailable());
    }

    function matchesValue(value, values) {
        var i;
        var len = values.length;
        for (i = 0; i < len; i += 1) {
            if (value === values[i]) {
                return true;
            }
        }
        return false;
    }

    function readFirstTagByName(bytes, tagName) {
        return readFirstTagByNames(bytes, [tagName]);
    }

    function readFirstTagByNames(bytes, tagNames) {
        while (bytes.bytesAvailable() > 0) {
            var tag = readTag(bytes);
            if (tag.name === 'LIST') {
                var listName = readKeyName(tag.bytes);
                if (matchesValue(listName, tagNames)) {
                    tag.name = listName;
                    tag.bytes = tag.bytes.readBytes(tag.bytes.bytesAvailable());
                    return tag;
                }
                var nestedTag = readFirstTagByNames(tag.bytes, tagNames);
                if (!nestedTag.bytes.empty()) {
                    return nestedTag;
                }
            }
            if (matchesValue(tag.name, tagNames)) {
                return tag;
            }
        }
        return getEmptyTag();
    }

    function readFirstGroupByMatchName(bytes, matchName) {
        return readFirstGroupByMatchNames(bytes, [matchName]);
    }

    function readFirstGroupByMatchNames(bytes, matchNames) {
        while (bytes.bytesAvailable() > 0) {
            var tag = readTag(bytes);
            if (tag.name === 'tdmn') {
                var key = tag.bytes.readUTF8String();
                if (matchesValue(key, matchNames)) {
                    tag = readTag(bytes);
                    if (tag.name === 'LIST') {
                        tag.name = readKeyName(tag.bytes);
                        tag.bytes = tag.bytes.readBytes(tag.bytes.bytesAvailable());
                        return tag;
                    }
                }
            }
            if (tag.name === 'LIST') {
                var listName = readKeyName(tag.bytes);
                if (listName === 'btdk') {
                    continue;
                }
                var nestedTag = readFirstGroupByMatchNames(tag.bytes, matchNames);
                if (!nestedTag.bytes.empty()) {
                    return nestedTag;
                }
            }
        }
        return getEmptyTag();
    }

    function readCompositionsInternal(bytes, list) {
        while (bytes.bytesAvailable() > 0) {
            var item = readFirstTagByName(bytes, 'Item');
            if (item.bytes.empty()) {
                break;
            }

            var tag = readTag(item.bytes);
            while (tag.name !== 'idta' && item.bytes.bytesAvailable() > 0) {
                tag = readTag(item.bytes);
            }
            if (tag.name !== 'idta') {
                continue;
            }

            var itemType = tag.bytes.readUint16();
            tag.bytes.skip(14);
            var itemId = tag.bytes.readInt32();

            tag = readTag(item.bytes);
            var itemName = tag.bytes.readUTF8String();

            if (itemType === 1) {
                var folder = readFirstTagByName(item.bytes, 'Sfdr');
                if (!folder.bytes.empty()) {
                    readCompositionsInternal(folder.bytes, list);
                }
            } else if (itemType === 4) {
                list.push({
                    name: itemName,
                    id: itemId,
                    bytes: item.bytes.readBytes(item.bytes.bytesAvailable()).data
                });
            }
        }
    }

    function readCompositions(bytes) {
        var list = [];
        var folder = readFirstTagByName(bytes, 'Fold');
        if (!folder.bytes.empty()) {
            readCompositionsInternal(folder.bytes, list);
        }
        return list;
    }

    function readLayers(bytes) {
        var list = [];
        while (bytes.bytesAvailable() > 0) {
            var layerTag = readFirstTagByName(bytes, 'Layr');
            if (layerTag.bytes.empty()) {
                break;
            }

            var tag = readTag(layerTag.bytes);
            var layerId = tag.bytes.readInt32();
            tag.bytes.skip(34);
            var layerFlags = tag.bytes.readUint16();
            tag.bytes.skip(88);
            var layerType = tag.bytes.readInt32();

            tag = readTag(layerTag.bytes);
            var layerName = tag.bytes.readUTF8String();

            list.push({
                id: layerId,
                flags: layerFlags,
                type: layerType,
                name: layerName,
                bytes: layerTag.bytes.readBytes(layerTag.bytes.bytesAvailable()).data
            });
        }
        return list;
    }

    function roundValue(value) {
        return bm_generalUtils.roundNumber(Number(value), 3);
    }

    function sortStops(a, b) {
        if (a.position === b.position) {
            return 0;
        }
        return a.position < b.position ? -1 : 1;
    }

    function extractFloatArraysByKey(xmlString, keyName) {
        var results = [];
        if (!xmlString) {
            return results;
        }
        var keyTag = '<key>' + keyName + '</key>';
        var searchIndex = 0;
        while (searchIndex !== -1 && searchIndex < xmlString.length) {
            var keyIndex = xmlString.indexOf(keyTag, searchIndex);
            if (keyIndex === -1) {
                break;
            }
            var pairEndIndex = xmlString.indexOf('</prop.pair>', keyIndex);
            if (pairEndIndex === -1) {
                break;
            }
            var arrayIndex = xmlString.indexOf('<array>', keyIndex);
            if (arrayIndex !== -1 && arrayIndex < pairEndIndex) {
                var arrayEndIndex = xmlString.indexOf('</array>', arrayIndex);
                if (arrayEndIndex !== -1 && arrayEndIndex < pairEndIndex) {
                    var floatValues = [];
                    var floatMatch;
                    var floatRegExp = /<float>([^<]+)<\/float>/g;
                    var floatString = xmlString.substring(arrayIndex, arrayEndIndex);
                    while ((floatMatch = floatRegExp.exec(floatString)) !== null) {
                        floatValues.push(Number(floatMatch[1]));
                    }
                    if (floatValues.length) {
                        results.push(floatValues);
                    }
                    searchIndex = arrayEndIndex + 8;
                    continue;
                }
            }
            searchIndex = pairEndIndex + 12;
        }
        return results;
    }

    function parseAlphaStops(xmlString) {
        var alphaStops = [];
        var floatArrays = extractFloatArraysByKey(xmlString, 'Stops Alpha');
        var i;
        var len = floatArrays.length;
        for (i = 0; i < len; i += 1) {
            if (floatArrays[i].length < 3) {
                return [];
            }
            alphaStops.push({
                position: roundValue(floatArrays[i][0]),
                midpoint: roundValue(floatArrays[i][1]),
                opacity: roundValue(floatArrays[i][2])
            });
        }
        alphaStops.sort(sortStops);
        return alphaStops;
    }

    function parseColorStops(xmlString) {
        var colorStops = [];
        var floatArrays = extractFloatArraysByKey(xmlString, 'Stops Color');
        var i;
        var len = floatArrays.length;
        for (i = 0; i < len; i += 1) {
            if (floatArrays[i].length < 5) {
                return [];
            }
            colorStops.push({
                position: roundValue(floatArrays[i][0]),
                midpoint: roundValue(floatArrays[i][1]),
                color: [
                    roundValue(floatArrays[i][2]),
                    roundValue(floatArrays[i][3]),
                    roundValue(floatArrays[i][4])
                ]
            });
        }
        colorStops.sort(sortStops);
        return colorStops;
    }

    function packAlphaStops(alphaStops) {
        var list = [];
        var i;
        var len = alphaStops.length;
        var currentStop;
        var nextStop;
        var midPoint;
        var midValue;
        for (i = 0; i < len; i += 1) {
            currentStop = alphaStops[i];
            list.push([
                roundValue(currentStop.position),
                roundValue(currentStop.opacity)
            ]);
            if (i < len - 1) {
                nextStop = alphaStops[i + 1];
                midPoint = currentStop.position + (nextStop.position - currentStop.position) * currentStop.midpoint;
                midValue = currentStop.opacity + (nextStop.opacity - currentStop.opacity) * 0.5;
                list.push([
                    roundValue(midPoint),
                    roundValue(midValue)
                ]);
            }
        }
        return list;
    }

    function packColorStops(colorStops) {
        var list = [];
        var i;
        var len = colorStops.length;
        var currentStop;
        var nextStop;
        var midPoint;
        var midColor;
        for (i = 0; i < len; i += 1) {
            currentStop = colorStops[i];
            list.push([
                roundValue(currentStop.position),
                roundValue(currentStop.color[0]),
                roundValue(currentStop.color[1]),
                roundValue(currentStop.color[2])
            ]);
            if (i < len - 1) {
                nextStop = colorStops[i + 1];
                midPoint = currentStop.position + (nextStop.position - currentStop.position) * currentStop.midpoint;
                midColor = [
                    currentStop.color[0] + (nextStop.color[0] - currentStop.color[0]) * 0.5,
                    currentStop.color[1] + (nextStop.color[1] - currentStop.color[1]) * 0.5,
                    currentStop.color[2] + (nextStop.color[2] - currentStop.color[2]) * 0.5
                ];
                list.push([
                    roundValue(midPoint),
                    roundValue(midColor[0]),
                    roundValue(midColor[1]),
                    roundValue(midColor[2])
                ]);
            }
        }
        return list;
    }

    function cloneStopValues(values) {
        var cloned = [];
        var i;
        var len = values.length;
        for (i = 0; i < len; i += 1) {
            cloned.push(values[i].slice(0));
        }
        return cloned;
    }

    function padStopValues(values, expectedLength) {
        var paddedValues = cloneStopValues(values);
        if (!paddedValues.length || paddedValues.length >= expectedLength) {
            return paddedValues;
        }
        var arrayLength = paddedValues.length;
        var lastValue = paddedValues[arrayLength - 1].slice(0);
        var offsetValue = lastValue[0];
        while (paddedValues.length < expectedLength) {
            offsetValue = roundValue(offsetValue - 0.001);
            var filler = lastValue.slice(0);
            filler[0] = offsetValue;
            paddedValues.splice(arrayLength - 1, 0, filler);
        }
        return paddedValues;
    }

    function buildGradientLabel(ref) {
        var label = 'compId=' + ref.compId + ', layerId=' + ref.layerId + ', matchName=' + ref.matchName + ', gradientIndex=' + ref.gradientIndex;
        if (ref.keyFrameIndex !== undefined && ref.keyFrameIndex !== null) {
            label += ', keyFrameIndex=' + ref.keyFrameIndex;
        }
        if (ref.compName) {
            label += ', comp="' + ref.compName + '"';
        }
        if (ref.layerName) {
            label += ', layer="' + ref.layerName + '"';
        }
        return label;
    }

    function failGradient(reason, ref) {
        var message = 'Bodymovin could not export gradient data (' + reason + ').';
        if (ref) {
            message += ' ' + buildGradientLabel(ref);
        }
        bm_eventDispatcher.log(message);
        bm_eventDispatcher.alert(message);
        throw new Error(message);
    }

    function isXmlProjectFile() {
        if (!fileString) {
            return false;
        }
        return /^\s*</.test(fileString);
    }

    function getParsedProjectData() {
        if (parsedProjectData) {
            return parsedProjectData;
        }
        if (!fileString) {
            getProjectData();
        }
        if (!fileString) {
            failGradient('project_not_saved');
        }

        var body = readBody(new ByteArray(fileString));
        parsedProjectData = {
            compositions: readCompositions(body)
        };

        if (!parsedProjectData.compositions.length && isXmlProjectFile()) {
            failGradient('unsupported_project_format_aepx');
        }

        return parsedProjectData;
    }

    function findCompositionById(compositions, compId) {
        var i;
        var len = compositions.length;
        for (i = 0; i < len; i += 1) {
            if (compositions[i].id === compId) {
                return compositions[i];
            }
        }
        return null;
    }

    function findLayerById(layers, layerId) {
        var i;
        var len = layers.length;
        for (i = 0; i < len; i += 1) {
            if (layers[i].id === layerId) {
                return layers[i];
            }
        }
        return null;
    }

    function buildGradientRef(gradientMeta, keyFrameIndex) {
        var ref = {
            compId: gradientMeta.compId,
            layerId: gradientMeta.layerId,
            matchName: gradientMeta.matchName,
            gradientIndex: gradientMeta.gradientIndex,
            keyFrameIndex: keyFrameIndex,
            compName: gradientMeta.compName,
            layerName: gradientMeta.layerName
        };
        return ref;
    }

    function xmlToGradientData(xmlString, ref) {
        if (!xmlString) {
            failGradient('gradient_keyframe_not_found', ref);
        }
        var gradientData = {
            alphaStops: parseAlphaStops(xmlString),
            colorStops: parseColorStops(xmlString)
        };
        if (gradientData.alphaStops.length < 2) {
            failGradient('invalid_alpha_stops', ref);
        }
        if (gradientData.colorStops.length < 2) {
            failGradient('invalid_color_stops', ref);
        }
        return gradientData;
    }

    function getGradientDataByRef(ref){
        var projectData = getParsedProjectData();
        var composition = findCompositionById(projectData.compositions, ref.compId);
        if (!composition) {
            failGradient('composition_not_found', ref);
        }

        var layers = readLayers(new ByteArray(composition.bytes));
        var layer = findLayerById(layers, ref.layerId);
        if (!layer) {
            failGradient('layer_not_found', ref);
        }

        var layerBytes = new ByteArray(layer.bytes);
        var gradientText = '';
        var i;
        for (i = 0; layerBytes.bytesAvailable() > 0 && i <= ref.gradientIndex; i += 1) {
            var groupTag = readFirstGroupByMatchName(layerBytes, ref.matchName);
            if (groupTag.bytes.empty()) {
                break;
            }
            if (i === ref.gradientIndex) {
                var tag = readFirstTagByName(groupTag.bytes, 'GCky');
                if (tag.bytes.empty()) {
                    break;
                }
                var frameIndex = 0;
                while (tag.bytes.bytesAvailable() > 0) {
                    var stringTag = readTag(tag.bytes);
                    if (stringTag.bytes.empty()) {
                        break;
                    }
                    if (frameIndex === ref.keyFrameIndex) {
                        if (stringTag.bytes.bytesAvailable() > 0 && stringTag.bytes.position() < stringTag.bytes.length()) {
                            gradientText = stringTag.bytes.readUTF8String();
                        }
                        break;
                    }
                    frameIndex += 1;
                }
                break;
            }
        }

        return xmlToGradientData(gradientText, ref);
    }

    function getGradientData(gradientMeta, numKeys){
        if (!gradientMeta) {
            failGradient('gradient_reference_missing');
        }
        numKeys = numKeys ? numKeys : 1;
        var keyframes = [];
        var maxColors = 0;
        var maxOpacities = 0;
        var i;
        for (i = 0; i < numKeys; i += 1) {
            var gradientData = getGradientDataByRef(buildGradientRef(gradientMeta, i));
            var frameData = {
                c: packColorStops(gradientData.colorStops),
                o: packAlphaStops(gradientData.alphaStops)
            };
            if (frameData.c.length < 2) {
                failGradient('invalid_packed_color_stops', buildGradientRef(gradientMeta, i));
            }
            if (frameData.o.length < 2) {
                failGradient('invalid_packed_alpha_stops', buildGradientRef(gradientMeta, i));
            }
            maxColors = Math.max(maxColors, frameData.c.length);
            maxOpacities = Math.max(maxOpacities, frameData.o.length);
            keyframes.push(frameData);
        }

        var mergedKeys = [];
        for (i = 0; i < numKeys; i += 1) {
            var mergedArr = [];
            var colors = padStopValues(keyframes[i].c, maxColors);
            var opacities = padStopValues(keyframes[i].o, maxOpacities);
            var j;
            var k;
            for (j = 0; j < maxColors; j += 1) {
                for (k = 0; k < 4; k += 1) {
                    mergedArr.push(colors[j][k]);
                }
            }
            for (j = 0; j < maxOpacities; j += 1) {
                for (k = 0; k < 2; k += 1) {
                    mergedArr.push(opacities[j][k]);
                }
            }
            if (numKeys <= 1) {
                mergedKeys = mergedArr;
            } else {
                mergedKeys.push(mergedArr);
            }
        }

        return {
            m: mergedKeys,
            p: maxColors
        };
    }

    return ob;
}())

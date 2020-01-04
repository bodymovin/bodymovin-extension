/*jslint vars: true , plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global File, Folder, $, KeyframeEase, Shape, app, MaskMode, TrackMatteType, KeyframeInterpolationType*/

$.__bodymovin.bm_lottieImporter = (function () {

	var bm_eventDispatcher = $.__bodymovin.bm_eventDispatcher;

	var ob = {};

	var mainFolder;
	var elements = {};
	var frameRate = 0;

	function getElementById(id) {
		if(elements[id]) {
			return elements[id].element;
		}
		return null;
	}

	function addElement(id, element) {
		elements[id] = {
			element: element
		}
	}

	function createFolder(name) {
		name = name || 'Imported_Lottie_Animation';
		mainFolder = app.project.items.addFolder(name);
	}

	function createComp(name, width, height, duration, id) {
		name = name || 'Lottie_Main_Comp';
		var comp = app.project.items.addComp(name, width, height, 1, duration / frameRate, frameRate);
		addElement(id, comp);
		comp.parentFolder = mainFolder;
		//'bm_charHelper', 1000, 1000, 1, 1, 1
	}

	function createNull(duration, elementId, parentCompId) {
		var comp = getElementById(parentCompId);

		var element = comp.layers.addNull(duration / frameRate);
		addElement(elementId, element);
	}

	function createSolid(color, name, width, height, duration, elementId, parentCompId) {
		var comp = getElementById(parentCompId);
		// comp.layers.addSolid(color, name, width, height, 1, duration);

		var element = comp.layers.addSolid(color, name, width, height, 1, duration / frameRate);
		addElement(elementId, element);
	}

	function createShapeLayer(elementId, parentCompId) {
		var comp = getElementById(parentCompId);

		var element = comp.layers.addShape();
		addElement(elementId, element);
	}

	function addComposition(compSourceId, parentCompId, elementId) {
		var comp = getElementById(compSourceId);
		var parentComp = getElementById(parentCompId);
		var compLayer = parentComp.layers.add(comp);
		addElement(elementId, compLayer);
	}

	function setFrameRate(value) {
		frameRate = value;
	}

	function setElementTemporalKeyAtIndex(propertyName, index, inInfluences, inSpeeds, outInfluences, outSpeeds, elementId) {
		var element = getElementById(elementId);
		var property = element.property(propertyName);
		var inEases = [];
		var outEases = [];
		for (var i = 0; i < inInfluences.length; i += 1) {
			var easeIn = new KeyframeEase(inSpeeds[i], inInfluences[i]);
			inEases.push(easeIn);
			var easeOut = new KeyframeEase(outSpeeds[i], outInfluences[i]);
			outEases.push(easeOut);
		}
		property.setTemporalEaseAtKey(index, inEases, outEases);

	}

	var keyInterpolatioTypes = {
		1: KeyframeInterpolationType.LINEAR,
		2: KeyframeInterpolationType.BEZIER,
		3: KeyframeInterpolationType.HOLD,
	}

	function getKeyInterpolationType(type) {
		return keyInterpolatioTypes[type] || keyInterpolatioTypes[1];
	}

	function setInterpolationTypeAtKey(propertyName, index, elementId, type) {
		var element = getElementById(elementId);
		var property = element.property(propertyName);
		property.setInterpolationTypeAtKey(index, getKeyInterpolationType(2), getKeyInterpolationType(type));
	}

	function separateDimensions(elementId) {
		var element = getElementById(elementId);
		var property = element.property('Position');
		property.dimensionsSeparated = true;
	}

	function setSpatialTangentsAtKey(propertyName, index, inTangents, outTangents, elementId) {
		var element = getElementById(elementId);
		var property = element.property(propertyName);
		property.setSpatialTangentsAtKey(index, inTangents, outTangents);
	}

	function formatValue(value) {
		if (typeof value === 'object' && value.i) {
			var sVerts= value.v;
			var sITans= value.i;
			var sOTans = value.o;
			var sShape = new Shape(); 
			sShape.vertices = sVerts; 
			sShape.inTangents = sITans; 
			sShape.outTangents = sOTans; 
			sShape.closed = value.c;
			return sShape;
		} else {
			return value;
		}
	}

	function setElementPropertyValue(propertyName, value, elementId) {
		var element = getElementById(elementId);
		if (propertyName === 'name') {
			element[propertyName] = value
		} else {
			element[propertyName].setValue(formatValue(value));
		}
	}

	function atob(string) {
		var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
		string = String(string).replace(/[\t\n\f\r ]+/g, "");

        // Adding the padding if missing, for semplicity
        string += "==".slice(2 - (string.length & 3));
        var bitmap, result = "", r1, r2, i = 0;
        for (; i < string.length;) {
            bitmap = b64.indexOf(string.charAt(i++)) << 18 | b64.indexOf(string.charAt(i++)) << 12
                    | (r1 = b64.indexOf(string.charAt(i++))) << 6 | (r2 = b64.indexOf(string.charAt(i++)));

            result += r1 === 64 ? String.fromCharCode(bitmap >> 16 & 255)
                    : r2 === 64 ? String.fromCharCode(bitmap >> 16 & 255, bitmap >> 8 & 255)
                    : String.fromCharCode(bitmap >> 16 & 255, bitmap >> 8 & 255, bitmap & 255);
        }
        return result;
	}

	function setElementPropertyExpression(propertyName, value, elementId) {
		var element = getElementById(elementId);
		// element[propertyName].expression = 'time';
		element[propertyName].expression = atob(value);
	}

	function setElementKey(propertyName, time, value, elementId) {
		var element = getElementById(elementId);
		element[propertyName].setValueAtTime(time / frameRate, formatValue(value));
	}


	function setLayerParent(layerId, parentLayerId) {
		var layer = getElementById(layerId);
		var parent = getElementById(parentLayerId);
		layer.setParentWithJump(parent);
	}

	function setLayerStartTime(layerId, time) {
		var layer = getElementById(layerId);
		layer.startTime = time / frameRate;
	}

	function setLayerInPoint(layerId, time) {
		var layer = getElementById(layerId);
		layer.inPoint = time / frameRate;
	}

	function setLayerOutPoint(layerId, time) {
		var layer = getElementById(layerId);
		layer.outPoint = time / frameRate;
	}

	function setLayerStretch(layerId, stretch) {
		var layer = getElementById(layerId);
		layer.stretch = stretch;
	}

	function createShapeGroup(elementId, containerId) {
		var element = getElementById(containerId);
		var property = element.property("Contents");
		var elementProperty = property.addProperty("ADBE Vector Group");
		addElement(elementId, elementProperty);
	}

	function createRectangle(elementId, containerId) {
		var element = getElementById(containerId);
		var property = element.property("Contents");
		var elementProperty = property.addProperty("ADBE Vector Shape - Rect");
		addElement(elementId, elementProperty);
	}

	function createEllipse(elementId, containerId) {
		var element = getElementById(containerId);
		var property = element.property("Contents");
		var elementProperty = property.addProperty("ADBE Vector Shape - Ellipse");
		addElement(elementId, elementProperty);
	}

	function createStar(elementId, containerId) {
		var element = getElementById(containerId);
		var property = element.property("Contents");
		var elementProperty = property.addProperty("ADBE Vector Shape - Star");
		addElement(elementId, elementProperty);
	}

	function createFill(elementId, containerId) {
		var element = getElementById(containerId);
		var property = element.property("Contents");
		var elementProperty = property.addProperty("ADBE Vector Graphic - Fill");
		addElement(elementId, elementProperty);
	}

	function createGradientFill(elementId, containerId) {
		var element = getElementById(containerId);
		var property = element.property("Contents");
		var elementProperty = property.addProperty("ADBE Vector Graphic - G-Fill");
		addElement(elementId, elementProperty);
	}

	function createGradientStroke(elementId, containerId) {
		var element = getElementById(containerId);
		var property = element.property("Contents");
		var elementProperty = property.addProperty("ADBE Vector Graphic - G-Stroke");
		addElement(elementId, elementProperty);
	}

	function createStroke(elementId, containerId) {
		var element = getElementById(containerId);
		var property = element.property("Contents");
		var elementProperty = property.addProperty("ADBE Vector Graphic - Stroke");
		addElement(elementId, elementProperty);
	}

	function createRepeater(elementId, containerId) {
		var element = getElementById(containerId);
		var property = element.property("Contents");
		var elementProperty = property.addProperty("ADBE Vector Filter - Repeater");
		addElement(elementId, elementProperty);
	}

	function createRoundedCorners(elementId, containerId) {
		var element = getElementById(containerId);
		var property = element.property("Contents");
		var elementProperty = property.addProperty("ADBE Vector Filter - RC");
		addElement(elementId, elementProperty);
	}

	function createTrimPath(elementId, containerId) {
		var element = getElementById(containerId);
		var property = element.property("Contents");
		var elementProperty = property.addProperty("ADBE Vector Filter - Trim");
		addElement(elementId, elementProperty);
	}

	function createShape(elementId, containerId) {
		var element = getElementById(containerId);
		var property = element.property("Contents");
		var elementProperty = property.addProperty("ADBE Vector Shape - Group");
		addElement(elementId, elementProperty);
	}

	var maskModes = {
		a: MaskMode.ADD,
		s: MaskMode.SUBTRACT,
		i: MaskMode.INTERSECT,
		l: MaskMode.LIGHTEN,
		d: MaskMode.DARKEN,
		f: MaskMode.DIFFERENCE,
	}

	var trackMatteModes = {
		1: TrackMatteType.ALPHA,
		2: TrackMatteType.ALPHA_INVERTED,
		3: TrackMatteType.LUMA,
		4: TrackMatteType.LUMA_INVERTED,
	}


	function getMaskMode(mode) {
		return maskModes[mode] || maskModes.a;
	}

	function getTrackMatteMode(mode) {
		return trackMatteModes[mode] || trackMatteModes[1];
	}

	function createMask(maskId, layerId, maskMode, isInverted) {
		var element = getElementById(layerId);
		var mask = element.Masks.addProperty("Mask");
		addElement(maskId, mask);
		mask.maskMode = getMaskMode(maskMode);
		mask.inverted = isInverted;
	}

	function setTrackMatte(layerId, trackMatteMode) {
		var element = getElementById(layerId);
		element.trackMatteType = getTrackMatteMode(trackMatteMode);
	}

	function assignIdToProp(propName, elementId, containerId) {
		var element = getElementById(containerId);
		var elementProperty = element.property(propName);
		addElement(elementId, elementProperty);
	}

	function reset() {
		elements = {};
		mainFolder = null;
	}

	ob.reset = reset;
	ob.createFolder = createFolder;
	ob.createComp = createComp;
	ob.createNull = createNull;
	ob.createSolid = createSolid;
	ob.createShapeLayer = createShapeLayer;
	ob.addComposition = addComposition;
	ob.setFrameRate = setFrameRate;
	ob.setElementPropertyValue = setElementPropertyValue;
	ob.setElementPropertyExpression = setElementPropertyExpression;
	ob.setElementKey = setElementKey;
	ob.setElementTemporalKeyAtIndex = setElementTemporalKeyAtIndex;
	ob.setInterpolationTypeAtKey = setInterpolationTypeAtKey;
	ob.separateDimensions = separateDimensions;
	ob.setSpatialTangentsAtKey = setSpatialTangentsAtKey;
	ob.setLayerParent = setLayerParent;
	ob.setLayerStartTime = setLayerStartTime;
	ob.setLayerStretch = setLayerStretch;
	ob.setLayerInPoint = setLayerInPoint;
	ob.setLayerOutPoint = setLayerOutPoint;
	ob.createShapeGroup = createShapeGroup;
	ob.createRectangle = createRectangle;
	ob.createEllipse = createEllipse;
	ob.createStar = createStar;
	ob.createFill = createFill;
	ob.createStroke = createStroke;
	ob.createGradientFill = createGradientFill;
	ob.createGradientStroke = createGradientStroke;
	ob.createShape = createShape;
	ob.createRepeater = createRepeater;
	ob.createRoundedCorners = createRoundedCorners;
	ob.createTrimPath = createTrimPath;
	ob.createMask = createMask;
	ob.setTrackMatte = setTrackMatte;
	ob.assignIdToProp = assignIdToProp;
    
    return ob;
}());
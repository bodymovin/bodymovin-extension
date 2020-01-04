/*jslint vars: true , plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global File, Folder, $, KeyframeEase, Shape, app*/

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

	function formatValue(value) {
		if (typeof value === 'object' && value.i) {
			var sVerts= value.v;
			var sITans= value.i;
			var sOTans = value.o;
			// var sShape = new Shape(); 
			// sShape.vertices = sVerts; 
			// sShape.inTangents = sITans; 
			// sShape.outTangents = sOTans; 
			// sShape.closed = value.c;
			// var sVerts= [[-4.66796875,-4.614013671875],[-4.66796875,-1.584716796875],[4.701171875,-1.584716796875],[8.44921875,1.823486328125],[8.44921875,3.798095703125],[4.701171875,7.206298828125],[-4.66796875,7.206298828125],[-8.44921875,3.798095703125],[-8.44921875,3.387939453125],[-5.3125,2.809814453125],[-5.3125,4.512939453125],[5.283203125,4.512939453125],[5.283203125,1.208251953125],[-4.048828125,1.208251953125],[-7.833984375,-2.199462890625],[-7.833984375,-3.797607421875],[-4.048828125,-7.206298828125],[4.498046875,-7.206298828125],[8.283203125,-4.072998046875],[8.283203125,-3.729248046875],[5.248046875,-3.082275390625],[5.248046875,-4.614013671875]];
			// var sITans= [[0,0],[0,0],[0,0],[0,-2.7265625],[0,0],[2.86328125,0],[0,0],[0,2.693359375],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,2.728515625],[0,0],[-2.83203125,0],[0,0],[0,-2.51806640625],[0,0],[0,0],[0,0]];
			// var sOTans = [[0,0],[0,0],[0,0],[0,-2.7265625],[0,0],[2.86328125,0],[0,0],[0,2.693359375],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,2.728515625],[0,0],[-2.83203125,0],[0,0],[0,-2.51806640625],[0,0],[0,0],[0,0]];
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

	function setElementPropertValue(propertyName, value, elementId) {
		var element = getElementById(elementId);
		if (propertyName === 'name') {
			element[propertyName] = value
		} else {
			element[propertyName].setValue(formatValue(value));
		}
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
	ob.setElementPropertValue = setElementPropertValue;
	ob.setElementKey = setElementKey;
	ob.setElementTemporalKeyAtIndex = setElementTemporalKeyAtIndex;
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
	ob.assignIdToProp = assignIdToProp;
    
    return ob;
}());
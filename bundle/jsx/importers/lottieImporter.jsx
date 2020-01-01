/*jslint vars: true , plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global File, Folder, $, KeyframeEase, app*/

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

	function createShape(elementId, parentCompId) {
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

	function setElementTransformValue(propertyName, value, elementId) {
		var element = getElementById(elementId);
		element.transform.property(propertyName).setValue(value);
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

	function setElementPropertValue(propertyName, value, elementId) {
		var element = getElementById(elementId);
		element[propertyName].setValue(value);
	}

	function setElementTransformKey(propertyName, time, value, elementId) {
		var element = getElementById(elementId);
		element.transform[propertyName].setValueAtTime(time / frameRate, value);
	}

	function setElementKey(propertyName, time, value, elementId) {
		var element = getElementById(elementId);
		element[propertyName].setValueAtTime(time / frameRate, value);
	}

	function setElementTransformTemporalKeyAtIndex(propertyName, index, inInfluences, inSpeeds, outInfluences, outSpeeds, elementId) {
		var element = getElementById(elementId);
		var property = element.transform.property(propertyName);
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


	function createFill(elementId, containerId) {
		var element = getElementById(containerId);
		var property = element.property("Contents");
		var elementProperty = property.addProperty("ADBE Vector Graphic - Fill");
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
	ob.createShape = createShape;
	ob.addComposition = addComposition;
	ob.setFrameRate = setFrameRate;
	ob.setElementTransformValue = setElementTransformValue;
	ob.setElementTransformKey = setElementTransformKey;
	ob.setElementTransformTemporalKeyAtIndex = setElementTransformTemporalKeyAtIndex;
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
	ob.createFill = createFill;
    
    return ob;
}());
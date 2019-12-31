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

	function createFolder(name) {
		name = name || 'Imported_Lottie_Animation';
		mainFolder = app.project.items.addFolder(name);
	}

	function createComp(name, width, height, duration, id) {
		name = name || 'Lottie_Main_Comp';
		var comp = app.project.items.addComp(name, width, height, 1, duration / frameRate, frameRate);
		elements[id] = {
			element: comp
		}
		comp.parentFolder = mainFolder;
		//'bm_charHelper', 1000, 1000, 1, 1, 1
	}

	function createSolid(color, name, width, height, duration, elementId, parentCompId) {
		var comp = getElementById(parentCompId);
		// comp.layers.addSolid(color, name, width, height, 1, duration);

		var solid = comp.layers.addSolid(color, name, width, height, 1, duration / frameRate);
		elements[elementId] = {
			element: solid
		};
	}

	function setFrameRate(value) {
		frameRate = value;
	}

	function setElementTransformValue(propertyName, value, elementId) {
		var element = getElementById(elementId);
		element.transform[propertyName].setValue(value);
	}

	function setElementTransformKey(propertyName, time, value, elementId) {
		var element = getElementById(elementId);
		element.transform[propertyName].setValueAtTime(time / frameRate, value);
	}

	function setElementTemporalKeyAtIndex(propertyName, index, inInfluences, inSpeeds, outInfluences, outSpeeds, elementId) {
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

	function reset() {
		elements = {};
		mainFolder = null;
	}

	ob.reset = reset;
	ob.createFolder = createFolder;
	ob.createComp = createComp;
	ob.createSolid = createSolid;
	ob.setFrameRate = setFrameRate;
	ob.setElementTransformValue = setElementTransformValue;
	ob.setElementTransformKey = setElementTransformKey;
	ob.setElementTemporalKeyAtIndex = setElementTemporalKeyAtIndex;
    
    return ob;
}());
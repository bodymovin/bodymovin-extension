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

	function setElementTemporalKeyAtIndex(propertyName, index, valueIn, valueOut, elementId) {
		// bm_eventDispatcher.log('PASO 1')
		// bm_eventDispatcher.log(propertyName)
		// bm_eventDispatcher.log(index)
		// bm_eventDispatcher.log(valueIn)
		// bm_eventDispatcher.log(valueOut)
		var element = getElementById(elementId);
		// bm_eventDispatcher.log('PASO 2')
		var property = element.transform.property(propertyName);
		// bm_eventDispatcher.log('PASO 3')
		var easeIn = new KeyframeEase(valueIn[0], valueIn[1]);
		// bm_eventDispatcher.log('PASO 4')
		var easeOut = new KeyframeEase(valueOut[0], valueOut[1]);
		// bm_eventDispatcher.log('PASO 5')
		property.setTemporalEaseAtKey(index, [easeIn], [easeOut]);
		// bm_eventDispatcher.log('PASO 6')

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
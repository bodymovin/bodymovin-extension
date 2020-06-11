/*jslint vars: true , plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global $*/


$.__bodymovin = $.__bodymovin || {esprima:{}}

var extensionPath = $.fileName.split('/').slice(0, -1).join('/') + '/';

//  Does not work with `new funcA.bind(thisArg, args)`
if (!Function.prototype.bm_bind) (function(){
  var slice = Array.prototype.slice;
  Function.prototype.bm_bind = function() {
    var thatFunc = this, thatArg = arguments[0];
    var args = slice.call(arguments, 1);
    if (typeof thatFunc !== 'function') {
      // closest thing possible to the ECMAScript 5
      // internal IsCallable function
      throw new TypeError('Function.prototype.bm_bind - ' +
             'what is trying to be bound is not callable');
    }
    return function(){
      var funcArgs = args.concat(slice.call(arguments))
      return thatFunc.apply(thatArg, funcArgs);
    };
  };
})();

$.evalFile(extensionPath + 'JSON.jsx');
$.evalFile(extensionPath + 'eventManager.jsx');
$.evalFile(extensionPath + 'enums/layerTypes.jsx');
$.evalFile(extensionPath + 'enums/shapeTypes.jsx');
$.evalFile(extensionPath + 'helpers/layerResolver.jsx');
$.evalFile(extensionPath + 'helpers/shapeTypeResolver.jsx');
$.evalFile(extensionPath + 'helpers/settingsHelper.jsx');
$.evalFile(extensionPath + 'helpers/versionHelper.jsx');
$.evalFile(extensionPath + 'utils/generalUtils.jsx');
$.evalFile(extensionPath + 'reports/rendererTypes.jsx');
$.evalFile(extensionPath + 'reports/builderTypes.jsx');
$.evalFile(extensionPath + 'reports/messageTypes.jsx');
$.evalFile(extensionPath + 'reports/effectsMessageTypes.jsx');
$.evalFile(extensionPath + 'reports/reportMessageFactory.jsx');
$.evalFile(extensionPath + 'reports/reportEffectMessageFactory.jsx');
$.evalFile(extensionPath + 'reports/reportAnimatorMessageFactory.jsx');
$.evalFile(extensionPath + 'reports/messageClassReport.jsx');
$.evalFile(extensionPath + 'reports/propertyReport.jsx');
$.evalFile(extensionPath + 'reports/positionReport.jsx');
$.evalFile(extensionPath + 'reports/rotationReport.jsx');
$.evalFile(extensionPath + 'reports/effectsReport.jsx');
$.evalFile(extensionPath + 'reports/transformReport.jsx');
$.evalFile(extensionPath + 'reports/layerReport.jsx');
$.evalFile(extensionPath + 'reports/layers/shapes/shapeGroupReport.jsx');
$.evalFile(extensionPath + 'reports/layers/shapes/shapeRectReport.jsx');
$.evalFile(extensionPath + 'reports/layers/shapes/shapeEllipseReport.jsx');
$.evalFile(extensionPath + 'reports/layers/shapes/shapeStarReport.jsx');
$.evalFile(extensionPath + 'reports/layers/shapes/shapeShapeReport.jsx');
$.evalFile(extensionPath + 'reports/layers/shapes/shapeFillReport.jsx');
$.evalFile(extensionPath + 'reports/layers/shapes/shapeStrokeReport.jsx');
$.evalFile(extensionPath + 'reports/layers/shapes/shapeGradientFillReport.jsx');
$.evalFile(extensionPath + 'reports/layers/shapes/shapeGradientStrokeReport.jsx');
$.evalFile(extensionPath + 'reports/layers/shapes/shapeMergePathsReport.jsx');
$.evalFile(extensionPath + 'reports/layers/shapes/shapeRoundCornersReport.jsx');
$.evalFile(extensionPath + 'reports/layers/shapes/shapeTrimPathsReport.jsx');
$.evalFile(extensionPath + 'reports/layers/shapes/shapeRepeaterReport.jsx');
$.evalFile(extensionPath + 'reports/layers/shapes/shapeUnhandledReport.jsx');
$.evalFile(extensionPath + 'reports/layers/shapes/shapeReportHelper.jsx');
$.evalFile(extensionPath + 'reports/layers/shapes/shapeCollectionReport.jsx');
$.evalFile(extensionPath + 'reports/layers/texts/textAnimatorsReport.jsx');
$.evalFile(extensionPath + 'reports/layers/solidLayerReport.jsx');
$.evalFile(extensionPath + 'reports/layers/textLayerReport.jsx');
$.evalFile(extensionPath + 'reports/layers/unhandledLayerReport.jsx');
$.evalFile(extensionPath + 'reports/layers/compositionLayerReport.jsx');
$.evalFile(extensionPath + 'reports/layers/shapeLayerReport.jsx');
$.evalFile(extensionPath + 'reports/layerReportHelper.jsx');
$.evalFile(extensionPath + 'reports/layerCollectionReport.jsx');
$.evalFile(extensionPath + 'reports/animationReport.jsx');
$.evalFile(extensionPath + 'reports/reportsManager.jsx');
$.evalFile(extensionPath + 'downloadManager.jsx');
$.evalFile(extensionPath + 'utils/expressions/reservedPropertiesHelper.jsx');
$.evalFile(extensionPath + 'utils/expressions/valueAssignmentHelper.jsx');
$.evalFile(extensionPath + 'utils/expressions/variableDeclarationHelper.jsx');
$.evalFile(extensionPath + 'utils/expressionHelper.jsx');
$.evalFile(extensionPath + 'helpers/fileManager.jsx');
$.evalFile(extensionPath + 'helpers/presetHelper.jsx');
$.evalFile(extensionPath + 'exporters/exporterHelpers.jsx');
$.evalFile(extensionPath + 'exporters/bannerExporter.jsx');
$.evalFile(extensionPath + 'exporters/standardExporter.jsx');
$.evalFile(extensionPath + 'exporters/standaloneExporter.jsx');
$.evalFile(extensionPath + 'exporters/demoExporter.jsx');
$.evalFile(extensionPath + 'exporters/avdExporter.jsx');
$.evalFile(extensionPath + 'exporters/riveExporter.jsx');
$.evalFile(extensionPath + 'importers/lottieImporter.jsx');
$.evalFile(extensionPath + 'esprima.jsx');
$.evalFile(extensionPath + 'annotationsManager.jsx');
$.evalFile(extensionPath + 'escodegen.jsx');
$.evalFile(extensionPath + 'utils/bez.jsx');
$.evalFile(extensionPath + 'utils/keyframeHelper.jsx');
$.evalFile(extensionPath + 'utils/transformHelper.jsx');
$.evalFile(extensionPath + 'utils/maskHelper.jsx');
$.evalFile(extensionPath + 'utils/timeremapHelper.jsx');
$.evalFile(extensionPath + 'utils/effectsHelper.jsx');
$.evalFile(extensionPath + 'utils/layerStylesHelper.jsx')
$.evalFile(extensionPath + 'utils/cameraHelper.jsx');
$.evalFile(extensionPath + 'utils/XMPParser.jsx');
$.evalFile(extensionPath + 'utils/ProjectParser.jsx');
$.evalFile(extensionPath + 'utils/markerHelper.jsx');
$.evalFile(extensionPath + 'utils/textAnimatorHelper.jsx');
$.evalFile(extensionPath + 'utils/textHelper.jsx');
$.evalFile(extensionPath + 'utils/imageSeqHelper.jsx');
$.evalFile(extensionPath + 'helpers/boundingBox.jsx');
$.evalFile(extensionPath + 'helpers/blendModes.jsx');
$.evalFile(extensionPath + 'elements/layerElement.jsx');
$.evalFile(extensionPath + 'projectManager.jsx');
$.evalFile(extensionPath + 'compsManager.jsx');
$.evalFile(extensionPath + 'dataManager.jsx');
$.evalFile(extensionPath + 'renderManager.jsx');
$.evalFile(extensionPath + 'utils/sourceHelper.jsx');
$.evalFile(extensionPath + 'utils/shapeHelper.jsx');
$.evalFile(extensionPath + 'utils/textShapeHelper.jsx');
$.evalFile(extensionPath + 'utils/transformation-matrix.jsx');

var globalVariables = ['bm_eventDispatcher','bm_generalUtils','bm_expressionHelper','esprima', 'escodegen'
, 'bez', 'PropertyFactory', 'bm_keyframeHelper', 'bm_transformHelper', 'bm_maskHelper', 'bm_timeremapHelper'
, 'bm_effectsHelper', 'bm_layerStylesHelper', 'bm_cameraHelper', 'bm_XMPHelper', 'bm_ProjectHelper', 'bm_markerHelper'
, 'bm_textHelper', 'bm_boundingBox', 'bm_layerElement', 'bm_projectManager', 'bm_compsManager', 'bm_dataManager'
, 'bm_renderManager', 'bm_downloadManager', 'bm_sourceHelper', 'bm_shapeHelper', 'bm_textAnimatorHelper'
, 'bm_textShapeHelper']
var i, len = globalVariables.length;
for(i = 0; i < len; i += 1) {
	if(this[globalVariables[i]]) {
		this[globalVariables[i]] = null;
		delete this[globalVariables[i]];
		//$.__bodymovin.bm_eventDispatcher.log(globalVariables[i] + ' exists');
	} else {
		//$.__bodymovin.bm_eventDispatcher.log(globalVariables[i] + ' not exists');
	}
}
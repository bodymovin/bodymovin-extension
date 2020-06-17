/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global $, Folder, File, app */

$.__bodymovin.bm_layerStylesReportFactory = (function () {
    
    var MessageClass = $.__bodymovin.bm_messageClassReport;
    var bm_eventDispatcher = $.__bodymovin.bm_eventDispatcher;
    var generalUtils = $.__bodymovin.bm_generalUtils;
    var layerStyleTypes = $.__bodymovin.layerStyleTypes;
    var getStyleType = $.__bodymovin.getLayerStyleType;
    var dropShadowFactory = $.__bodymovin.bm_layerStylesDropShadowFactory;

    function LayerStyles(styles) {
        this.stylesProperty = styles;
        this.styles = [];
        this.messages = [];
        this.process();
    }

    generalUtils.extendPrototype(LayerStyles, MessageClass);

    var styleTypesFactories = {}
    styleTypesFactories[layerStyleTypes.dropShadow] = dropShadowFactory;

    function buildStyleReport(type, style) {
        return styleTypesFactories[type](style);
    }

    LayerStyles.prototype.process = function() {
        var styleElement, styleType
        for (var i = 0; i < this.stylesProperty.numProperties; i += 1) {
            styleElement = this.stylesProperty(i + 1);
            styleType = getStyleType(styleElement.matchName);
            if (styleElement.enabled && styleType) {
                this.styles.push(buildStyleReport(styleType, styleElement));
            }
        }
    }

    LayerStyles.prototype.serialize = function() {
        var styles = [];
        for (var i = 0; i < this.styles.length; i += 1) {
            styles.push(this.styles[i].serialize());
        }
        return {
            messages: this.serializeMessages(),
            styles: styles,
        }
    }

    return function(styles) {
        return new LayerStyles(styles);
    }
    
}());
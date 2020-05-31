/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global $, Folder, File, app */

$.__bodymovin.bm_propertyReport = (function () {
    
    var rendererTypes = $.__bodymovin.bm_reportRendererTypes;
    var builderTypes = $.__bodymovin.bm_reportBuilderTypes;
    var messageTypes = $.__bodymovin.bm_reportMessageTypes;
    var MessageClass = $.__bodymovin.bm_messageClassReport;
    var generalUtils = $.__bodymovin.bm_generalUtils;

    function Property(property) {
        this.property = property;
        this.process();
    }

    generalUtils.extendPrototype(Property, MessageClass);

    Property.prototype.processExpressions = function() {
        var property = this.property;
        if (property.expressionEnabled && !property.expressionError) {
            this.addMessage(messageTypes.ERROR,
            [
                rendererTypes.SKOTTIE,
                rendererTypes.IOS,
                rendererTypes.ANDROID,
            ],
            builderTypes.EXPRESSIONS);
            if (property.expression.indexOf('wiggle(') !== -1) {
                this.addMessage(messageTypes.ERROR,
                [
                    rendererTypes.WEB,
                    rendererTypes.SKOTTIE,
                    rendererTypes.IOS,
                    rendererTypes.ANDROID,
                ],
                builderTypes.WIGGLE);
            }
        }
    }

    Property.prototype.process = function() {
        this.processExpressions();
    }

    Property.prototype.serialize = function() {
    	return this.serializeMessages();
    }


    return function(property) {
    	return new Property(property);
    }
    
}());
/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global $, Folder, File, app */

$.__bodymovin.bm_messageClassReport = (function () {
    
    var reportMessageFactory = $.__bodymovin.bm_reportMessageFactory;

    function MessageClass() {
    }
    
    MessageClass.prototype.initializeMessages = function() {
        this.messages = [];
    }

    MessageClass.prototype.addMessage = function(type, renderers, builder) {
        var reportMessage = reportMessageFactory(type, renderers, builder);
        this.messages.push(reportMessage);
    }

    MessageClass.prototype.serializeMessages = function() {
        var messages = [];
        for(var i = 0; i < this.messages.length; i += 1) {
            messages.push(this.messages[i].serialize());
        }
        return messages;
    }
    
    return MessageClass;
}());
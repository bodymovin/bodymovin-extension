/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global $, Folder, File, app */

$.__bodymovin.bm_animationReport = (function () {
    
    var bm_eventDispatcher = $.__bodymovin.bm_eventDispatcher;
    var layerCollectionFactory = $.__bodymovin.bm_layerCollectionReport;
    var versionHelper = $.__bodymovin.bm_versionHelper;

    function Animation(animation, onComplete, onFail) {
        this.animation = animation;
        this.messages = [];
        this._onComplete = onComplete;
        this._onFail = onFail;
        bm_eventDispatcher.log('ANIMATION 1')
        this.onLayersComplete = this.onLayersComplete.bm_bind(this);
        try {
            this.layerCollection = layerCollectionFactory(animation.layers, this.onLayersComplete, this._onFail);
        } catch(error) {
            this._onFail(error);
        }
        this.process();
    }

    Animation.prototype.process = function() {
        this.layerCollection.process();
    }

    Animation.prototype.onLayersComplete = function() {
        bm_eventDispatcher.log('onLayersComplete')
        this._onComplete(this);
    }

    Animation.prototype.serialize = function() {
        try {
            bm_eventDispatcher.log('ANIMATION SERIALIZE');
            var layerCollection = this.layerCollection.serialize();
            var serializedData = {
                layers: layerCollection.layers,
            };

            var messages = [];
            for (var i = 0; i < this.messages.length; i += 1) {
                messages.push(this.messages[i].serialize());
            }
            serializedData.messages = messages;
            serializedData.id = this.animation.id;
            serializedData.version = versionHelper.get();
            return serializedData;
        } catch(error) {
            bm_eventDispatcher.log('ERROR SERIALIZE');
            bm_eventDispatcher.log(error.message);
            bm_eventDispatcher.log(error.line);
            bm_eventDispatcher.log(error.fileName);
            bm_eventDispatcher.log($.stack);
            return null;
        }
    }



    return function(animation, onComplete, onFail) {
        return new Animation(animation, onComplete, onFail);      
    }
    
}());
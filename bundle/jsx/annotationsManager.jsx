/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global $, Folder, File, app */

$.__bodymovin.bm_annotationsManager = (function () {
    'use strict';
    
    var ob;
    var bm_eventDispatcher = $.__bodymovin.bm_eventDispatcher;
    var bm_generalUtils = $.__bodymovin.bm_generalUtils;
    var presetHelper = $.__bodymovin.presetHelper;
    var layers = []

    var pseudoEffects = [
        {
            path: '/assets/annotations/bodymovin_text_props.ffx',
            matchName: 'Pseudo/Bodymovin Text Props',
            name: 'Text Properties',
            id: 'ann/1',
        },
        {
            path: '/assets/annotations/bodymovin_secondary_color.ffx',
            matchName: 'Pseudo/Bodymovin Sec Color',
            name: 'Secondary Color',
            id: 'ann/2',
        }
    ]

    function createLayerReference(layer) {
        return {
            layer: layer,
            id: bm_generalUtils.random(10),
        }
    }

    function findLayerId(layer) {
        var i = 0, len = layers.length;
        for (i = 0; i < len; i += 1) {
            if (layers[i].layer === layer) {
                return layers[i].id;
            }
        }
        var newLayer = createLayerReference(layer);
        layers.push(newLayer);
        return newLayer.id;
    }

    function findLayerById(id) {
        var i = 0, len = layers.length;
        for (i = 0; i < len; i += 1) {
            if (layers[i].id === id) {
                return layers[i].layer;
            }
        }
    }

    function searchPseudoEffectByMatchName(matchName) {
        var i = 0, len = pseudoEffects.length;
        while (i < len) {
            if (pseudoEffects[i].matchName === matchName) {
                return true;
            }
            i += 1;
        }
        return false;
    }

    function buildAnnotations(layer) {
        var effects = layer.effect;
        var i, effect;
        var annotations = []
        for (i = 0; i < effects.numProperties; i += 1) {
            effect = effects(i + 1);
            if (searchPseudoEffectByMatchName(effect.matchName)) {
                annotations.push({
                    matchName: effect.matchName
                })
            }
        }
        return annotations;
    }

    function buildLayerInfo(layer) {
        var layerId = findLayerId(layer);
        return {
            id: layerId,
            name: layer.name,
            annotations: buildAnnotations(layer),
        }
    }
    
    function getLayers() {
        if (app.project && app.project.activeItem && app.project.activeItem.selectedLayers) {
            var selectedLayers = app.project.activeItem.selectedLayers
            var i = 0;
            var layersInfo = []
            for (i = 0; i < selectedLayers.length; i += 1) {
                var layerInfo = buildLayerInfo(selectedLayers[i]);
                layersInfo.push(layerInfo);
            }
            bm_eventDispatcher.sendEvent('bm:annotations:list', layersInfo);
        }
    }

    function findPseudoEffectByMatchName(matchName) {
        for (var i = 0; i < pseudoEffects.length; i += 1) {
            if (pseudoEffects[i].matchName === matchName) {
                return pseudoEffects[i]
            }
        }
        return null;
    }

    function activateAnnotations(layerId, annotationId) {

        var layer = findLayerById(layerId);
        var pseudoEffect = findPseudoEffectByMatchName(annotationId) || pseudoEffects[0];
        if (layer) {
            presetHelper.applyPreset(layer, annotationId, pseudoEffect)
        }

        // DO NOT DELETE. USE WHEN ADDING NEW PSEUDO EFFECT TO SAVE AS FFX
        // layer.property("Effects").addProperty('Pseudo/Bodymovin Sec Color');
    }

    function getAvailableAnnotation() {
        bm_eventDispatcher.sendEvent('bm:annotations:annotationsList', pseudoEffects)
    }

    ob = {
        getLayers: getLayers,
        activateAnnotations: activateAnnotations,
        getAvailableAnnotation: getAvailableAnnotation,
        findAnnotationEffectByMatchName: findPseudoEffectByMatchName,
    };
    
    return ob;
}());
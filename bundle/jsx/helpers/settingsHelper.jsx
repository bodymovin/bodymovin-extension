/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global Folder, File, $ */
$.__bodymovin.bm_settingsHelper = (function () {
    var ob = {};
    var _settings

    function setData(data) {
        _settings = data
    }

    function getData() {
        return _settings
    }

    function shouldCompressImages() {
        return _settings.should_compress && !_settings.original_assets;
    }

    function getCompressionQuality() {
        return _settings.compression_rate;
    }

    function shouldEncodeImages() {
        return _settings.should_encode_images;
    }

    function shouldSkipImages() {
        return _settings.should_skip_images && !_settings.should_encode_images;
    }

    function shouldIgnoreExpressionProperties() {
        return _settings.ignore_expression_properties;
    }

    function shouldExportOldFormat() {
        return _settings.export_old_format;
    }

    function shouldSkipDefaultProperties() {
        return _settings.skip_default_properties;
    }

    function shouldIncludeNotSupportedProperties() {
        return _settings.not_supported_properties;
    }

    ob.set = setData
    ob.get = getData
    ob.shouldCompressImages = shouldCompressImages;
    ob.getCompressionQuality = getCompressionQuality;
    ob.shouldEncodeImages = shouldEncodeImages;
    ob.shouldSkipImages = shouldSkipImages;
    ob.shouldIgnoreExpressionProperties = shouldIgnoreExpressionProperties;
    ob.shouldExportOldFormat = shouldExportOldFormat;
    ob.shouldSkipDefaultProperties = shouldSkipDefaultProperties;
    ob.shouldIncludeNotSupportedProperties = shouldIncludeNotSupportedProperties;

    return ob;
}());
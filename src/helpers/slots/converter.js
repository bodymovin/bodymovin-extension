import convertShape from "./shape";
import convertTransform from "./transform";

const layerTypes = {
	COMP: 0,
	SHAPE: 4,
}


const convertLayer = (layer, props, properties) => {
	if (layer.ks) {
		convertTransform(layer.ks, props, properties);
	}
	if (layer.ty === layerTypes.SHAPE) {
		convertShape(layer, props, properties);
	}
}

const convertLayers = (layers, props, properties) => {
	layers.forEach(layer => convertLayer(layer, props, properties))
}

const convertAnimation = (animationData) => {
	if (!animationData.props) {
		animationData.props = {};
	}
	const props = animationData.props;
	const properties = [];

	if (animationData.layers) {
		convertLayers(animationData.layers, props, properties);
	}
	if (animationData.assets) {
		animationData.assets.forEach(asset => {
			if (asset.layers) {
				convertLayers(asset.layers, props, properties)
			}
		})
	}
}

export default convertAnimation;
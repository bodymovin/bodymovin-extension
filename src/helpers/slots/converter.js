import convertShape from "./shape";
import convertTransform from "./transform";

const layerTypes = {
	COMP: 0,
	SHAPE: 4,
}


const convertLayer = (layer, slots, properties) => {
	if (layer.ks) {
		convertTransform(layer.ks, slots, properties);
	}
	if (layer.ty === layerTypes.SHAPE) {
		convertShape(layer, slots, properties);
	}
}

const convertLayers = (layers, slots, properties) => {
	layers.forEach(layer => convertLayer(layer, slots, properties))
}

const convertAnimation = (animationData) => {
	if (!animationData.slots) {
		animationData.slots = {};
	}
	const slots = animationData.slots;
	const properties = [];

	if (animationData.layers) {
		convertLayers(animationData.layers, slots, properties);
	}
	console.log('PASO 1');
	if (animationData.assets) {
		animationData.assets.forEach(asset => {
			console.log(asset)
			if (asset.layers) {
				convertLayers(asset.layers, slots, properties)
			}
		})
	}
}

export default convertAnimation;
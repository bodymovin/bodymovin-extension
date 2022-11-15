let properties = [];
let props;

const layerTypes = {
	COMP: 0,
	SHAPE: 4,
}

const convertProperty = (property) => {
	if (property && 'k' in property) {
		const stringifiedValue = JSON.stringify(property.k)
		let slot = properties.find((_slot) => {
			return _slot.stringified === stringifiedValue;
		})
		if (!slot) {
			slot = {
				stringified: stringifiedValue,
				id: `slot_${properties.length}`
			}
			properties.push(slot);
			props[slot.id] = {
				k: property.k,
				a: property.a,
			}
		}
		delete property.k;
		delete property.a;
		property.pid = slot.id;
	}
}

const convertShape = (shape) => {
	console.log(shape);
}

const convertTransform = (transform) => {
	convertProperty(transform.o);
	convertProperty(transform.r);
	convertProperty(transform.p);
	convertProperty(transform.s);
	convertProperty(transform.a);
}

const convertLayer = (layer) => {
	if (layer.ks) {
		convertTransform(layer.ks);
	}
	if (layer.ty === layerTypes.SHAPE) {
		convertShape(layer);
	}
}

const convertLayers = (layers) => {
	layers.forEach(convertLayer)
}

const convertAnimation = (animationData) => {
	if (!animationData.props) {
		animationData.props = {};
	}
	props = animationData.props;
	properties.length = 0;

	if (animationData.layers) {
		convertLayers(animationData.layers);
	}
	if (animationData.assets) {
		animationData.assets.forEach(asset => {
			console.log(asset)
			if (asset.layers) {
				convertLayers(asset.layers)
			}
		})
	}
}

export default convertAnimation;
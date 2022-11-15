const convertProperty = (property, props, properties) => {
	if (property && 'k' in property) {
		const stringifiedValue = JSON.stringify(property.k)
		let prop = properties.find((_slot) => {
			return _slot.stringified === stringifiedValue;
		})
		if (!prop) {
			prop = {
				stringified: stringifiedValue,
				id: `p_${properties.length}`
			}
			properties.push(prop);
			props[prop.id] = {
				k: property.k,
				a: property.a,
			}
		}
		delete property.k;
		delete property.a;
		property.pid = prop.id;
	}
}

export default convertProperty;
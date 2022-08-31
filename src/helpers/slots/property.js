const convertProperty = (property, slots, properties) => {
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
			slots[slot.id] = {
				k: property.k,
				a: property.a,
			}
		}
		delete property.k;
		delete property.a;
		property.pid = slot.id;
	}
}

export default convertProperty;
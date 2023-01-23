const addPropToSlot = (slotId, propertyType, slots) => {
  if (!slots[slotId]) {
    slots[slotId] = [];
  }
  if (slots[slotId].indexOf(propertyType) === -1) {
    slots[slotId].push(propertyType);
  }
}

const searchSlotInProps = (data, props, slots) => {
  props = props || [];
  props.forEach(propData => {
    if (data[propData.attr] && data[propData.attr].sid) {
      addPropToSlot(data[propData.attr].sid, propData.name, slots);
    }
  })
}

export {
  addPropToSlot,
  searchSlotInProps,
}
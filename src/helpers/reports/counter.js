const memoizeHelper = function(_fnct) {
  const dictionary = []
  return function(key, renderers, messageTypes, builders) {
    let keyData = dictionary.find(data => data.key === key)
    if (!keyData) {
      keyData = {
        key: key,
        value: _fnct(key, renderers, messageTypes, builders),
        renderers,
        messageTypes,
        builders,

      }
      dictionary.push(keyData)
    } else if (keyData.renderers !== renderers || keyData.messageTypes !== messageTypes || keyData.builders !== builders) {
      keyData.value = _fnct(key, renderers, messageTypes, builders)
      keyData.renderers = renderers
      keyData.messageTypes = messageTypes
      keyData.builders = builders
    }
    return keyData.value
  }
}


const buildMessageCounterObject = (error = 0, warning = 0) => ({
  error,
  warning,
})

const addMessageCount = (destination, origin) => {
  const message = buildMessageCounterObject(destination.error, destination.warning);
  Object.keys(origin).map(key => message[key] += origin[key]);
  return message;
}

const addMessagesCount = (...messageCounters) => {
  return messageCounters.reduce(addMessageCount, buildMessageCounterObject())
}

const countMessageByTypeAndRenderer = memoizeHelper((message, renderers, messageTypes, builders) => {
  let matchesRenderers = false
  let matchesType = false
  let matchesBuilders = false
  if (!message.renderers || message.renderers.length === 0) {
    matchesRenderers = true
  } else if (renderers.find(availableRendererId => availableRendererId === 'all')) {
      matchesRenderers = true
  } else {
    matchesRenderers = message.renderers.find(rendererId => {
      return renderers.find(availableRendererId => availableRendererId === rendererId)
    })
    ? true
    : false
  }
  if (messageTypes.find(availableRendererId => availableRendererId === 'all')) {
      matchesType = true
  } else {
    matchesType = messageTypes.includes(message.type)
  }
  if (builders.find(availableBuilderId => availableBuilderId === 'all')) {
      matchesBuilders = true
  } else {
    matchesBuilders = builders.includes(message.builder)
  }
  return (matchesRenderers && matchesType && matchesBuilders) ? 1 : 0
})

const countMessages = memoizeHelper((messages = [], renderers, messageTypes, builders) => {
  return messages.reduce((accumulator, message) => {
    accumulator[message.type] += countMessageByTypeAndRenderer(message, renderers, messageTypes, builders)
    return accumulator
  }, buildMessageCounterObject())
})

const getPropertyMessageCount = memoizeHelper((messages, renderers, messageTypes, builders) => {
  if (messages) {
    return countMessages(messages, renderers, messageTypes, builders)
  } else {
    return buildMessageCounterObject()
  }
})

const getPositionMessageCount = memoizeHelper((positionData, renderers, messageTypes, builders) => {
  if (positionData) {
    if (!positionData.dimensionsSeparated) {
      return countMessages(positionData.position, renderers, messageTypes, builders)
    } else {
      return addMessagesCount(
        getPropertyMessageCount(positionData.positionX, renderers, messageTypes, builders),
        getPropertyMessageCount(positionData.positionY, renderers, messageTypes, builders),
        getPropertyMessageCount(positionData.positionZ, renderers, messageTypes, builders),
      )
    } 
  } else {
    return buildMessageCounterObject()
  }
})

const getRotationMessageCount = memoizeHelper((rotationData, renderers, messageTypes, builders) => {
  if (rotationData) {
    if (!rotationData.isThreeD) {
      return countMessages(rotationData.rotation, renderers, messageTypes, builders)
    } else {
      return addMessagesCount(
        getPropertyMessageCount(rotationData.rotationX, renderers, messageTypes, builders),
        getPropertyMessageCount(rotationData.rotationY, renderers, messageTypes, builders),
        getPropertyMessageCount(rotationData.rotationZ, renderers, messageTypes, builders),
        getPropertyMessageCount(rotationData.orientation, renderers, messageTypes, builders),
      )
    } 
  } else {
    return buildMessageCounterObject()
  }
})

const getTransformMessageCount = memoizeHelper((transform, renderers, messageTypes, builders) => {
  if (!transform) {
    return buildMessageCounterObject();
  }
  return addMessagesCount(
    getPropertyMessageCount(transform.anchorPoint, renderers, messageTypes, builders),
    getPositionMessageCount(transform.position, renderers, messageTypes, builders),
    getRotationMessageCount(transform.rotation, renderers, messageTypes, builders),
    getPropertyMessageCount(transform.scale, renderers, messageTypes, builders),
    getPropertyMessageCount(transform.opacity, renderers, messageTypes, builders),
    getPropertyMessageCount(transform.skew, renderers, messageTypes, builders),
    getPropertyMessageCount(transform.skewAxis, renderers, messageTypes, builders),
    getPropertyMessageCount(transform.startOpacity, renderers, messageTypes, builders),
    getPropertyMessageCount(transform.endOpacity, renderers, messageTypes, builders),
  )
})

const getMaskMessageCount = memoizeHelper((mask, renderers, messageTypes, builders) => {
  return addMessagesCount(
    getPropertyMessageCount(mask.expansion, renderers, messageTypes, builders),
    getPropertyMessageCount(mask.feather, renderers, messageTypes, builders),
    getPropertyMessageCount(mask.opacity, renderers, messageTypes, builders),
    getPropertyMessageCount(mask.path, renderers, messageTypes, builders),
    getPropertyMessageCount(mask.messages, renderers, messageTypes, builders),
  )
})

const getMasksMessageCount = memoizeHelper((masks, renderers, messageTypes, builders) => {
  if (!masks) {
    return buildMessageCounterObject();
  }

  const masksMessages = masks.masks
  .map(mask => getMaskMessageCount(mask, renderers, messageTypes, builders))
  .reduce((acc, count) => addMessageCount(acc, count), buildMessageCounterObject())
  return addMessagesCount(
    masksMessages,
    getPropertyMessageCount(masks.messages, renderers, messageTypes, builders),
  )
}) 

const getGenericStyleMessagCount = (style, renderers, messageTypes, builders, properties) => {
  const propertyMessages = properties.reduce((accumulator, propertyName) => (
      addMessageCount(getPropertyMessageCount(style[propertyName], renderers, messageTypes, builders), accumulator)
    ), buildMessageCounterObject)
  return addMessageCount(
    getPropertyMessageCount(style.messages, renderers, messageTypes, builders),
    propertyMessages
  )
}

const getDropShadowStyleMessageCount = memoizeHelper((style, renderers, messageTypes, builders) => {
  const properties = [
    'color', 'opacity', 'angle', 'size', 'distance',
    'spread', 'blendMode', 'noise', 'knocksOut'
  ]
  return getGenericStyleMessagCount(style, renderers, messageTypes, builders, properties)
})

const getStrokeStyleMessageCount = memoizeHelper((style, renderers, messageTypes, builders) => {
  const properties = [
    'color','size','blendMode','opacity','position'
  ]
  return getGenericStyleMessagCount(style, renderers, messageTypes, builders, properties)
})

const getInnerShadowStyleMessageCount = memoizeHelper((style, renderers, messageTypes, builders) => {
  const properties = [
    'blendMode','color','opacity','globalLight','angle'
    ,'distance','choke','size','noise'
  ]
  return getGenericStyleMessagCount(style, renderers, messageTypes, builders, properties)
})

const getOuterGlowStyleMessageCount = memoizeHelper((style, renderers, messageTypes, builders) => {
  const properties = [
    'blendMode','opacity','noise','colorChoice',
    'color','gradient','gradientSmoothness','glowTechnique',
    'chokeMatte','blur','inputRange','shadingNoise'
  ]
  return getGenericStyleMessagCount(style, renderers, messageTypes, builders, properties)
})

const getInnerGlowStyleMessageCount = memoizeHelper((style, renderers, messageTypes, builders) => {
  const properties = [
    'blendMode','opacity','noise','colorChoice',
    'color','gradient','gradientSmoothness','glowTechnique','source',
    'chokeMatte','blur','inputRange','shadingNoise'
  ]
  return getGenericStyleMessagCount(style, renderers, messageTypes, builders, properties)
})

const getBevelEmbossStyleMessageCount = memoizeHelper((style, renderers, messageTypes, builders) => {
  const properties = []
  return getGenericStyleMessagCount(style, renderers, messageTypes, builders, properties)
})

const getSatinStyleMessageCount = memoizeHelper((style, renderers, messageTypes, builders) => {
  const properties = []
  return getGenericStyleMessagCount(style, renderers, messageTypes, builders, properties)
})

const getColorOverlayStyleMessageCount = memoizeHelper((style, renderers, messageTypes, builders) => {
  const properties = []
  return getGenericStyleMessagCount(style, renderers, messageTypes, builders, properties)
})

const getGradientOverlayStyleMessageCount = memoizeHelper((style, renderers, messageTypes, builders) => {
  const properties = []
  return getGenericStyleMessagCount(style, renderers, messageTypes, builders, properties)
})

const getStyleMessageCount = memoizeHelper((style, renderers, messageTypes, builders) => {
  const counterStyles = {
    0: getStrokeStyleMessageCount,
    1: getDropShadowStyleMessageCount,
    2: getInnerShadowStyleMessageCount,
    3: getOuterGlowStyleMessageCount,
    4: getInnerGlowStyleMessageCount,
    5: getBevelEmbossStyleMessageCount,
    6: getSatinStyleMessageCount,
    7: getColorOverlayStyleMessageCount,
    8: getGradientOverlayStyleMessageCount,
  }

  if (counterStyles[style.type]) {
    return counterStyles[style.type](style, renderers, messageTypes, builders)
  } else {
    return getPropertyMessageCount(style.messages, renderers, messageTypes, builders)
  }
})

const getStylesCollectionMessageCount = memoizeHelper((stylesCollection, renderers, messageTypes, builders) => {
  let messageCount = buildMessageCounterObject();
  for (var i = 0; i < stylesCollection.length; i += 1) {
    messageCount = addMessageCount(
      messageCount,
      getStyleMessageCount(stylesCollection[i], renderers, messageTypes, builders)
    )
  }
  return messageCount;
})

const getStylesMessageCount = memoizeHelper((styles, renderers, messageTypes, builders) => {
  if (!styles) {
    return buildMessageCounterObject();
  }
  return addMessagesCount(
    countMessages(styles.messages, renderers, messageTypes, builders),
    getStylesCollectionMessageCount(styles.styles, renderers, messageTypes, builders),
  )
})

const getEffectsMessageCount = memoizeHelper((effects, renderers, messageTypes, builders) =>
  countMessages(effects, renderers, messageTypes, builders)
)

const getLayerMessageCount = memoizeHelper((layer, renderers, messageTypes, builders) => {
  return addMessagesCount(
    getTransformMessageCount(layer.transform, renderers, messageTypes, builders),
    getMasksMessageCount(layer.masks, renderers, messageTypes, builders),
    getStylesMessageCount(layer.styles, renderers, messageTypes, builders),
    countMessages(layer.messages, renderers, messageTypes, builders),
    getEffectsMessageCount(layer.effects, renderers, messageTypes, builders),
    countLayerMessagesByType(layer, renderers, messageTypes, builders),
  )
})

const getLayerCollectionMessagesCount = memoizeHelper((layers, renderers, messageTypes, builders) => {
  return layers
  .map(layer => getLayerMessageCount(layer, renderers, messageTypes, builders))
  .reduce(addMessageCount, buildMessageCounterObject())
})

const getDictionaryMessageCount = memoizeHelper((dictionary, renderers, messageTypes, builders) => {
  return Object.keys(dictionary)
  .map(key => countMessages(dictionary[key], renderers, messageTypes, builders))
  .reduce(addMessageCount, buildMessageCounterObject())
})

const getShapeGroupMessagesCount = memoizeHelper((group, renderers, messageTypes, builders) => {
  return addMessagesCount(
    getTransformMessageCount(group.transform, renderers, messageTypes, builders),
    getShapeCollectionMessagesCount(group.shapes, renderers, messageTypes, builders),
  )
})

const getShapeRepeaterMessagesCount = memoizeHelper((repeater, renderers, messageTypes, builders) => {
  return addMessagesCount(
    getTransformMessageCount(repeater.transform, renderers, messageTypes, builders),
    getPropertyMessageCount(repeater.copies, renderers, messageTypes, builders),
    getPropertyMessageCount(repeater.offset, renderers, messageTypes, builders),
  )
})

const getGenericShapeMessagesCount = memoizeHelper((shape, renderers, messageTypes, builders) => {
  return addMessagesCount(
    getDictionaryMessageCount(shape.properties, renderers, messageTypes, builders),
    countMessages(shape.messages, renderers, messageTypes, builders),
  )
})

const getShapeMessageCount = memoizeHelper((shape, renderers, messageTypes, builders) => {
  if(shape.type === 'gr') {
    return getShapeGroupMessagesCount(shape, renderers, messageTypes, builders)
  } else if (['rc', 'el', 'st', 'sh', 'fl', 'sr', 'gf', 'gs', 'rd', 'tm', 'rd', 'mm'].includes(shape.type)) {
    return getGenericShapeMessagesCount(shape, renderers, messageTypes, builders)
  } else if(shape.type === 'un') {
    return countMessages(shape.messages, renderers, messageTypes, builders)
  }  else if(shape.type === 'rp') {
    return getShapeRepeaterMessagesCount(shape, renderers, messageTypes, builders)
  } else {
    return buildMessageCounterObject()
  }
})

const getShapeCollectionMessagesCount = memoizeHelper((shapes, renderers, messageTypes, builders) => {
  return shapes
  .map(shape => getShapeMessageCount(shape, renderers, messageTypes, builders))
  .reduce(addMessageCount, buildMessageCounterObject())
})

const getAnimatorMessageCount = memoizeHelper((animator, renderers, messageTypes, builders) => {
  if (animator.messages) {
    return countMessages(animator.messages, renderers, messageTypes, builders)
  } else {
    return buildMessageCounterObject()
  }
})

const getAnimatorsMessageCount = memoizeHelper((animators, renderers, messageTypes, builders) => {
  return animators
  .map(animator => getAnimatorMessageCount(animator, renderers, messageTypes, builders))
  .reduce(addMessageCount, buildMessageCounterObject())
})

const getTextMessagesCount = memoizeHelper((text, renderers, messageTypes, builders) => {
  return addMessagesCount(
    getAnimatorsMessageCount(text.animators, renderers, messageTypes, builders),
  )
})

const countLayerMessagesByType = memoizeHelper((layer, renderers, messageTypes, builders) => {
  if (layer.type === 0) {
    return getLayerCollectionMessagesCount(layer.layers, renderers, messageTypes, builders)
  } else if (layer.type === 4) {
    return getShapeCollectionMessagesCount(layer.shapes, renderers, messageTypes, builders)
  } else if (layer.type === 5) {
    return getTextMessagesCount(layer.text, renderers, messageTypes, builders)
  } else {
    return buildMessageCounterObject()
  }
})

const getAnimationMessageCount = memoizeHelper((report, renderers, messageTypes, builders) => {
  const messages = report.layers.reduce((accumulator, layer) => {
    return addMessagesCount(accumulator, getLayerMessageCount(layer, renderers, messageTypes, builders))
  }, buildMessageCounterObject())
  return messages
})

const getTotalMessagesCount = messages => messages.error + messages.warning

export {
  getAnimationMessageCount,
  getLayerMessageCount,
  getTransformMessageCount,
  getPropertyMessageCount,
  getPositionMessageCount,
  getTotalMessagesCount,
  getLayerCollectionMessagesCount,
  getEffectsMessageCount,
  getShapeCollectionMessagesCount,
  getShapeGroupMessagesCount,
  getShapeRepeaterMessagesCount,
  getGenericShapeMessagesCount,
  getTextMessagesCount,
  getAnimatorMessageCount,
  countMessageByTypeAndRenderer,
  getStylesMessageCount,
  getDropShadowStyleMessageCount,
  getMasksMessageCount,
  getMaskMessageCount,
}
const memoizeHelper = function(_fnct) {
  const dictionary = []
  return function(key, renderers, messageTypes) {
    let keyData = dictionary.find(data => data.key === key)
    if (!keyData) {
      keyData = {
        key: key,
        value: _fnct(key, renderers, messageTypes),
        renderers,
        messageTypes,
      }
      dictionary.push(keyData)
    } else if (keyData.renderers !== renderers || keyData.messageTypes !== messageTypes) {
      keyData.value = _fnct(key, renderers, messageTypes)
      keyData.renderers = renderers
      keyData.messageTypes = messageTypes
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

const countMessageByTypeAndRenderer = memoizeHelper((message, renderers, messageTypes) => {
  let matchesRenderers = false
  let matchesType = false
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
  return (matchesRenderers && matchesType) ? 1 : 0
})

const countMessages = memoizeHelper((messages = [], renderers, messageTypes) => {
  return messages.reduce((accumulator, message) => {
    accumulator[message.type] += countMessageByTypeAndRenderer(message, renderers, messageTypes)
    return accumulator
  }, buildMessageCounterObject())
})

const getPropertyMessageCount = memoizeHelper((messages, renderers, messageTypes) => {
  if (messages) {
    return countMessages(messages, renderers, messageTypes)
  } else {
    return buildMessageCounterObject()
  }
})

const getPositionMessageCount = memoizeHelper((positionData, renderers, messageTypes) => {
  if (positionData) {
    if (!positionData.dimensionsSeparated) {
      return countMessages(positionData.position, renderers, messageTypes)
    } else {
      return addMessagesCount(
        getPropertyMessageCount(positionData.positionX, renderers, messageTypes),
        getPropertyMessageCount(positionData.positionY, renderers, messageTypes),
        getPropertyMessageCount(positionData.positionZ, renderers, messageTypes),
      )
    } 
  } else {
    return buildMessageCounterObject()
  }
})

const getRotationMessageCount = memoizeHelper((rotationData, renderers, messageTypes) => {
  if (rotationData) {
    if (!rotationData.isThreeD) {
      return countMessages(rotationData.rotation, renderers, messageTypes)
    } else {
      return addMessagesCount(
        getPropertyMessageCount(rotationData.rotationX, renderers, messageTypes),
        getPropertyMessageCount(rotationData.rotationY, renderers, messageTypes),
        getPropertyMessageCount(rotationData.rotationZ, renderers, messageTypes),
        getPropertyMessageCount(rotationData.orientation, renderers, messageTypes),
      )
    } 
  } else {
    return buildMessageCounterObject()
  }
})

const getTransformMessageCount = memoizeHelper((transform, renderers, messageTypes) => {
  if (!transform) {
    return buildMessageCounterObject();
  }
  return addMessagesCount(
    getPropertyMessageCount(transform.anchorPoint, renderers, messageTypes),
    getPositionMessageCount(transform.position, renderers, messageTypes),
    getRotationMessageCount(transform.rotation, renderers, messageTypes),
    getPropertyMessageCount(transform.scale, renderers, messageTypes),
    getPropertyMessageCount(transform.opacity, renderers, messageTypes),
    getPropertyMessageCount(transform.skew, renderers, messageTypes),
    getPropertyMessageCount(transform.skewAxis, renderers, messageTypes),
    getPropertyMessageCount(transform.startOpacity, renderers, messageTypes),
    getPropertyMessageCount(transform.endOpacity, renderers, messageTypes),
  )
})

const getDropShadowStyleMessageCount = memoizeHelper((style, renderers, messageTypes) => {
  const properties = [
    'color', 'opacity', 'angle', 'size', 'distance',
    'spread', 'blendMode', 'noise', 'knocksOut'
  ]
  const propertyMessages = properties.reduce((accumulator, propertyName) => (
      addMessageCount(getPropertyMessageCount(style[propertyName], renderers, messageTypes), accumulator)
    ), buildMessageCounterObject)
  return addMessageCount(
    getPropertyMessageCount(style.messages, renderers, messageTypes),
    propertyMessages
  )
})

const getStrokeStyleMessageCount = memoizeHelper((style, renderers, messageTypes) => {
  const properties = [
    'color',
    'size',
    'blendMode',
    'opacity',
    'position',
  ]
  const propertyMessages = properties.reduce((accumulator, propertyName) => (
      addMessageCount(getPropertyMessageCount(style[propertyName], renderers, messageTypes), accumulator)
    ), buildMessageCounterObject)
  return addMessageCount(
    getPropertyMessageCount(style.messages, renderers, messageTypes),
    propertyMessages
  )
})

const getStyleMessageCount = memoizeHelper((style, renderers, messageTypes) => {
  const counterStyles = {
    0: getStrokeStyleMessageCount,
    1: getDropShadowStyleMessageCount,
  }

  if (counterStyles[style.type]) {
    return counterStyles[style.type](style, renderers, messageTypes)
  } else {
    return getPropertyMessageCount(style.messages, renderers, messageTypes)
  }
})

const getStylesCollectionMessageCount = memoizeHelper((stylesCollection, renderers, messageTypes) => {
  let messageCount = buildMessageCounterObject();
  for (var i = 0; i < stylesCollection.length; i += 1) {
    messageCount = addMessageCount(
      messageCount,
      getStyleMessageCount(stylesCollection[i], renderers, messageTypes)
    )
  }
  return messageCount;
})

const getStylesMessageCount = memoizeHelper((styles, renderers, messageTypes) => {
  if (!styles) {
    return buildMessageCounterObject();
  }
  return addMessagesCount(
    countMessages(styles.messages, renderers, messageTypes),
    getStylesCollectionMessageCount(styles.styles, renderers, messageTypes),
  )
})

const getEffectsMessageCount = memoizeHelper((effects, renderers, messageTypes) =>
  countMessages(effects, renderers, messageTypes)
)

const getLayerMessageCount = memoizeHelper((layer, renderers, messageTypes) => {
  return addMessagesCount(
    getTransformMessageCount(layer.transform, renderers, messageTypes),
    getStylesMessageCount(layer.styles, renderers, messageTypes),
    countMessages(layer.messages, renderers, messageTypes),
    getEffectsMessageCount(layer.effects, renderers, messageTypes),
    countLayerMessagesByType(layer, renderers, messageTypes),
  )
})

const getLayerCollectionMessagesCount = memoizeHelper((layers, renderers, messageTypes) => {
  return layers
  .map(layer => getLayerMessageCount(layer, renderers, messageTypes))
  .reduce(addMessageCount, buildMessageCounterObject())
})

const getDictionaryMessageCount = memoizeHelper((dictionary, renderers, messageTypes) => {
  return Object.keys(dictionary)
  .map(key => countMessages(dictionary[key], renderers, messageTypes))
  .reduce(addMessageCount, buildMessageCounterObject())
})

const getShapeGroupMessagesCount = memoizeHelper((group, renderers, messageTypes) => {
  return addMessagesCount(
    getTransformMessageCount(group.transform, renderers, messageTypes),
    getShapeCollectionMessagesCount(group.shapes, renderers, messageTypes),
  )
})

const getShapeRepeaterMessagesCount = memoizeHelper((repeater, renderers, messageTypes) => {
  return addMessagesCount(
    getTransformMessageCount(repeater.transform, renderers, messageTypes),
    getPropertyMessageCount(repeater.copies, renderers, messageTypes),
    getPropertyMessageCount(repeater.offset, renderers, messageTypes),
  )
})

const getGenericShapeMessagesCount = memoizeHelper((shape, renderers, messageTypes) => {
  return addMessagesCount(
    getDictionaryMessageCount(shape.properties, renderers, messageTypes),
    countMessages(shape.messages, renderers, messageTypes),
  )
})

const getShapeMessageCount = memoizeHelper((shape, renderers, messageTypes) => {
  if(shape.type === 'gr') {
    return getShapeGroupMessagesCount(shape, renderers, messageTypes)
  } else if (['rc', 'el', 'st', 'sh', 'fl', 'sr', 'gf', 'gs', 'rd', 'tm', 'rd', 'mm'].includes(shape.type)) {
    return getGenericShapeMessagesCount(shape, renderers, messageTypes)
  } else if(shape.type === 'un') {
    return countMessages(shape.messages, renderers, messageTypes)
  }  else if(shape.type === 'rp') {
    return getShapeRepeaterMessagesCount(shape, renderers, messageTypes)
  } else {
    return buildMessageCounterObject()
  }
})

const getShapeCollectionMessagesCount = memoizeHelper((shapes, renderers, messageTypes) => {
  return shapes
  .map(shape => getShapeMessageCount(shape, renderers, messageTypes))
  .reduce(addMessageCount, buildMessageCounterObject())
})

const getAnimatorMessageCount = memoizeHelper((animator, renderers, messageTypes) => {
  if (animator.messages) {
    return countMessages(animator.messages, renderers, messageTypes)
  } else {
    return buildMessageCounterObject()
  }
})

const getAnimatorsMessageCount = memoizeHelper((animators, renderers, messageTypes) => {
  return animators
  .map(animator => getAnimatorMessageCount(animator, renderers, messageTypes))
  .reduce(addMessageCount, buildMessageCounterObject())
})

const getTextMessagesCount = memoizeHelper((text, renderers, messageTypes) => {
  return addMessagesCount(
    getAnimatorsMessageCount(text.animators, renderers, messageTypes),
  )
})

const countLayerMessagesByType = memoizeHelper((layer, renderers, messageTypes) => {
  if (layer.type === 0) {
    return getLayerCollectionMessagesCount(layer.layers, renderers, messageTypes)
  } else if (layer.type === 4) {
    return getShapeCollectionMessagesCount(layer.shapes, renderers, messageTypes)
  } else if (layer.type === 5) {
    return getTextMessagesCount(layer.text, renderers, messageTypes)
  } else {
    return buildMessageCounterObject()
  }
})

const getAnimationMessageCount = memoizeHelper((report, renderers, messageTypes) => {
  const messages = report.layers.reduce((accumulator, layer) => {
    return addMessagesCount(accumulator, getLayerMessageCount(layer, renderers, messageTypes))
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
}
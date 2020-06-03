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

const countMessageByTypeAndRenderer = (message, renderers, messageTypes) => {
  if (!message.renderers || message.renderers.length === 0) {
    return 1
  } else if (renderers.find(availableRendererId => availableRendererId === 'all')) {
      return 1
  } else {
    return message.renderers.find(rendererId => {
      return renderers.find(availableRendererId => availableRendererId === rendererId)
    })
    ? 1
    : 0
  }
}

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
  return addMessagesCount(
    getPropertyMessageCount(transform.anchorPoint, renderers, messageTypes),
    getPositionMessageCount(transform.position, renderers, messageTypes),
    getRotationMessageCount(transform.rotation, renderers, messageTypes),
    getPropertyMessageCount(transform.scale, renderers, messageTypes),
    getPropertyMessageCount(transform.opacity, renderers, messageTypes),
  )
})

const getEffectsMessageCount = memoizeHelper((effects, renderers, messageTypes) =>
  countMessages(effects, renderers, messageTypes)
)

const getLayerMessageCount = memoizeHelper((layer, renderers, messageTypes) => {
  return addMessagesCount(
    getTransformMessageCount(layer.transform, renderers, messageTypes),
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

const getShapeMessageCount = memoizeHelper((shape, renderers, messageTypes) => {
  if (['rc', 'sh'].includes(shape.type)) {
    return getDictionaryMessageCount(shape.properties, renderers, messageTypes)
  } else {
    return buildMessageCounterObject()
  }
})

const getShapeCollectionMessagesCount = memoizeHelper((shapes, renderers, messageTypes) => {
  return shapes
  .map(shape => getShapeMessageCount(shape, renderers, messageTypes))
  .reduce(addMessageCount, buildMessageCounterObject())
})

const countLayerMessagesByType = memoizeHelper((layer, renderers, messageTypes) => {
  if (layer.type === 0) {
    return getLayerCollectionMessagesCount(layer.layers, renderers, messageTypes)
  } else if (layer.type === 4) {
    return getShapeCollectionMessagesCount(layer.shapes, renderers, messageTypes)
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
  getDictionaryMessageCount,
}
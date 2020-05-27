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


const buildMessageCounterObject = () => ({
  error: 0,
  warning: 0,
})

const addMessagesCount = (...messageCounters) => {
  const counter = buildMessageCounterObject()
  return messageCounters.reduce((accumulator, messageCounter) => {
    Object.keys(messageCounter).map(key => accumulator[key] += messageCounter[key])
    return accumulator
  }, counter)
}

const countMessageByTypeAndRenderer = (message, renderers, messageTypes) => {
  if (!message.renderers || message.renderers.length === 0) {
    return 1
  } else if(renderers.find(availableRendererId => availableRendererId === 'all')) {
      return 1
  } else {
    return message.renderers.find(rendererId => {
      return renderers.find(availableRendererId => availableRendererId === rendererId)
    })
    ? 1
    : 0
  }
}

const countMessages = memoizeHelper((messages, renderers, messageTypes) => {
  return messages.reduce((accumulator, message) => {
    accumulator[message.type] += countMessageByTypeAndRenderer(message, renderers, messageTypes)
    return accumulator
  }, buildMessageCounterObject())
})

const getPropertyMessageCount = memoizeHelper((property, renderers, messageTypes) => {
  if (property && property.__report) {
    return countMessages(property.__report.messages, renderers, messageTypes)
  } else {
    return buildMessageCounterObject()
  }
})

const getTransformMessageCount = memoizeHelper((transform, renderers, messageTypes) => {
  return addMessagesCount(
    getPropertyMessageCount(transform.a, renderers, messageTypes),
    getPropertyMessageCount(transform.p, renderers, messageTypes),
    getPropertyMessageCount(transform.r, renderers, messageTypes),
    getPropertyMessageCount(transform.s, renderers, messageTypes),
    getPropertyMessageCount(transform.o, renderers, messageTypes),
  )
})

const getLayerMessageCount = memoizeHelper((layer, renderers, messageTypes) => {
  const transformMessages = getTransformMessageCount(layer.ks, renderers, messageTypes)
  return transformMessages
})

const getAnimationMessageCount = memoizeHelper((report, renderers, messageTypes) => {
  const messages = report.layers.reduce((accumulator, layer) => {
    return addMessagesCount(accumulator, getLayerMessageCount(layer, renderers, messageTypes))
  }, buildMessageCounterObject())
  return messages
})

export {
  getAnimationMessageCount,
  getLayerMessageCount,
  getTransformMessageCount,
  getPropertyMessageCount,
}
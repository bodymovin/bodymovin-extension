import { createSelector } from 'reselect'

const getRenderers = (state) => state.reports.settings.renderers
const getMessageTypes = (state) => state.reports.settings.messageTypes
const getBuilders = (state) => state.reports.settings.builders

const reportsOptionsSelector = createSelector(
  [ getRenderers, getMessageTypes, getBuilders ],
  (renderers, messageTypes, builders) => {
  	const availableRenderers = renderers
    .filter(renderer => renderer.isSelected)
    .map(renderer => renderer.id)
    const availableMessageTypes = messageTypes
    .filter(messageType => messageType.isSelected)
    .map(messageType => messageType.id)
  	const availableBuilders = builders
    .filter(builder => builder.isSelected)
    .map(builder => builder.id)
  	return {
  		renderers: availableRenderers,
      messageTypes: availableMessageTypes,
  		builders: availableBuilders,
  	}
  }
)

export default reportsOptionsSelector
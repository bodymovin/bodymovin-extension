import { createSelector } from 'reselect'

const getRenderers = (state) => state.reports.settings.renderers
const getMessageTypes = (state) => state.reports.settings.messageTypes

const reportsOptionsSelector = createSelector(
  [ getRenderers, getMessageTypes ],
  (renderers, messageTypes) => {
  	const availableRenderers = renderers
    .filter(renderer => renderer.isSelected)
    .map(renderer => renderer.id)
  	const availableMessageTypes = messageTypes
    .filter(messageType => messageType.isSelected)
    .map(messageType => messageType.id)
  	return {
  		renderers: availableRenderers,
  		messageTypes: availableMessageTypes,
  	}
  }
)

export default reportsOptionsSelector
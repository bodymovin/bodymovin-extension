import { createSelector } from 'reselect'

const getImportData = (state) => state.importer

const getFontsViewData = createSelector(
  [ getImportData ],
  (importData) => {
  	return {
  		pendingCommands: importData.pendingCommands,
  		messages: importData.messages,
  		state: importData.state,
  		image: importData.image,
  		fact: importData.fact,
  	}
  }
)

export default getFontsViewData
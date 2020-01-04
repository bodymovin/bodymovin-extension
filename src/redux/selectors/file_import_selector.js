import { createSelector } from 'reselect'

const getImportData = (state) => state.importer

const getFontsViewData = createSelector(
  [ getImportData ],
  (importData) => {
  	return {
  		pendingCommands: importData.pendingCommands,
  		state: importData.state,
  	}
  }
)

export default getFontsViewData
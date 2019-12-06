import { createSelector } from 'reselect'

const getItems = (state) => {
	return state.compositions.items
}

const getCurrentComp = (state) => {
	return state.compositions.current
}

const settingsExportModeSelector = createSelector(
  [getItems, getCurrentComp ],
  (items, current) => {

  	console.log('items[current]', items[current])

  	return {
  		export_mode: items[current] ? items[current].settings.export_mode : null,
  	}
  }
)

export default settingsExportModeSelector
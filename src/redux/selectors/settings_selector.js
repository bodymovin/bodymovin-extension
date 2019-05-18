import { createSelector } from 'reselect'

const getCompositions = (state) => state.compositions

const settingsSelector = createSelector(
  [ getCompositions ],
  (compositions) => {
  	const items = compositions.items
  	const current = compositions.current
  	const currentComp = items[current] || {}

  	return currentComp.settings
  }
)

export default settingsSelector
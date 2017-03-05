import { createSelector } from 'reselect'

const getItem = (state, id) => state.compositions.items[id]

const getCompositionsList = createSelector(
  [ getItem ],
  (item) => {
  	return item
  }
)

export default getCompositionsList
import { createSelector } from 'reselect'

const getItemId = (state) => {
	return state.compositions.current
}

const getRenderComposition = createSelector(
  [ getItemId ],
  (itemId) => {
  	return itemId
  }
)

export default getRenderComposition
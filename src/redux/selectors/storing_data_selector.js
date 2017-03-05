import { createSelector } from 'reselect'

const getCompositions = (state) => state.compositions.items
const getID = (state) => state.project.id

const storingDataSelector = createSelector(
  [ getCompositions, getID ],
  (compositions, id) => {
  	return {
  		data: {
  			compositions: compositions
  		},
  		id: id
  	}
  }
)

export default storingDataSelector
import { createSelector } from 'reselect'

const getPaths = (state) => state.paths

const storingPathsSelector = createSelector(
  [ getPaths ],
  (paths) => {
  	return paths
  }
)

export default storingPathsSelector
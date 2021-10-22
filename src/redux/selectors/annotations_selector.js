import { createSelector } from 'reselect'

const getAnnotations = (state) => state.annotations

const annotationsSelector = createSelector(
  [ getAnnotations ],
  (annotations) => {
  	return {
  		layers: annotations.layers,
  		annotations: annotations.annotations,
  	}
  }
)

export default annotationsSelector
import { createSelector } from 'reselect'

const getItem = (state) => {
	if(state.render.cancelled){
		return null
	}
	let i = 0, len = state.compositions.list.length
	while(i < len) {
		if(state.compositions.items[state.compositions.list[i]].selected && state.compositions.items[state.compositions.list[i]].destination && state.compositions.items[state.compositions.list[i]].renderStatus === 0){
			return state.compositions.items[state.compositions.list[i]]
		}
		i += 1
	}
	return null
}

const getRenderComposition = createSelector(
  [ getItem ],
  (item) => {
  	return item
  }
)

export default getRenderComposition
import { createSelector } from 'reselect'

const getItems = (state) => state.compositions.items
const getList = (state) => state.compositions.list
const getRender = (state) => state.render

const renderSelector = createSelector(
  [ getItems, getList, getRender ],
  (items, list, render) => {
    let renderingItems = list.reduce(function(a, id) {
      let item = items[id]
      if(item.selected && item.destination) {
        a.push(item)
      }
      return a
    }, [])
  	return {
		  renderingItems: renderingItems,
      render: render
  	}
  }
)

export default renderSelector
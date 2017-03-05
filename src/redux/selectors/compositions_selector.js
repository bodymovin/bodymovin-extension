import { createSelector } from 'reselect'

const getFilter = (state) => state.compositions.filter
const getItems = (state) => state.compositions.items
const getList = (state) => state.compositions.list

function getVisibleItems(items, list, filter) {
	let renderItemIds = list.filter((id, val) => {
      let item = items[id]
      //return true
  		return item.name.indexOf(filter) !== -1 || filter === ''
  	})
  	let renderItems = renderItemIds.map((id) => {
      let item = items[id]
      /*let copyItem = {
        id: item.id,
        name: item.name,
        hidden: !(item.name.indexOf(filter) !== -1 || filter === '')
      }*/
      return item
    })
    return renderItems
}

function checkRenderable(items, list) {
	let canRender = list.some((id, val) => {
      return items[id].selected && items[id].destination
  	})
  	return canRender

}

const getCompositionsList = createSelector(
  [ getFilter, getItems, getList ],
  (filter, items, list) => {
  	return {
		canRender: checkRenderable(items, list),
		filter: filter,
		visibleItems: getVisibleItems(items, list, filter) 
  	}
  }
)

export default getCompositionsList
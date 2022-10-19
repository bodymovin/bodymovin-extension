import { createSelector } from 'reselect'

const getFilter = (state) => state.compositions.filter
const getSelected = (state) => state.compositions.show_only_selected
const getItems = (state) => state.compositions.items
const getList = (state) => state.compositions.list

function getVisibleItems(items, list, filter, showOnlySelected) {
  filter = filter.toLowerCase();
	let renderItemIds = list.filter((id, val) => {
      let item = items[id]
      //return true
  		return item.name.toLowerCase().indexOf(filter) !== -1 || filter === ''
  	})
  	let renderItems = renderItemIds.map((id) => {
      let item = items[id]
      /*let copyItem = {
        id: item.id,
        name: item.name,
        hidden: !(item.name.indexOf(filter) !== -1 || filter === '')
      }*/
      return item
    }).filter((item) => (!showOnlySelected || (showOnlySelected && item.selected)))
    return renderItems
}

function checkRenderable(items, list) {
	let canRender = list.some((id, val) => {
      return items[id].selected && items[id].destination
  	})
  	return canRender

}

const getCompositionsList = createSelector(
  [ getFilter, getItems, getList, getSelected ],
  (filter, items, list, showOnlySelected) => {
  	return {
		canRender: checkRenderable(items, list),
		filter: filter,
    showOnlySelected: showOnlySelected,
		visibleItems: getVisibleItems(items, list, filter, showOnlySelected) 
  	}
  }
)

export default getCompositionsList
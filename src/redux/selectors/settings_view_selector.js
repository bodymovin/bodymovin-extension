import { createSelector } from 'reselect'
import validateVersion from '../../helpers/versionValidator'

const getItems = (state) => {
	return state.compositions.items
}
const getList = (state) => {
	return state.compositions.list
}
const getCurrentComp = (state) => {
	return state.compositions.current
}
const getProjectVersion = (state) => {
	return state.project.app_version
}

function getExtraCompsList(extra, list, items) {
	let extraComps = list.map(function(id, index){
		let comp = items[id]
		let extraCompData = {
			id: id,
			name: comp.name,
			selected: extra.list.indexOf(id) !== -1
		}
		return extraCompData
	})
	return extraComps
}

const getRenderComposition = createSelector(
  [getList, getItems, getCurrentComp, getProjectVersion ],
  (list, items, current, projectVersion) => {
  	let canCompressAssets = validateVersion([10,0,0], projectVersion);
  	return {
  		settings: items[current] ? items[current].settings : null,
  		extraCompsList: items[current] ? getExtraCompsList(items[current].settings.extraComps, list, items) : [],
  		canCompressAssets:  canCompressAssets
  	}
  }
)

export default getRenderComposition
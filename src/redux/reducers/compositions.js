import actionTypes from '../actions/actionTypes'

let initialState = {
	list: [],
  filter: '',
  items:{},
  current: 0,
  show_only_selected: false
}
let extensionReplacer = /\.\w*$/g

let defaultComposition = {
    id: 0,
    name: '',
    destination: '',
    absoluteURI: '',
    selected: false,
    renderStatus: 0,
    settings: {
        segmented: false,
        segmentedTime: 10,
        standalone: false,
        demo: false,
        avd: false,
        glyphs: false,
        hiddens: false,
        original_names: false,
        should_encode_images: false,
        should_compress: false,
        should_skip_images: false,
        compression_rate: 80,
        extraComps: {
            active: false,
            list:[]
        },
        guideds: false,
        ignore_expression_properties: false,
        export_old_format: false,
        skip_default_properties: false,
        not_supported_properties: false,
    }
  }

function updateFilter(state, action) {
	let newState = {...state}
	newState.filter = action.value
	return newState
}

function toggleComposition(state, action) {
  let newState = {...state}
  let newItems = {...state.items}
  let newItem = {...state.items[action.id]}
  newItem.selected = !newItem.selected
  newItems[action.id] = newItem
  newState.items = newItems
  return newState
}

function createComp(comp) {
  return {...defaultComposition, id:comp.id, name: comp.name, settings: {...defaultComposition.settings}}
}

function setStoredData(state, action) {
  let compositions = action.projectData.compositions
  var item
  for(var comp in compositions) {
    if(compositions.hasOwnProperty(comp)){
      item = compositions[comp]
      compositions[comp] = {...item, settings:{...defaultComposition.settings, ...item.settings}}
    }
  }
  let newState = {...state}
  newState.items = compositions
  return newState
}

/*function addCompositions(state, action) {
  let newItems = {...state.items}
  let listChanged: false
  let itemsChanged = false
  let newList = []
  action.compositions.forEach(function(item, index){
    if(!newItems[item.id]) {
      newItems[item.id] = createComp(item)
      itemsChanged = true
    } else if(newItems[item.id].name !== item.name) {
      newItems[item.id] = {...state.items[item.id], ...{name: item.name}}
      //newItems[item.id].name = item.name
      itemsChanged = true
    }
    newList.push(item.id)
    if(state.list[index] !== item.id) {
      listChanged = true
    }
  })
  if(!listChanged && state.list.length !== newList.length) {
    listChanged = true
  }
  if(!itemsChanged && !listChanged) {
    return state
  }
  let newState = {...state}
  if(listChanged) {
    newState.list = newList
  }
  if(itemsChanged) {
    newState.items = newItems
  }
  return newState
}*/

function searchRemovedExtraComps(settings, compositions) {
  let extraCompsList = settings.extraComps.list
  let newExtraCompsList = []
  let i, len = extraCompsList.length, item
  let j, jLen = compositions.length
  for(i=0;i<len;i++) {
    item = extraCompsList[i]
    j = 0
    while(j < jLen) {
      if(compositions[j].id === item) {
        newExtraCompsList.push(item)
        break
      }
      j += 1
    }
  }
  if(newExtraCompsList.length === extraCompsList.length){
    return settings
  }
  let newSettings = {...settings}
  newSettings.extraComps = {...settings.extraComps, ...{list:newExtraCompsList}}
  return newSettings
}

function addCompositions(state, action) {
  let newItems = {...state.items}
  let listChanged: false
  let itemsChanged = false
  let newList = []
  let i, len = action.compositions.length
  let item, index
  for(i = 0; i < len; i += 1) {
    item = action.compositions[i]
    index = i
    if(!newItems[item.id]) {
      newItems[item.id] = createComp(item)
      itemsChanged = true
    } else{
      let itemData = newItems[item.id]
      if(newItems[item.id].name !== item.name) {
        itemData = {...state.items[item.id], ...{name: item.name}}
        newItems[item.id] = itemData
        //newItems[item.id].name = item.name
        itemsChanged = true
      }
      let settings = searchRemovedExtraComps(itemData.settings, action.compositions)
      if(settings !== itemData.settings){
        itemData = {...state.items[item.id], ...{settings: settings}}
        newItems[item.id] = itemData
        itemsChanged = true
      }
    } 
    newList.push(item.id)
    if(state.list[index] !== item.id) {
      listChanged = true
    }
  }
  if(!listChanged && state.list.length !== newList.length) {
    listChanged = true
  }
  if(!itemsChanged && !listChanged) {
    return state
  }

  let newState = {...state}
  if(listChanged) {
    newState.list = newList
  }
  if(itemsChanged) {
    newState.items = newItems
  }
  return newState
}


function setCompositionDestination(state, action) {
  let newItems = {...state.items}
  let newItem = {...state.items[action.compositionData.id]}
  newItem.absoluteURI = action.compositionData.absoluteURI
  newItem.destination = action.compositionData.destination
  newItems[action.compositionData.id] = newItem
  let newState = {...state}
  newState.items = newItems
  return newState
}

function startRender(state, action) {
  let newState = {...state}
  let newItems = {...state.items}
  let itemsChanged = false
  state.list.forEach(function(id, index){
    let item = state.items[id]
    if (item.renderStatus !== 0) {
      let newItem = {...item, ...{renderStatus: 0}}
      newItems[id] = newItem
      itemsChanged = true
    }
  })
  if(itemsChanged) {
    newState.items = newItems
    return newState
  }
  return state
}


/*function startRender(state, action) {
  let newState = {...state}
  let newItems = {...state.items}
  let itemsChanged = false
  let i, len = state.list.length
  let id
  for(i = 0; i < len; i += 1) {
    id = state.list[i]
    let item = state.items[id]
    if (item.renderStatus !== 0) {
      let newItem = {...item, ...{renderStatus: 0}}
      newItems[id] = newItem
      itemsChanged = true
    }
  }
  if(itemsChanged) {
    newState.items = newItems
    return newState
  }
  return state
}*/

function completeRender(state, action) {
  let newState = {...state}
  let newItems = {...state.items}
  let item = state.items[action.id]
  let newItem = {...item, ...{renderStatus: 1}}
  newItems[action.id] = newItem
  newState.items = newItems
  return newState
}

function setCurrentComp(state, action) {
  if(state.current === action.id) {
    return state
  }
  let newState = {...state}
  newState.current = action.id
  return newState
}

function cancelSettings(state, action) {
  if (state.items[state.current].settings === action.storedSettings) {
    return state
  }
  let newState = {...state}
  let newItems = {...state.items}
  let newItem = {...state.items[state.current]}
  newItem.settings = action.storedSettings
  if(newItem.settings.standalone){
    newItem.destination = newItem.destination.replace(extensionReplacer,'.js')
    newItem.absoluteURI = newItem.absoluteURI.replace(extensionReplacer,'.js')
  } else {
    newItem.destination = newItem.destination.replace(extensionReplacer,'.tgs')
    newItem.absoluteURI = newItem.absoluteURI.replace(extensionReplacer,'.tgs')
  }
  newItems[state.current] = newItem
  newState.items = newItems
  return newState
}

function toggleSettingsValue(state, action) {
  let newItem = {...state.items[state.current]}
  let newSettings = {...newItem.settings}
  if(action.name === 'extraComps') {
    let newExtraComps = {...newSettings.extraComps}
    newExtraComps.active = !newExtraComps.active
    newSettings.extraComps = newExtraComps
  } else {
    newSettings[action.name] = !newSettings[action.name]
    if(action.name === 'standalone') {
      if(newItem.destination) {
        if(newSettings.standalone){
          newItem.destination = newItem.destination.replace(extensionReplacer,'.js')
          newItem.absoluteURI = newItem.absoluteURI.replace(extensionReplacer,'.js')
        } else {
          newItem.destination = newItem.destination.replace(extensionReplacer,'.tgs')
          newItem.absoluteURI = newItem.absoluteURI.replace(extensionReplacer,'.tgs')
        }
      }
    }
  }
  newItem.settings = newSettings
  let newItems = {...state.items}
  newItems[state.current] = newItem
  let newState = {...state}
  newState.items = newItems
  return newState

}

function toggleExtraComp(state, action) {
  let newItem = {...state.items[state.current]}
  let newSettings = {...newItem.settings}
  let newExtraComps = {...newSettings.extraComps}
  let list = newExtraComps.list
  let newList
  if (list.indexOf(action.id) === -1) {
    newList = [...list,action.id]
  } else {
    let index = list.indexOf(action.id)
    newList =  [ ...list.slice(0, index), ...list.slice(index + 1) ]
  }
  newExtraComps.list = newList
  newSettings.extraComps = newExtraComps
  newItem.settings = newSettings
  let newItems = {...state.items}
  newItems[state.current] = newItem
  let newState = {...state}
  newState.items = newItems
  return newState

}

function updateSettingsValue(state, action) {
  let newItem = {...state.items[state.current]}
  let newSettings = {...newItem.settings}
  newSettings[action.name] = action.value
  newItem.settings = newSettings
  let newItems = {...state.items}
  newItems[state.current] = newItem
  let newState = {...state}
  newState.items = newItems
  return newState

}

function toggleSelected(state, action) {
  let newState = {...state}
  newState.show_only_selected = !newState.show_only_selected
  return newState
}

export default function compositions(state = initialState, action) {
  switch (action.type) {
    case actionTypes.COMPOSITIONS_UPDATED:
      return addCompositions(state, action)
    case actionTypes.COMPOSITIONS_FILTER_CHANGE:
      return updateFilter(state, action)
    case actionTypes.COMPOSITIONS_TOGGLE_ITEM:
      return toggleComposition(state, action)
    case actionTypes.COMPOSITION_SET_DESTINATION:
      return setCompositionDestination(state, action)
    case actionTypes.RENDER_START:
      return startRender(state, action)
    case actionTypes.RENDER_COMPLETE:
      return completeRender(state, action)
    case actionTypes.PROJECT_STORED_DATA:
      return setStoredData(state, action)
    case actionTypes.COMPOSITION_DISPLAY_SETTINGS:
    case actionTypes.COMPOSITIONS_SET_CURRENT_COMP_ID:
      return setCurrentComp(state, action)
    case actionTypes.SETTINGS_CANCEL:
      return cancelSettings(state, action)
    case actionTypes.SETTINGS_TOGGLE_VALUE:
      return toggleSettingsValue(state, action)
    case actionTypes.SETTINGS_TOGGLE_EXTRA_COMP:
      return toggleExtraComp(state, action)
    case actionTypes.SETTINGS_UPDATE_VALUE:
      return updateSettingsValue(state, action)
    case actionTypes.SETTINGS_TOGGLE_SELECTED:
      return toggleSelected(state, action)
    default:
      return state
  }
}
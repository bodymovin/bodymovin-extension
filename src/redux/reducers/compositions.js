import actionTypes from '../actions/actionTypes'
import ExportModes from '../../helpers/ExportModes'
import LottieVersions, {findLottieVersion} from '../../helpers/LottieVersions'
import LottieLibraryOrigins from '../../helpers/LottieLibraryOrigins'

let initialState = {
	list: [],
  filter: '',
  items:{},
  current: 0,
  show_only_selected: false,
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
        glyphs: true,
        hiddens: false,
        original_names: false,
        should_encode_images: false,
        should_compress: true,
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
        export_mode: ExportModes.STANDARD,
        export_modes: {
          standard: true,
          demo: false,
          standalone: false,
          banner: false,
          avd: false,
          rive: false,
        },
        banner: {
          lottie_origin: LottieLibraryOrigins.LOCAL,
          lottie_path: 'https://',
          lottie_library: LottieVersions[0].value,
          lottie_renderer: 'svg',
          width: 500,
          height: 500,
          use_original_sizes: true,
          original_width: 500,
          original_height: 500,
          click_tag: 'https://',
          zip_files: true,
        }
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
  return {
    ...defaultComposition, 
    id: comp.id, 
    name: comp.name, 
    settings: {
      ...defaultComposition.settings,
      banner: {
        ...defaultComposition.settings.banner,
        width: comp.width || 500,
        height: comp.height || 500,
        original_width: comp.width || 500,
        original_height: comp.height || 500,
      }
    }
  }
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

function updateCompsSize(settings, composition) {
  if(settings.banner.original_width !== composition.width
    || settings.banner.original_height !== composition.height) {
    return {
      ...settings,
        banner: {
          ...settings.banner,
          original_width: composition.width,
          original_height: composition.height,
        }
    }
  }
  return settings
}

function addCompositions(state, action) {
  let newItems = {...state.items}
  let listChanged = false
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
      settings = updateCompsSize(itemData.settings, item)
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
  if (newItem.settings.export_mode === ExportModes.STANDALONE){
    newItem.destination = newItem.destination.replace(extensionReplacer,'.js')
    newItem.absoluteURI = newItem.absoluteURI.replace(extensionReplacer,'.js')
  } else if (newItem.settings.export_mode === ExportModes.STANDARD){
    newItem.destination = newItem.destination.replace(extensionReplacer,'.json')
    newItem.absoluteURI = newItem.absoluteURI.replace(extensionReplacer,'.json')
  } else {
    if (newItem.settings.banner.zip_files) {
      newItem.destination = newItem.destination.replace(extensionReplacer,'.zip')
      newItem.absoluteURI = newItem.absoluteURI.replace(extensionReplacer,'.zip')
    } else {
      newItem.destination = newItem.destination.replace(extensionReplacer,'.json')
      newItem.absoluteURI = newItem.absoluteURI.replace(extensionReplacer,'.json')
    }
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

function applySettingsToAllComps(state, action) {
  const items = state.items
  const itemKeys = Object.keys(items)
  const newItems = itemKeys.reduce((accumulator, key) => {
    const settingsClone = JSON.parse(JSON.stringify(action.settings))
    const item = items[key]
    if (item.selected) {
      const itemSettings = {
        ...item.settings,
        ...settingsClone
      }
      accumulator[key] = {
        ...item,
         settings: itemSettings
      }
    } else {
      accumulator[key] = item
    }
    return accumulator
  }, {})
  return {
    ...state,
    items: newItems
  }
}

function applySettingsFromCache(state, action) {

  if(action.allComps) {
    return applySettingsToAllComps(state, action)
  }

  const settingsClone = JSON.parse(JSON.stringify(action.settings))

  let item = state.items[state.current]
  const newSettings = {
    ...item.settings,
    ...settingsClone,
  }
  const newState = {
    ...state,
    items: {
      ...state.items,
      [state.current]: {
        ...item,
        settings: newSettings
      }
    }
  }
  return newState
}

/*function updateExportMode(state, action) {
  let newItem = {...state.items[state.current]}
  let newSettings = {...newItem.settings}
  newSettings.export_mode = action.exportMode
  if (newItem.destination) {
    if (newSettings.export_mode === ExportModes.STANDALONE) {
      newItem.destination = newItem.destination.replace(extensionReplacer,'.js')
      newItem.absoluteURI = newItem.absoluteURI.replace(extensionReplacer,'.js')
    } else if (newSettings.export_mode === ExportModes.STANDARD){
      newItem.destination = newItem.destination.replace(extensionReplacer,'.json')
      newItem.absoluteURI = newItem.absoluteURI.replace(extensionReplacer,'.json')
    } else {
      if (newSettings.banner.zip_files) {
        newItem.destination = newItem.destination.replace(extensionReplacer,'.zip')
        newItem.absoluteURI = newItem.absoluteURI.replace(extensionReplacer,'.zip')
      } else {
        newItem.destination = newItem.destination.replace(extensionReplacer,'.json')
        newItem.absoluteURI = newItem.absoluteURI.replace(extensionReplacer,'.json')
      }
    }
  }
  newItem.settings = newSettings
  let newItems = {...state.items}
  newItems[state.current] = newItem
  let newState = {...state}
  newState.items = newItems
  return newState
}*/

function toggleMode(state, action) {
  let newItem = {...state.items[state.current]}
  let newSettings = {...newItem.settings}
  const mode = action.value
  newSettings.export_modes = {
    ...newSettings.export_modes,
    [mode]: !newSettings.export_modes[mode]
  }
  newItem.settings = newSettings
  ////
  if (newItem.destination) {
    if (newSettings.export_modes.standalone) {
      newItem.destination = newItem.destination.replace(extensionReplacer,'.js')
      newItem.absoluteURI = newItem.absoluteURI.replace(extensionReplacer,'.js')
    } else if (newSettings.export_modes.banner && newSettings.banner.zip_files){
      newItem.destination = newItem.destination.replace(extensionReplacer,'.zip')
      newItem.absoluteURI = newItem.absoluteURI.replace(extensionReplacer,'.zip')
    } else {
      newItem.destination = newItem.destination.replace(extensionReplacer,'.json')
      newItem.absoluteURI = newItem.absoluteURI.replace(extensionReplacer,'.json')
    }
  }
  ////
  let newItems = {...state.items}
  newItems[state.current] = newItem
  return {
    ...state,
    items: newItems
  }
}

function updateBanner(state, action) {
  let newItem = {...state.items[state.current]}
  let newSettings = {...newItem.settings}
  const newBanner = {...newSettings.banner}
  if (action.type === actionTypes.SETTINGS_BANNER_WIDTH_UPDATED) {
    newBanner.width = action.value
  } else if (action.type === actionTypes.SETTINGS_BANNER_HEIGHT_UPDATED) {
    newBanner.height = action.value
  } else if (action.type === actionTypes.SETTINGS_BANNER_ORIGIN_UPDATED) {
    newBanner.lottie_origin = action.value
  } else if (action.type === actionTypes.SETTINGS_BANNER_VERSION_UPDATED) {
    newBanner.lottie_library = action.value
  } else if (action.type === actionTypes.SETTINGS_BANNER_LIBRARY_PATH_UPDATED) {
    newBanner.lottie_path = action.value
  } else if (action.type === actionTypes.SETTINGS_BANNER_RENDERER_UPDATED) {
    newBanner.lottie_renderer = action.value
  } else if (action.type === actionTypes.SETTINGS_BANNER_CLICK_TAG_UPDATED) {
    newBanner.click_tag = action.value
  } else if (action.type === actionTypes.SETTINGS_BANNER_ZIP_FILES_UPDATED) {
    newBanner.zip_files = !newBanner.zip_files
  } else if (action.type === actionTypes.SETTINGS_BANNER_CUSTOM_SIZE_UPDATED) {
    newBanner.use_original_sizes = !newBanner.use_original_sizes
  }
  if (action.type === actionTypes.SETTINGS_BANNER_ORIGIN_UPDATED 
    || action.type === actionTypes.SETTINGS_BANNER_VERSION_UPDATED) 
  {
    if (newBanner.lottie_origin !== LottieLibraryOrigins.CUSTOM) {
      const lottieVersion = findLottieVersion(newBanner.lottie_library)
      if (!lottieVersion.renderers.includes(newBanner.lottie_renderer)) {
        newBanner.lottie_renderer = lottieVersion.renderers[0]
      }
    }
  }
  newSettings.banner = newBanner
  newItem.settings = newSettings
  let newItems = {...state.items}
  newItems[state.current] = newItem

  if (action.type === actionTypes.SETTINGS_BANNER_ZIP_FILES_UPDATED) {
    if (newBanner.zip_files) {
      newItem.destination = newItem.destination.replace(extensionReplacer,'.zip')
      newItem.absoluteURI = newItem.absoluteURI.replace(extensionReplacer,'.zip')
    } else {
      newItem.destination = newItem.destination.replace(extensionReplacer,'.json')
      newItem.absoluteURI = newItem.absoluteURI.replace(extensionReplacer,'.json')
    }
  }

  return {
    ...state,
    items: newItems
  }

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
    case actionTypes.SETTINGS_APPLY_FROM_CACHE:
      return applySettingsFromCache(state, action)
    case actionTypes.SETTINGS_BANNER_WIDTH_UPDATED:
    case actionTypes.SETTINGS_BANNER_HEIGHT_UPDATED:
    case actionTypes.SETTINGS_BANNER_ORIGIN_UPDATED:
    case actionTypes.SETTINGS_BANNER_VERSION_UPDATED:
    case actionTypes.SETTINGS_BANNER_LIBRARY_PATH_UPDATED:
    case actionTypes.SETTINGS_BANNER_RENDERER_UPDATED:
    case actionTypes.SETTINGS_BANNER_CLICK_TAG_UPDATED:
    case actionTypes.SETTINGS_BANNER_ZIP_FILES_UPDATED:
    case actionTypes.SETTINGS_BANNER_CUSTOM_SIZE_UPDATED:
      return updateBanner(state, action)
    case actionTypes.SETTINGS_MODE_TOGGLE:
      return toggleMode(state, action)
    default:
      return state
  }
}
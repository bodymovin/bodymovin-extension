import React from 'react'
import {connect} from 'react-redux'
import {routes} from '../redux/reducers/routes'

import Render from './render/Render'
import Compositions from './compositions/Compositions'
import SettingsView from './settings/Settings'
import PreviewView from './preview/Preview'
import FontsView from './fonts/Fonts'
import PlayerView from './player/Player'
import FileImportView from './fileImport/FileImport'

function getView(route) {
	switch(route) {
      case routes.compositions:
        return <Compositions />
      case routes.render:
        return <Render />
      case routes.preview:
        return <PreviewView />
      case routes.settings:
        return <SettingsView />
      case routes.fonts:
        return <FontsView />
      case routes.player:
        return <PlayerView />
      case routes.importFile:
        return <FileImportView />
      default:
        return <Compositions />
    }
}

let ViewsContainer = (props) => <div style={{width:'100%',height:'100%'}}>{getView(props.route)}</div>

function mapStateToProps(state) {
  return state.routes
}

export default connect(mapStateToProps,null)(ViewsContainer)
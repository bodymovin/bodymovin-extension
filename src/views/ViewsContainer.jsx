import React from 'react'
import {connect} from 'react-redux'

import Render from './render/Render'
import Compositions from './compositions/Compositions'
import SettingsView from './settings/Settings'
import PreviewView from './preview/Preview'
import FontsView from './fonts/Fonts'
import PlayerView from './player/Player'

function getView(route) {
	switch(route) {
      case 0:
        return <Compositions />
      case 1:
        return <Render />
      case 2:
        return <PreviewView />
      case 3:
        return <SettingsView />
      case 4:
        return <FontsView />
      case 5:
        return <PlayerView />
      default:
        return <Compositions />
    }
}

let ViewsContainer = (props) => <div style={{width:'100%',height:'100%'}}>{getView(props.route)}</div>

function mapStateToProps(state) {
  return state.routes
}

export default connect(mapStateToProps,null)(ViewsContainer)
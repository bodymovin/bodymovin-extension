import React from 'react'
import { browserHistory } from 'react-router'
import {connect} from 'react-redux'
import { StyleSheet, css } from 'aphrodite'
import BaseButton from '../../components/buttons/Base_button'
import SettingsListItem from './list/SettingsListItem'
import {setCurrentCompId, cancelSettings, toggleSettingsValue, updateSettingsValue, toggleExtraComp, goToComps} from '../../redux/actions/compositionActions'
import settings_view_selector from '../../redux/selectors/settings_view_selector'

const styles = StyleSheet.create({
    container: {
      width: '100%',
      height: '100%',
      fontSize: '12px',
      color: '#eee',
      marginBottom: '10px',
      display: 'flex',
      flexDirection: 'column'
    },
    compsList: {
      width: '100%',
      background: 'black',
      flexGrow: 1,
      overflowY: 'auto',
      overflowX: 'hidden'
    },
    bottomNavigation: {
      borderRadius:'4px',
      width: '100%',
      flexGrow: 0,
      height: '40px',
      marginBottom: '20px',
      marginTop: '20px',
      textAlign: 'center'
    },
    extraCompsContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      width: '100%',
      padding: '10px 10px 10px 60px',
    },
    extraCompsItem: {
      padding: '6px 4px',
      borderRadius: '4px',
      border: '1px solid white',
      backgroundColor: '#333',
      color: '#fff',
      marginRight: '4px',
      marginBottom: '4px',
      cursor: 'pointer',
      textAlign: 'center',
      flexGrow: 1,
      textOverflow: 'ellipsis',
      overflow: 'hidden'

    },
    extraCompsItemSelected: {
      backgroundColor: '#fff',
      color: '#333'
    }
})

class Settings extends React.Component {

  constructor() {
    /*demo: false
    extraComps: Object
    active: false
    list: Array
    glyphs: false
    guideds: falsehiddens: falsesegmentTime: 10segmented: falsestandalone: false*/
    super()
    this.storedSettings = null
    this.cancelSettings = this.cancelSettings.bind(this)
    this.toggleGlyphs = this.toggleValue.bind(this,'glyphs')
    this.toggleGuideds = this.toggleValue.bind(this,'guideds')
    this.toggleHiddens = this.toggleValue.bind(this,'hiddens')
    this.toggleSegmented = this.toggleValue.bind(this,'segmented')
    this.toggleStandalone = this.toggleValue.bind(this,'standalone')
    this.toggleDemo = this.toggleValue.bind(this,'demo')
    this.toggleExtraComps = this.toggleValue.bind(this,'extraComps')
    this.segmentedChange = this.segmentedChange.bind(this)
  }

	componentDidMount() {
    if (this.props.settings) {
      this.storedSettings = this.props.settings
    } else {
      this.props.setCurrentCompId(this.props.params.id)
    }
	}

  componentWillReceiveProps(props) {
    if(!this.storedSettings && props.settings) {
      this.storedSettings = props.settings
    }
  }

  cancelSettings() {
    this.props.cancelSettings(this.storedSettings)
    //browserHistory.push('/')
  }

  saveSettings() {
    //browserHistory.push('/')
    this.props.goToComps()
  }

  toggleValue(name) {
    this.props.toggleSettingsValue(name)
  }

  segmentedChange(ev) {
    let segments = parseInt(ev.target.value, 10)
    if(ev.target.value === '') {
      this.props.updateSettingsValue('segmentedTime', '')
    }
    if(isNaN(segments) || segments < 0) {
      return
    }
    this.props.updateSettingsValue('segmentedTime', segments)
  }

  getExtraComps() {
    return this.props.extraCompsList.map(function(item){
      return (<div 
                key={item.id}
                className={css(styles.extraCompsItem, item.selected ? styles.extraCompsItemSelected : '')}
                onClick={()=>this.props.toggleExtraComp(item.id)}>
                {item.name}
              </div>)
    }.bind(this))
  }

  render() {
    return (
    	<div>
        <div className={css(styles.container)}>
          <ul className={css(styles.compsList)}>
            <SettingsListItem 
              title='Split'
              description='Splits comp in multiple files every X seconds'
              toggleItem={this.toggleSegmented}
              active={this.props.settings ? this.props.settings.segmented : false} 
              needsInput={true} 
              inputValue={this.props.settings ? this.props.settings.segmentedTime : 0} 
              inputValueChange={this.segmentedChange} />
            <SettingsListItem 
              title='Glyphs'
              description='Checked converts fonts to shapes'
              toggleItem={this.toggleGlyphs}
              active={this.props.settings ? this.props.settings.glyphs : false} />
            <SettingsListItem 
              title='Hidden'
              description='Check if you need HIDDEN layers to be exported'
              toggleItem={this.toggleHiddens}
              active={this.props.settings ? this.props.settings.hiddens : false}  />
            <SettingsListItem 
              title='Guides'
              description='Check if you need GUIDED layers to be exported'
              toggleItem={this.toggleGuideds}
              active={this.props.settings ? this.props.settings.guideds : false}  />
            <SettingsListItem 
              title='Extra Comps'
              description='Check if expressions are pointing to external comps'
              toggleItem={this.toggleExtraComps}
              active={this.props.settings ? this.props.settings.extraComps.active : false}  />
              {this.props.settings && this.props.settings.extraComps.active && 
            <li className={css(styles.extraCompsContainer)}>
              {this.getExtraComps()}
            </li>}
            <SettingsListItem 
              title='Standalone'
              description='Exports animation and player bundled in a single file'
              toggleItem={this.toggleStandalone}
              active={this.props.settings ? this.props.settings.standalone : false}  />
            <SettingsListItem 
              title='Demo'
              description='Exports an html for local preview'
              toggleItem={this.toggleDemo}
              active={this.props.settings ? this.props.settings.demo : false}  />
          </ul>
          <div className={css(styles.bottomNavigation)}>
            <BaseButton text='Cancel' type='green' onClick={this.cancelSettings}></BaseButton>
            <BaseButton text='Save' type='gray' onClick={this.saveSettings}></BaseButton>
          </div>
        </div>
    	</div>
    	);
  }
}

function mapStateToProps(state) {
  return settings_view_selector(state)
}

const mapDispatchToProps = {
  setCurrentCompId: setCurrentCompId,
  cancelSettings: cancelSettings,
  toggleSettingsValue: toggleSettingsValue,
  updateSettingsValue: updateSettingsValue,
  toggleExtraComp: toggleExtraComp,
  goToComps: goToComps
}

export default connect(mapStateToProps, mapDispatchToProps)(Settings)

import React from 'react'
import {connect} from 'react-redux'
import { StyleSheet, css } from 'aphrodite'
import BaseButton from '../../components/buttons/Base_button'
import SettingsListItem from './list/SettingsListItem'
import SettingsExportMode from './SettingsExportMode'
import SettingsCollapsableItem from './collapsable/SettingsCollapsableItem'
import SettingsAssets from './SettingsAssets'
import {setCurrentCompId, cancelSettings, toggleSettingsValue, updateSettingsValue, toggleExtraComp, goToComps, rememberSettings, applySettings} from '../../redux/actions/compositionActions'
import settings_view_selector from '../../redux/selectors/settings_view_selector'
import Variables from '../../helpers/styles/variables'

const styles = StyleSheet.create({
    wrapper: {
      width: '100%',
      height: '100%',
      padding: '10px',
      backgroundColor: '#161616'
    },
    container: {
      width: '100%',
      height: '100%',
      fontSize: '12px',
      color: '#eee',
      marginBottom: '10px',
      display: 'flex',
      flexDirection: 'column'
    },
    header: {
      width: '100%',
      height: '60px',
      alignItems: 'center',
      display: 'flex',
      flexGrow: 0,
      padding: '10px 0',
      justifyContent: 'space-between'
    },
    headerTitle: {
      flexGrow: 0,
      fontSize: '18px',
    },
    headerButtons: {
      flexGrow: 0,
      display: 'inline-block',
      verticalAlign: 'top',
    },
    headerButtonsButton: {
      backgroundColor: 'transparent',
      borderRadius:'4px',
      color: Variables.colors.green,
      cursor: 'pointer',
      display: 'inline-block',
      marginLeft: '4px',
      padding: '4px 1px',
      textDecoration: 'underline',
      verticalAlign: 'top',
    },
    headerSpacer: {
      width: '100%',
      flexGrow: 0,
      fontSize: '18px',
      padding: '12px 4px'
    },
    compsList: {
      width: '100%',
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
    bottomNavigationSeparator: {
      width: '10px',
      display: 'inline-block'
    },
    extraCompsWrapper: {
      width: '100%',
      background: Variables.colors.gray_darkest
    },
    extraCompsContainer: {
      padding: '10px 10px 10px 60px',
      display: 'flex',
      flexWrap: 'wrap',
      height: '100%',
      width: '100%',
      background: Variables.gradients.blueGreen
    },
    extraCompsItem: {
      padding: '6px 4px',
      borderRadius: '4px',
      border: '1px solid white',
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

class Settings extends React.PureComponent {

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
    this.toggleOriginalNames = this.toggleValue.bind(this,'original_names')
    this.toggleOriginalAssets = this.toggleValue.bind(this,'original_assets')
    this.toggleCompressImages = this.toggleValue.bind(this,'should_compress')
    this.toggleEncodeImages = this.toggleValue.bind(this,'should_encode_images')
    this.toggleSkipImages = this.toggleValue.bind(this,'should_skip_images')
    this.toggleIncludeVideo = this.toggleValue.bind(this,'should_include_av_assets')
    this.toggleExpressionProperties = this.toggleValue.bind(this,'ignore_expression_properties')
    this.toggleJsonFormat = this.toggleValue.bind(this,'export_old_format')
    this.toggleSkipDefaultProperties = this.toggleValue.bind(this,'skip_default_properties')
    this.toggleNotSupportedProperties = this.toggleValue.bind(this,'not_supported_properties')
    this.toggleExtraComps = this.toggleValue.bind(this,'extraComps')
    this.qualityChange = this.qualityChange.bind(this)
    this.sampleSizeChange = this.sampleSizeChange.bind(this)
    this.toggleBakeExpressionProperties = this.toggleValue.bind(this,'expressions:shouldBake')
    this.toggleCacheExpressionProperties = this.toggleValue.bind(this,'expressions:shouldCacheExport')
    this.toggleRestrictToWorkAreaProperties = this.toggleValue.bind(this,'expressions:shouldRestrictToWorkArea')
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

  qualityChange(ev) {
    let segments = parseInt(ev.target.value, 10)
    if(ev.target.value === '') {
      this.props.updateSettingsValue('compression_rate', 0)
    }
    if(isNaN(segments) || segments < 0) {
      return
    }
    this.props.updateSettingsValue('compression_rate', segments)
  }

  sampleSizeChange(ev) {
    let sampleSize = parseInt(ev.target.value, 10)
    if(ev.target.value === '') {
      this.props.updateSettingsValue('expressions:sampleSize', 1)
    }
    if(isNaN(sampleSize) || sampleSize < 0) {
      return
    }
    this.props.updateSettingsValue('expressions:sampleSize', sampleSize)
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
    	<div className={css(styles.wrapper)}>
        <div className={css(styles.container)}>
          <div className={css(styles.header)}>
            <div className={css(styles.headerTitle)}>Settings</div>
              <div className={css(styles.headerButtons)}>
                <button 
                  className={css(styles.headerButtonsButton)}
                  onClick={this.props.onRememberSettings}
                >
                 Remember Settings
                </button>
                <button 
                  className={css(styles.headerButtonsButton)}
                  onClick={this.props.onApplySettings}
                >
                 Apply Settings
                </button>
              </div>
          </div>
          <ul className={css(styles.compsList)}>
            <SettingsCollapsableItem 
              title={'Expression options'}
              description={'Converts expressions to keyframes. This might be a slow process.'}
              >
              <SettingsListItem 
                title='Convert expressions to keyframes'
                description='Exports expressions as keyframes (can increase file size significantly)'
                toggleItem={this.toggleBakeExpressionProperties}
                active={this.props.settings ? this.props.settings.expressions.shouldBake : false}
              />
              <SettingsListItem 
                title='Cache values'
                description='Caches keyframe values to speed up next render.'
                toggleItem={this.toggleCacheExpressionProperties}
                active={this.props.settings ? this.props.settings.expressions.shouldCacheExport : false}
              />
              <SettingsListItem 
                title='Limit to work area range'
                description='Only creates keyframes for work area range. Might not work with time remapping.'
                toggleItem={this.toggleRestrictToWorkAreaProperties}
                active={this.props.settings ? this.props.settings.expressions.shouldRestrictToWorkArea : false}
              />
              <SettingsListItem 
                title='Sample size'
                description='Samples keyframes every n frames. Might reduce file size and speed up export.'
                active={this.props.settings.expressions.shouldBake} 
                needsInput={true} 
                inputValue={this.props.settings ? this.props.settings.expressions.sampleSize : 1} 
                inputValueChange={this.sampleSizeChange}
              />

            </SettingsCollapsableItem>
            <SettingsListItem 
              title='Glyphs'
              description='If selected it converts fonts to shapes'
              toggleItem={this.toggleGlyphs}
              active={this.props.settings ? this.props.settings.glyphs : false} />
            <SettingsListItem 
              title='Hidden'
              description='Select if you need HIDDEN layers to be exported'
              toggleItem={this.toggleHiddens}
              active={this.props.settings ? this.props.settings.hiddens : false}  />
            <SettingsListItem 
              title='Guides'
              description='Select if you need GUIDED layers to be exported'
              toggleItem={this.toggleGuideds}
              active={this.props.settings ? this.props.settings.guideds : false}  />
            <SettingsListItem 
              title='Extra Comps'
              description='Select if expressions are pointing to external comps'
              toggleItem={this.toggleExtraComps}
              active={this.props.settings ? this.props.settings.extraComps.active : false}  />
              {this.props.settings && this.props.settings.extraComps.active && 
            <li className={css(styles.extraCompsWrapper)}>
              <div className={css(styles.extraCompsContainer)}>
                {this.getExtraComps()}
              </div>
            </li>}
            <SettingsAssets
              settings={this.props.settings}
              canCompressAssets={this.props.canCompressAssets}
              toggleOriginalNames={this.toggleOriginalNames}
              toggleOriginalAssets={this.toggleOriginalAssets}
              toggleCompressImages={this.toggleCompressImages}
              qualityChange={this.qualityChange}
              toggleEncodeImages={this.toggleEncodeImages}
              toggleSkipImages={this.toggleSkipImages}
              toggleIncludeVideo={this.toggleIncludeVideo}
            />
            
            <SettingsExportMode />
            <SettingsCollapsableItem 
              title={'Advanced export settings'}
              description={'Advanced export features'}
              >
              <SettingsListItem 
                title='Remove expression properties (Reduces filesize)'
                description='Removes properties that are only used for expressions. Select if your animation is not using expressions or your expressions are not using special properties.'
                toggleItem={this.toggleExpressionProperties}
                active={this.props.settings ? this.props.settings.ignore_expression_properties : false}  />
              <SettingsListItem 
                title='Export old json format (for backwards compatibility)'
                description='Exports old json format in case you are using it with older players'
                toggleItem={this.toggleJsonFormat}
                active={this.props.settings ? this.props.settings.export_old_format : false}  />
              <SettingsListItem 
                title='Skip default properties (Reduces filesize)'
                description='Skips default properties. Uncheck if you are not using the latest Ios, Android or web players.'
                toggleItem={this.toggleSkipDefaultProperties}
                active={this.props.settings ? this.props.settings.skip_default_properties : false}  />
              <SettingsListItem 
                title='Include non supported properties'
                description='Only check this if you need specific properties for uses  other that the player.'
                toggleItem={this.toggleNotSupportedProperties}
                active={this.props.settings ? this.props.settings.not_supported_properties : false}  />
            </SettingsCollapsableItem>
          </ul>
          <div className={css(styles.bottomNavigation)}>
            <BaseButton text='Cancel' type='gray' onClick={this.cancelSettings}></BaseButton>
            <div className={css(styles.bottomNavigationSeparator)}></div>
            <BaseButton text='Save' type='green' onClick={this.props.goToComps}></BaseButton>
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
  onRememberSettings: rememberSettings,
  onApplySettings: applySettings,
  cancelSettings: cancelSettings,
  goToComps: goToComps,
  toggleSettingsValue: toggleSettingsValue,
  updateSettingsValue: updateSettingsValue,
  toggleExtraComp: toggleExtraComp,
}

export default connect(mapStateToProps, mapDispatchToProps)(Settings)

import React from 'react'
import {connect} from 'react-redux'
import { StyleSheet, css } from 'aphrodite'
import SettingsListItem from './list/SettingsListItem'
// import SettingsCollapsableItem from './collapsable/SettingsCollapsableItem'
import {
  handleModeToggle, 
  updateSettingsValue, 
  toggleSettingsValue, 
} from '../../redux/actions/compositionActions'
import settings_standard_selector from '../../redux/selectors/settings_standard_selector'

const styles = StyleSheet.create({
    wrapper: {
      width: '100%'
    },
    wrapperActive: {
      border: '1px solid #666',
    },
    settings: {
      padding: '10px 10px',
      backgroundColor: '#111',
    },
    compsList: {
      width: '100%',
      flexGrow: 1,
      overflowY: 'auto',
      overflowX: 'hidden',
    },
})

class SettingsExportModeStandard extends React.PureComponent {

  handleModeToggle = () => {
    this.props.handleModeToggle('standard');
  }

  toggleSegmented = () => {
    this.props.toggleSettingsValue('segmented')
  }

  segmentedChange = (ev) => {
    let segments = parseInt(ev.target.value, 10)
    if(ev.target.value === '') {
      this.props.updateSettingsValue('segmentedTime', '')
    }
    if(isNaN(segments) || segments < 0) {
      return
    }
    this.props.updateSettingsValue('segmentedTime', segments)
  }

	render(){ 
		return (
      <div className={css(styles.wrapper, this.props._isActive ? styles.wrapperActive: '')}>
        <ul>
          <SettingsListItem 
            title='Standard'
            description='Exports animation as a json file'
            toggleItem={this.handleModeToggle}
            active={this.props._isActive} />
        </ul>
        {this.props._isActive && 
          <div className={css(styles.settings)}>
            {/*<SettingsCollapsableItem
                          title={'Settings'}
                        >*/}
              <ul className={css(styles.compsList)}>
                <SettingsListItem 
                  title='Split'
                  description='Splits comp in multiple json files every X seconds'
                  toggleItem={this.toggleSegmented}
                  active={this.props.settings ? this.props.settings.segmented : false} 
                  needsInput={true} 
                  inputValue={this.props.settings ? this.props.settings.segmentedTime : 0} 
                  inputValueChange={this.segmentedChange} />
              </ul>
            {/*</SettingsCollapsableItem>*/}
          </div>
        }
      </div>
    )
	}
}

function mapStateToProps(state) {
  return settings_standard_selector(state)
}

const mapDispatchToProps = {
  handleModeToggle: handleModeToggle,
  toggleSettingsValue: toggleSettingsValue,
  updateSettingsValue: updateSettingsValue,
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingsExportModeStandard)
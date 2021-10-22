import React from 'react'
import {connect} from 'react-redux'
import { StyleSheet, css } from 'aphrodite'
import SettingsListItem from './list/SettingsListItem'
import SettingsListColor from './list/SettingsListColor'
import {
  handleModeToggle, 
  handleDemoBackgroundColorChange, 
} from '../../redux/actions/compositionActions'
import settings_selector from '../../redux/selectors/settings_demo_selector'

const styles = StyleSheet.create({
    wrapper: {
      width: '100%'
    },
    wrapperActive: {
      border: '1px solid #666',
    },
    compsList: {
      width: '100%',
      flexGrow: 1,
      overflowY: 'auto',
      overflowX: 'hidden',
    },
    settings: {
      padding: '10px 10px',
      backgroundColor: '#111',
    },
})

class SettingsExportModeStandard extends React.PureComponent {

  handleModeToggle = () => {
    this.props.handleModeToggle('demo');
  }

  colorChange = color => {
    this.props.handleColorChange(color)
  }

	render(){ 
		return (
      <div className={css(styles.wrapper, this.props._isActive && styles.wrapperActive)}>
        <ul>
          <SettingsListItem 
            title='Demo'
            description='Exports an html for local preview'
            toggleItem={this.handleModeToggle}
            active={this.props._isActive} />
        </ul>

        {this.props._isActive && 
          <div className={css(styles.settings)}>
            {/*<SettingsCollapsableItem
                          title={'Settings'}
                        >*/}
              <ul className={css(styles.compsList)}>
                <SettingsListColor 
                  title='Background Color'
                  description='Set the background color'
                  inputValue={this.props.backgroundColor || '#fff'} 
                  inputValueChange={this.colorChange} />
              </ul>
            {/*</SettingsCollapsableItem>*/}
          </div>
        }
      </div>
    )
	}
}

function mapStateToProps(state) {
  return settings_selector(state)
}

const mapDispatchToProps = {
  handleModeToggle: handleModeToggle,
  handleColorChange: handleDemoBackgroundColorChange,
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingsExportModeStandard)
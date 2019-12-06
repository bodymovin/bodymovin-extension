import React from 'react'
import {connect} from 'react-redux'
import SettingsListDropdown from './list/SettingsListDropdown'
import {handleExportMode} from '../../redux/actions/compositionActions'
import settings_export_mode_selector from '../../redux/selectors/settings_export_mode_selector'
import ExportModes from '../../helpers/ExportModes'

class SettingsExportMode extends React.PureComponent {

  handleChange = (value) => {
    this.props.handleExportMode(value)
  }

	render(){ 
    console.log('this.props.export_mode', this.props.export_mode)
		return (
      <span>
        <SettingsListDropdown 
          title='Export mode'
          description='Exports animation and player bundled in a single file'
          onChange={this.handleChange}
          current={this.props.export_mode}
          options={[
            {value:ExportModes.STANDARD, text: 'Standard'}, 
            {value:ExportModes.STANDALONE, text: 'Standalone'}, 
            {value:ExportModes.BANNER, text: 'Banner'}
          ]}  
        />
      </span>
    )
	}
}

function mapStateToProps(state) {
  return settings_export_mode_selector(state)
}

const mapDispatchToProps = {
  handleExportMode: handleExportMode,
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingsExportMode)
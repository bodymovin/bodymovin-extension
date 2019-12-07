import React from 'react'
import {connect} from 'react-redux'
import SettingsListDropdown from './list/SettingsListDropdown'
import SettingsBanner from './SettingsBanner'
import {handleExportMode} from '../../redux/actions/compositionActions'
import settings_export_mode_selector from '../../redux/selectors/settings_export_mode_selector'
import ExportModes from '../../helpers/ExportModes'

class SettingsExportMode extends React.PureComponent {

  descriptions = {
    [ExportModes.STANDARD]: 'Exports animation as a json file',
    [ExportModes.STANDALONE]: 'Exports animation and player bundled in a single file',
    [ExportModes.BANNER]: 'Exports a bundle of files for banner usage',
  }

  handleChange = (value) => {
    this.props.handleExportMode(value)
  }

  getDescription() {

  }

	render(){ 
		return (
      <span>
        <SettingsListDropdown 
          title='Export mode'
          description={this.descriptions[this.props.export_mode]}
          onChange={this.handleChange}
          current={this.props.export_mode}
          options={[
            {value:ExportModes.STANDARD, text: 'Standard'}, 
            {value:ExportModes.STANDALONE, text: 'Standalone'}, 
            {value:ExportModes.BANNER, text: 'Banner'}
          ]}  
        />
        {
          this.props.export_mode === ExportModes.BANNER &&
          <SettingsBanner />
        }
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
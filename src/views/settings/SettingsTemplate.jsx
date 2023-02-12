import React from 'react'
import {connect} from 'react-redux'
import SettingsListItem from './list/SettingsListItem'
import SettingsListDropdown from './list/SettingsListDropdown'
import SettingsCollapsableItem from './collapsable/SettingsCollapsableItem'
import selector from '../../redux/selectors/settings_template_view_selector'
import {
  toggleSettingsValue,
  updateSettingsValue, 
} from '../../redux/actions/compositionActions'

class SettingsTemplate extends React.PureComponent {

  namespace = 'template:'

  

  handleTemplateChange = (value) => {
    this.props.updateSettingsValue(`${this.namespace}id`, value)
  }

  render() {
    return (
    	<SettingsCollapsableItem 
        title={'Blueprint'}
        description={'Use a blueprint to attach to the animation to validate export'}
        >
        <SettingsListItem 
          title='Activate blueprint validation'
          description='if active, after render, the result will be validated against the selected blueprint'
          toggleItem={() => this.props.toggle(`${this.namespace}active`)}
          active={this.props.data ? this.props.data.active : false}  />
        <SettingsListDropdown 
          title='Select blueprint'
          description='Select a blueprint to use for validation'
          onChange={this.handleTemplateChange}
          current={this.props.data.id}
          options={this.props.templates}  
        />
      </SettingsCollapsableItem>
    	);
  }
}

function mapStateToProps(state) {
  return selector(state)
}

const mapDispatchToProps = {
  toggle: toggleSettingsValue,
  updateSettingsValue: updateSettingsValue,
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingsTemplate)

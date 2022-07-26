import React from 'react'
import {connect} from 'react-redux'
import { StyleSheet, css } from 'aphrodite'
import SettingsListItem from './list/SettingsListItem'
import SettingsListDropdown from './list/SettingsListDropdown'
import SettingsCollapsableItem from './collapsable/SettingsCollapsableItem'
import selector from '../../redux/selectors/settings_template_view_selector'
import {
  toggleSettingsValue,
  updateSettingsValue, 
} from '../../redux/actions/compositionActions'

const styles = StyleSheet.create({
  customProps: {
    padding: '10px 0 10px 24px',
  },
  customPropsTitle: {
    fontSize: '14px',
    padding: '4px 0',
  },
  customPropsButton: {
    padding: '4px 0',
  }
})

class SettingsTemplate extends React.PureComponent {

  namespace = 'template:'

  

  handleTemplateChange = (value) => {
    this.props.updateSettingsValue(`${this.namespace}id`, value)
  }

  render() {
    return (
    	<SettingsCollapsableItem 
        title={'Template'}
        description={'Use a template to attach to animation to validate export'}
        >
        <SettingsListItem 
          title='Activate template validation'
          description='if active, after render, the result will be validated against the selected template'
          toggleItem={() => this.props.toggle(`${this.namespace}active`)}
          active={this.props.data ? this.props.data.active : false}  />
        <SettingsListDropdown 
          title='Select template'
          description='Select a template to use for validation'
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

import BaseAlert from './BaseAlert'
import { StyleSheet, css } from 'aphrodite'
import React from 'react'
import {connect} from 'react-redux'
import {clearProjectsFromCache, clearCacheCancelled} from '../../redux/actions/compositionActions'
import SettingsListItem from '../../views/settings/list/SettingsListItem';
import variables from '../../helpers/styles/variables'


const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    height: '100%',
    padding: '10px',
    position: 'absolute',
    top:'0',
    left:'0',
    backgroundColor:'rgba(71,71,71,.9)',
    overflow: 'auto',
    display: 'flex',
    'flex-direction': 'column',
  },
  'deletable-title': {
    color: variables.colors.white,
    padding: '8px 0',
    'font-size': '14px',
  },
  'deletable-title-par': {
    padding: '2px 0',
  }
})

class StorageAlerts extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      selected: [],
    }
  }

  toggleItem(project) {
    const index = this.state.selected.findIndex(id => id === project.id);
    if (index === -1) {
      this.setState({
        selected: [...this.state.selected, project.id]
      })
    } else {
      this.setState({
        selected: [
          ...this.state.selected.slice(0, index),
          ...this.state.selected.slice(index + 1),
        ]
      })
    }
  }

  buildDeletableProjects(projects) {
    if (!projects.length) {
      return null;
    }
    return (<div>
      <div className={css(styles['deletable-title'])}>
        <p className={css(styles['deletable-title-par'])}>Settings are stored in a limited storage location.</p>
        <p className={css(styles['deletable-title-par'])}>In order to save new settings, some older settings have to be deleted.</p>
        <p className={css(styles['deletable-title-par'])}>Select what setting to erase (This will not delete the project file, only the stored settings)</p>
      </div>
      <ul>
        {projects.map(project => {
          return (
            <SettingsListItem
                key={project.id}
                title={project.name}
                description={'Size: ' + project.size}
                toggleItem={() => this.toggleItem(project)}
                active={this.state.selected.includes(project.id)}
            />
          )
        })}
      </ul>
    </div>)
  }

  buildContent(data) {
    return (<div>
      {this.buildDeletableProjects(data.projects)}
    </div>)
  }

  buildButtons(data) {
    const buttons = []
    if (!data.projects.length || this.state.selected.length) {
      buttons.push({
        text: 'Confirm',
        action: () => this.props.clearProjectsFromCache(this.state.selected),
        type: 'green',
      })
    }
    buttons.push({
      text: 'Cancel',
      action: this.props.clearCacheCancelled,
      type: 'gray',
    })
    return buttons
  }

	render() {
    const { data } = this.props
		return (
    <BaseAlert
      buttons={this.buildButtons(data)}
      pars={[
        'Your local storage is full.',
      ]}
    >
      {this.buildContent(data)}
    </BaseAlert>
    )
	}
}

function mapStateToProps(state) {
  return {alerts: state.alerts}
}

const mapDispatchToProps = {
  clearProjectsFromCache: clearProjectsFromCache,
  clearCacheCancelled: clearCacheCancelled,
}

export default connect(mapStateToProps, mapDispatchToProps)(StorageAlerts)
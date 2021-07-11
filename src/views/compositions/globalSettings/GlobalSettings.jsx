import React from 'react'
import { StyleSheet, css } from 'aphrodite'
import BaseButton from '../../../components/buttons/Base_button'
import SettingsListItem from '../../settings/list/SettingsListItem'
import SettingsListFile from '../../settings/list/SettingsListFile'

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    height: '100%',
    padding: '10px',
  },
  background: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: '#161616',
  },
  modal: {
    width: '80%',
    height: '80%',
    padding: '2px',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    margin: 'auto',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-end',
  },
  content: {
    width: '100%',
    flex: '1 1 auto',
    padding: '10px 0',
  },
  settingsList: {
    background: 'green',
  },
})

class GlobalSettings extends React.Component {
  
  render() {
    return (
      <div className={css(styles.wrapper)}>
        <div className={css(styles.background)} />
        <div className={css(styles.modal)}>
          <div className={css(styles.header)}>
            <BaseButton
                text='Close'
                type='gray'
                classes={styles.button}
                onClick={this.props.onClose}
            />
          </div>
          <div className={css(styles.content)}>
            <ul className={css(styles.settingsList)}>
              <SettingsListItem 
                title='Use comp name'
                description='Default to composition name for file export'
                toggleItem={this.props.onCompNameAsDefaultToggle}
                active={this.props.shouldUseCompNameAsDefault}
              />
              {<SettingsListItem 
                title='include comp name as folder'
                description='includes composition name in the saving path'
                toggleItem={this.props.onIncludeCompNameAsFolderToggle}
                active={this.props.shouldIncludeCompNameAsFolder}
              />}
              <SettingsListItem 
                title='Use AE location'
                description='defaults to AE location as detination folder'
                toggleItem={this.props.onAEAsPathToggle}
                active={this.props.shouldUseAEPathAsDestinationFolder}
              />
              {!this.props.shouldUseAEPathAsDestinationFolder && <SettingsListItem 
                  title='Use custom saving location'
                  description='defaults saving folder to selected location'
                  toggleItem={this.props.onDefaultPathAsFolder}
                  active={this.props.shouldUsePathAsDefaultFolder}
                />
              }
              {!this.props.shouldUseAEPathAsDestinationFolder &&
                this.props.shouldUsePathAsDefaultFolder &&
                <SettingsListFile
                  title='Set Location of default folder'
                  description='Set the folder path'
                  value={this.props.defaultFolderPath}
                  onChange={this.props.onDefaultPathChange}
                />
              }
            </ul>
          </div>
        </div>
      </div>
    )
  }
}

export default GlobalSettings

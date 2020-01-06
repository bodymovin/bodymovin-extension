import React from 'react'
import { StyleSheet, css } from 'aphrodite'
// import SettingsCollapsableItem from './collapsable/SettingsCollapsableItem'
import SettingsBanner from './SettingsBanner'
import SettingsStandard from './SettingsExportModeStandard'
import SettingsAVD from './SettingsExportModeAVD'
import SettingsFlare from './SettingsExportModeFlare'
import SettingsDemo from './SettingsExportModeDemo'
import SettingsStandalone from './SettingsExportModeStandalone'
import Variables from '../../helpers/styles/variables'

const styles = StyleSheet.create({
    wrapper: {
      width: '100%',
      padding: '10px',
    },
    wrapperContainer: {
      width: '100%',
      border: '1px solid #555',
      backgroundColor: Variables.colors.gray_darkest,
      padding: '10px',
    },
    title: {
      width: '100%',
      fontSize: '14px',
      paddingBottom: '4px',
    },
    modes: {
      padding: '0 0 0 10px',
    },
    modeItem: {
      paddingTop: '10px',
    },
})

class SettingsExportMode extends React.PureComponent {

	render(){ 
		return (
      <div className={css(styles.wrapper)}>
        <div className={css(styles.wrapperContainer)}>
          <div className={css(styles.title)}>Export Modes</div>
          <div className={css(styles.modes)}>
            <div className={css(styles.modeItem)}>
              <SettingsStandard />
            </div>
            <div className={css(styles.modeItem)}>
              <SettingsDemo />
            </div>
            <div className={css(styles.modeItem)}>
              <SettingsFlare />
            </div>
            <div className={css(styles.modeItem)}>
              <SettingsStandalone />
            </div>
            <div className={css(styles.modeItem)}>
              <SettingsBanner />
            </div>
            <div className={css(styles.modeItem)}>
              <SettingsAVD />
            </div>
          </div>
        </div>
      </div>
    )
	}
}

export default SettingsExportMode
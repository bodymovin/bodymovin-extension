import React from 'react'
import {connect} from 'react-redux'
import { StyleSheet, css } from 'aphrodite'
import {
  handleBannerWidthChange, 
  handleBannerHeightChange, 
  handleBannerVersionChange, 
  handleBannerOriginChange,
  handleBannerLibraryPathChange,
  handleModeToggle,
  lottieBannerRendererUpdated,
  lottieBannerClickTagUpdated,
  lottieBannerZipFilesUpdated,
  lottieBannerCustomSizeFlagUpdated,
} from '../../redux/actions/compositionActions'
import settings_banner_selector from '../../redux/selectors/settings_banner_selector'
import SettingsListItem from './list/SettingsListItem'
import SettingsListInput from './list/SettingsListInput'
import SettingsListDropdown from './list/SettingsListDropdown'
import LottieVersions from '../../helpers/LottieVersions'
import LottieLibraryOrigins from '../../helpers/LottieLibraryOrigins'

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
      padding: '10px 10px',
      backgroundColor: '#111',
    },
})

class SettingsBanner extends React.PureComponent {

  handleLottieOriginChange = (value) => {
    this.props.handleBannerOriginChange(value)
  }
  
  handleLottieVersionChange = (value) => {
    this.props.handleBannerVersionChange(value)
  }

  handleBannerWidthChange = (ev) => {
    this.props.handleBannerWidthChange(ev.target.value)
  }

  handleBannerHeightChange = (ev) => {
    this.props.handleBannerHeightChange(ev.target.value)
  }

  buildLottieOptions = () => {
    return LottieVersions.map(version => ({
      value: version.value,
      text: `${version.name} (${version.fileSize})`,
    }))
  }

  getSelectedLottieVersion() {
    return LottieVersions.find(version => version.value === this.props.lottie_library)
  }

  handleModeToggle = () => {
    this.props.handleModeToggle('banner');
  }

  buildRendererOptions = () => {

    let availableRenderers = ['svg', 'canvas', 'html']
    if (this.props.lottie_origin !== LottieLibraryOrigins.CUSTOM) {
      availableRenderers = this.getSelectedLottieVersion().renderers
    }

    const rendererOptions = [
      {
        value: 'svg',
        text: 'svg'
      },
      {
        value: 'canvas',
        text: 'canvas'
      },
      {
        value: 'html',
        text: 'html'
      }
    ]

    return rendererOptions.filter(renderer => {
      return availableRenderers.includes(renderer.value)
    })
  }

	render(){ 
		return (
      <div className={css(styles.wrapper, this.props._isActive ? styles.wrapperActive: '')}>
        <ul>
          <SettingsListItem
            title='Banner'
            description='Exports a bundle of files for banner usage'
            toggleItem={this.handleModeToggle}
            active={this.props._isActive}
          />
        </ul>
        {this.props._isActive && 
          <ul className={css(styles.compsList)}>
            <SettingsListDropdown 
              title='Lottie Library Origin'
              description='Select where to load the library from'
              onChange={this.handleLottieOriginChange}
              current={this.props.lottie_origin}
              options={[
                {value:LottieLibraryOrigins.LOCAL, text: 'Locally'}, 
                {value:LottieLibraryOrigins.CDNJS, text: 'cdnjs'}, 
                {value:LottieLibraryOrigins.CUSTOM, text: 'Custom'}
              ]}  
            />
            {this.props.lottie_origin === LottieLibraryOrigins.CUSTOM &&
              <SettingsListInput
                title='Set Location of lottie library'
                description='Set the custom path of the lottie library'
                value={this.props.lottie_path}
                onChange={this.props.handleBannerLibraryPathChange}
              />
            }
            {this.props.lottie_origin !== LottieLibraryOrigins.CUSTOM &&
              <SettingsListDropdown 
                title='Lottie Library Version'
                description='Select what version of the library you want to export'
                onChange={this.handleLottieVersionChange}
                current={this.props.lottie_library}
                options={this.buildLottieOptions()}  
              />
            }
            <SettingsListDropdown 
              title='Lottie Renderer'
              description='Select what renderer to use'
              onChange={this.props.lottieBannerRendererUpdated}
              current={this.props.lottie_renderer}
              options={this.buildRendererOptions()}  
            />
            <SettingsListInput
              title='Set Click tag value'
              description='Set the Click tag value'
              value={this.props.click_tag}
              onChange={this.props.handleBannerLibraryClickTagChange}
            />
            <SettingsListItem 
              title='Use composition size'
              description='Uncheck for setting custom banner width and height'
              toggleItem={this.props.handleCustomSizeFlagChange}
              active={this.props.use_original_sizes}  />
            {!this.props.use_original_sizes && 
              <span>
                <SettingsListItem 
                  title='Width'
                  description='Banner Width'
                  active={true} 
                  needsInput={true} 
                  inputValue={this.props.width} 
                  inputValueChange={this.handleBannerWidthChange} 
                />
                <SettingsListItem 
                  title='Height'
                  description='Banner Height'
                  active={true} 
                  needsInput={true} 
                  inputValue={this.props.height} 
                  inputValueChange={this.handleBannerHeightChange} 
                />
              </span>
            }
            <SettingsListItem 
              title='Zip Files'
              description='Select if you want to zip banner files'
              toggleItem={this.props.handleZipFilesChange}
              active={this.props.zip_files}  />
          </ul>
        }
      </div>
    )
	}
}

function mapStateToProps(state) {
  return settings_banner_selector(state)
}

const mapDispatchToProps = {
  handleBannerWidthChange: handleBannerWidthChange,
  handleBannerHeightChange: handleBannerHeightChange,
  handleBannerVersionChange: handleBannerVersionChange,
  handleBannerOriginChange: handleBannerOriginChange,
  handleBannerLibraryPathChange: handleBannerLibraryPathChange,
  handleModeToggle: handleModeToggle,
  lottieBannerRendererUpdated: lottieBannerRendererUpdated,
  handleBannerLibraryClickTagChange: lottieBannerClickTagUpdated,
  handleCustomSizeFlagChange: lottieBannerCustomSizeFlagUpdated,
  handleZipFilesChange: lottieBannerZipFilesUpdated,
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingsBanner)
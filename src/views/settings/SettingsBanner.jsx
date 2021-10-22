import React from 'react'
import {connect} from 'react-redux'
import { StyleSheet, css } from 'aphrodite'
import {
  handleBannerWidthChange, 
  handleBannerHeightChange, 
  handleBannerVersionChange, 
  handleBannerOriginChange,
  handleBannerLibraryPathChange,
  handleBannerLibraryFileChange,
  handleModeToggle,
  lottieBannerRendererUpdated,
  lottieBannerClickTagUpdated,
  lottieBannerZipFilesUpdated,
  lottieBannerCustomSizeFlagUpdated,
  lottieIncludeDataInTemplateUpdated,
  lottieHandleLoopToggleChange,
  lottieHandleLoopCountChange,
} from '../../redux/actions/compositionActions'
import settings_banner_selector from '../../redux/selectors/settings_banner_selector'
import SettingsListItem from './list/SettingsListItem'
import SettingsListFile from './list/SettingsListFile'
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

  handleLoopCountChange = (ev) => {
    this.props.handleLoopCountChange(ev.target.value)
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
                {value:LottieLibraryOrigins.LOCAL, text: 'Default'}, 
                {value:LottieLibraryOrigins.CDNJS, text: 'cdnjs'}, 
                {value:LottieLibraryOrigins.CUSTOM, text: 'Custom URL'}, 
                {value:LottieLibraryOrigins.FILE_SYSTEM, text: 'Local File'}
              ]}  
            />
            {this.props.lottie_origin === LottieLibraryOrigins.FILE_SYSTEM &&
              <SettingsListFile
                title='Set Location of lottie library'
                description='Set the custom path of the lottie library'
                value={this.props.localPath}
                onChange={this.props.handleBannerLibraryFileChange}
              />
            }
            {this.props.lottie_origin === LottieLibraryOrigins.CUSTOM &&
              <SettingsListInput
                title='Set Location of lottie library'
                description='Set the custom path of the lottie library'
                value={this.props.lottie_path}
                onChange={this.props.handleBannerLibraryPathChange}
              />
            }
            {[LottieLibraryOrigins.LOCAL, LottieLibraryOrigins.CDNJS].includes(this.props.lottie_origin) &&
              <SettingsListDropdown 
                title='Lottie Library Version (Uncompressed)'
                description={`Select what version of the library you want to export.
                Compressed as a zip, file size should be significantly smaller.`}
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
            <SettingsListItem 
              title='Inline animation data in template'
              description='Select if you want to json data be part of the template'
              toggleItem={this.props.handleIncludeDataInTemplateChange}
              active={this.props.shouldIncludeAnimationDataInTemplate}  />
            <SettingsListItem 
              title='Loop'
              description='Select if you want the animation to loop indefinitely'
              toggleItem={this.props.handleLoopToggleChange}
              active={this.props.shouldLoop}  />
              { !this.props.shouldLoop &&

                <SettingsListItem 
                  title='Loop Count'
                  description='Select number of loops'
                  active={true} 
                  needsInput={true} 
                  inputValue={this.props.loopCount} 
                  inputValueChange={this.handleLoopCountChange} 
                />

              }
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
  handleBannerLibraryFileChange: handleBannerLibraryFileChange,
  handleModeToggle: handleModeToggle,
  lottieBannerRendererUpdated: lottieBannerRendererUpdated,
  handleBannerLibraryClickTagChange: lottieBannerClickTagUpdated,
  handleCustomSizeFlagChange: lottieBannerCustomSizeFlagUpdated,
  handleZipFilesChange: lottieBannerZipFilesUpdated,
  handleIncludeDataInTemplateChange: lottieIncludeDataInTemplateUpdated,
  handleLoopToggleChange: lottieHandleLoopToggleChange,
  handleLoopCountChange: lottieHandleLoopCountChange,
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingsBanner)
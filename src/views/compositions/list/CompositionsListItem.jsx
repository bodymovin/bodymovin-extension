import React from 'react'
import { StyleSheet, css } from 'aphrodite'
import BodymovinCheckbox from '../../../components/bodymovin/bodymovin_checkbox'
import BodymovinSettings from '../../../components/bodymovin/bodymovin_settings'
import BodymovinDots from '../../../components/bodymovin/bodymovin_dots'
import checkbox from '../../../assets/animations/checkbox.json'
import settings from '../../../assets/animations/settings.json'
import Variables from '../../../helpers/styles/variables'
import textEllipsis from '../../../helpers/styles/textEllipsis'
import report_icon from '../../../assets/svg/report.svg'

const styles = StyleSheet.create({
    composition: {
      width: '100%',
      fontSize: '12px',
      color: '#ffffff',
      backgroundColor: Variables.colors.gray_darkest,
      height: '30px',
      marginBottom: '2px'
    },
    composition__selected: {
      background: Variables.gradients.blueGreen
    },
    item: {
      verticalAlign: 'middle',
      backgroundColor:'transparent'
    },
    itemContainer: {
      padding: '4px 0',
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
    },
    radio: {
      height: '100%',
      width: '70px',
      padding:'2px',
      cursor: 'pointer',
      flex: '0 0 auto',
    },
    settings: {
      height: '100%',
      width: '80px',
      cursor: 'pointer',
      flex: '0 0 auto',
    },
    reports: {
      backgroundColor: 'transparent',
      height: '100%',
      width: '80px',
      cursor: 'pointer',
      flex: '0 0 auto',
      visibility: 'hidden',
    },
    'reposts--active': {
      visibility: 'visible',
    },
    'reports-icon': {
      height: '100%',
      width: '100%',
      padding: '4% 0',
    },
    name: {
      lineHeight: '22px',
      padding: '0 10px',
      flex: '1 1 auto',
    },
    destination: {
      padding: '0 10px',
      color: Variables.colors.green,
      flex: '1 1 auto',
    },
    destinationPlaceholder: {
      padding: '0 0 0 10px',
      width: '40px',
      height: '100%',
      flex: '0 0 auto',
    },
    hidden: {
      display: 'none'
    },
    'destination_placeholder--dot': {
      width: '4px',
      height: '4px',
      borderRadius: '50%',
      backgroundColor: Variables.colors.green,
      marginRight: '2px'
    }
})

class CompositionsListItem extends React.Component {

  constructor() {
    super()
    this.showSettings = this.showSettings.bind(this)
    this.toggleItem = this.toggleItem.bind(this)
    this.selectDestination = this.selectDestination.bind(this)
    this.settingsHovered = this.settingsHovered.bind(this)
    this.settingsLeft = this.settingsLeft.bind(this)
    this.state = {
      settingsHovered: false
    }
  }

	shouldComponentUpdate(nextProps, nextState) {
		return this.props.item !== nextProps.item || this.state !== nextState
	}

  showSettings() {
    this.props.showSettings(this.props.item)
  }

  toggleItem() {
    this.props.toggleItem(this.props.item)
  }

  selectDestination() {
    this.props.selectDestination(this.props.item)
  }

  settingsHovered() {
    this.setState({settingsHovered:true})
  }

  settingsLeft() {
    this.setState({settingsHovered:false})
  }

  goToReports = () => {
    if (this.props.item.reportPath) {
      this.props.goToReports(this.props.item.reportPath);
    }
  }

	render(){
		return (<li 
			className={css(styles.composition, this.props.item.hidden && styles.hidden)}>
        <div className={css(styles.itemContainer, this.props.item.selected && this.props.item.destination && styles.composition__selected)}>
  	        <BodymovinCheckbox animationData={checkbox} animate={this.props.item.selected} autoplay={false} loop={false} >
  	          <button className={css(styles.item, styles.radio)} onClick={this.toggleItem}></button>
  	        </BodymovinCheckbox>
            <BodymovinSettings animationData={settings} animate={this.state.settingsHovered} autoplay={false} loop={false} >
    				  <button 
                className={css(styles.item, styles.settings)} 
                onClick={this.showSettings}
                onMouseEnter={this.settingsHovered}
                onMouseLeave={this.settingsLeft}>
                </button>
            </BodymovinSettings>
            <button
              className={css(styles.reports, this.props.item.reportPath && styles['reposts--active'])}
              onClick={this.goToReports}
            >
              <img
                src={report_icon}
                alt='Report'
                className={css(styles['reports-icon'])}
              />
            </button>
  				<div
            className={css(styles.item, styles.name, textEllipsis)}
            title={this.props.item.name}>
              {this.props.item.name}
          </div>
  				{this.props.item.destination 
            && <div className={css(styles.item, styles.destination, textEllipsis)} onClick={this.selectDestination} title={this.props.item.destination}>{this.props.item.destination}</div>}
          {!this.props.item.destination && <div className={css(styles.item, styles.destinationPlaceholder)}>
            <BodymovinDots onClick={this.selectDestination} />
          </div>}
  			</div>
			</li>)
	}
}

export default CompositionsListItem
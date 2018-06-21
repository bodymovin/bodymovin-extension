import React from 'react'
import { StyleSheet, css } from 'aphrodite'
import BodymovinCheckbox from '../../../components/bodymovin/bodymovin_checkbox'
import BodymovinSettings from '../../../components/bodymovin/bodymovin_settings'
import BodymovinDots from '../../../components/bodymovin/bodymovin_dots'
import checkbox from '../../../assets/animations/checkbox.json'
import settings from '../../../assets/animations/settings.json'
import Variables from '../../../helpers/styles/variables'
import textEllipsis from '../../../helpers/styles/textEllipsis'

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
      display: 'inline-block',
      verticalAlign: 'middle',
      backgroundColor:'transparent'
    },
    itemContainer: {
      padding: '4px 0',
      width: '100%',
      height: '100%'
    },
    radio: {
      height: '100%',
      width: '70px',
      padding:'2px',
      cursor: 'pointer'
    },
    settings: {
      height: '100%',
      width: '80px',
      cursor: 'pointer'
    },
    name: {
      width: 'calc( 60% - 75px)',
      lineHeight: '22px',
      padding: '0 10px'
    },
    destination: {
      width: 'calc( 40% - 75px)',
      padding: '0 10px',
      color: Variables.colors.green
    },
    destinationPlaceholder: {
      width: 'calc( 40% - 75px)',
      padding: '0 0 0 10px',
      height: '100%'
    },
    hidden: {
      display: 'none'
    },
    'destination_placeholder--dot': {
      width: '4px',
      height: '4px',
      borderRadius: '50%',
      backgroundColor: Variables.colors.green,
      display: 'inline-block',
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
  				<div className={css(styles.item, styles.name, textEllipsis)} title={this.props.item.name}>{this.props.item.name}</div>
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
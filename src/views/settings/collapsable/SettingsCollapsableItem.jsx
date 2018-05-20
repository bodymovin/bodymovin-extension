import React from 'react'
import { StyleSheet, css } from 'aphrodite'
import BodymovinToggle from '../../../components/bodymovin/bodymovin_toggle'
import expander from '../../../assets/animations/expander.json'
import Variables from '../../../helpers/styles/variables'
import textEllipsis from '../../../helpers/styles/textEllipsis'

const styles = StyleSheet.create({
    wrapper: {
      width: '100%',
      height: 'auto',
      backgroundColor: Variables.colors.gray_darkest,
    },
    composition: {
      width: '100%',
      fontSize: '12px',
      color: Variables.colors.white,
      height: '40px',
      padding: '4px 0',
      display: 'flex',
      alignItems: 'center',
      cursor: 'pointer'
    },
    composition__active: {
      background: Variables.gradients.blueGreen
    },
    item: {
      flexGrow: 0,
      flexShrink: 0,
      backgroundColor:'transparent'
    },
    radio: {
      width: '60px',
      height: '20px',
      padding:'2px',
      display:'inline-block'
    },
    title: {
      width: '60px',
      padding:'2px',
      display:'inline-block'
    },
    name: {
      flexGrow: 1,
      flexShrink: 1,
      padding: '0 4px'
    },
    'name--title': {
      color: '#fff',
      fontSize: '14px',
      marginRight: '10px'
    },
    'name--desc': {
      color: '#ccc',
      fontSize: '12px'
    },
    disabled: {
      opacity: .3
    },
    children_container: {
      padding: '0 0 0 25px'
    }
})

class SettingsCollapsableItem extends React.PureComponent {

  constructor(props) {
    super(props)
    this.state = {
      toggle: 'off'
    }
  }

  renderItems() {

  }

  toggleOptions = () => {
    this.setState({
      toggle: this.state.toggle === 'on' ? 'off' : 'on'
    })
  }

	render(){ 
		return (<li 
			className={css(styles.wrapper)}>
        <div onClick={this.toggleOptions} className={css(styles.composition)}>
          <BodymovinToggle animationData={expander} toggle={this.state.toggle}>
              <button className={css(styles.item, styles.radio)} onClick={this.props.toggleItem}></button>
          </BodymovinToggle>
          <div className={css(styles.item, styles.name, textEllipsis)}>
            <span className={css(styles['name--title'])}>{this.props.title}</span>
            <span title={this.props.description} className={css(styles['name--desc'])}>{this.props.description}</span>
          </div>
        </div>
        {this.state.toggle === 'on' && <ul className={css(styles.children_container)}>
          {this.props.children}
        </ul>}
			</li>)
	}
}

export default SettingsCollapsableItem
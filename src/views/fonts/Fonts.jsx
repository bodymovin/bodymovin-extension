import React from 'react'
import {connect} from 'react-redux'
import { StyleSheet, css } from 'aphrodite'
import fonts_view_selector from '../../redux/selectors/fonts_view_selector'
import BaseButton from '../../components/buttons/Base_button'
import FontForm from './form/FontForm'
import {updateFontOrigin, updateInput, setFonts, stopRender} from '../../redux/actions/renderActions'
import Bodymovin from '../../components/bodymovin/bodymovin'
import fontsAnim from '../../assets/animations/fonts.json'
import Variables from '../../helpers/styles/variables'

const styles = StyleSheet.create({
    wrapper: {
      width: '100%',
      height: '100%',
      padding: '10px',
      backgroundColor: '#474747'
    },
    container: {
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection:'column'
    },
    header: {
      width: '100%',
      height: '60px',
      fontFamily: 'Roboto-Bold',
      fontSize: '12px',
      marginBottom: '20px',
      flexGrow: 0,
      flexShrink: 0,
      borderBottom: '1px solid ' + Variables.colors.gray2
    },
    headerTitle:{
      display: 'inline-block',
      verticalAlign: 'middle',
      color: Variables.colors.white
    },
    header_animation_container: {
      height: '100%',
      width: '50px',
      display: 'inline-block',
      verticalAlign: 'middle'
    },
    list: {
      width: '100%',
      flexGrow: 1,
      flexShrink: 1,
      position: 'relative',
      backgroundColor: Variables.colors.gray_darkest,
      padding: '4px',
      overflowY: 'hidden',
      overflowX: 'hidden',
      marginBottom: '20px'
    },
    list_items: {
      position: 'absolute',
      top: '0',
      left: '0',
      overflowY: 'auto',
      width: '100%',
      height:'100%'
    },
    buttons: {
      width: '100%',
      flexGrow: 0,
      flexShrink: 0,
      textAlign: 'center'
    },
    button_separator: {
      width: '10px',
      display: 'inline-block'
    }
})

class Fonts extends React.Component {

  constructor(){
    super()
    this.cancelRender = this.cancelRender.bind(this)
    this.setFonts = this.setFonts.bind(this)
  }

  cancelRender() {
    this.props.stopRender()
    //browserHistory.push('/')
  }

  getFontsList() {
    return this.props.fonts.map((item) => {
      return <FontForm 
                key={item.fName}
                data={item} 
                updateInput={this.props.updateInput} 
                changeOrigin={this.props.updateFontOrigin} />
    })
  }

  setFonts() {
    this.props.setFonts()
    //browserHistory.push('/render')
  }

  render() {
    return (
      <div className={css(styles.wrapper)}>
        <div className={css(styles.container)}>
          <div className={css(styles.header)}>
            <Bodymovin animationData={fontsAnim} loop={true}>
              <div className={css(styles.header_animation_container)} />
            </Bodymovin>
            <div className={css(styles.headerTitle)}>Select font families and font paths when necessary</div>
          </div>
          <div className={css(styles.list)}>
            <div className={css(styles.list_items)}>
              {this.getFontsList()}
            </div>
          </div>
          <div className={css(styles.buttons)}>
            <BaseButton text='Cancel' type='green' onClick={this.cancelRender}></BaseButton>
            <div className={css(styles.button_separator)}></div>
            <BaseButton text='Save' type='green' onClick={this.setFonts}></BaseButton>
          </div>
        </div>
      </div>
      );
  }
}

function mapStateToProps(state) {
  return fonts_view_selector(state)
}

const mapDispatchToProps = {
  updateFontOrigin: updateFontOrigin,
  updateInput: updateInput,
  setFonts: setFonts,
  stopRender: stopRender
}

export default connect(mapStateToProps, mapDispatchToProps)(Fonts)

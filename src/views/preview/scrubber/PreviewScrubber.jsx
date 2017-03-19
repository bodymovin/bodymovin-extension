import React from 'react'
import { StyleSheet, css } from 'aphrodite'
import Range from '../../../components/range/Range'
import BaseButton from '../../../components/buttons/Base_button'
import Variables from '../../../helpers/styles/variables'
import snapshot from '../../../assets/animations/snapshot.json'

const styles = StyleSheet.create({
    container: {
      width: '100%',
      height: '80px'
    },
    navContainer: {
      width: '100%',
      height: '36px',
      display: 'flex'
    },
    progressNumberContainer: {
      fontSize: '20px',
      lineHeight: '28px',
      color: Variables.colors.blue,
      flexGrow: 0,
      cursor: 'pointer'
    },
    progressNumber: {
      fontSize: '20px',
      lineHeight: '28px',
      color: Variables.colors.blue,
      display: 'inline-block'
    },
    inputNumber: {
      backgroundColor: Variables.colors.gray,
      border: '2px solid ' + Variables.colors.gray2,
      width: 'auto',
      ':focus' :{
        outline: 'none'
      }
    },
    emptySpace: {
      flexGrow: 1,
      backgroundColor: 'transparent'
    },
    button: {
      flexGrow: 0
    }
})

class PreviewScrubber extends React.Component {

  constructor() {
    super()
    this.state = {
      numberFocused: false,
      inputValue:0
    }
    this.focusNumber = this.focusNumber.bind(this)
    this.updateValue = this.updateValue.bind(this)
    this.setInitialValue = this.setInitialValue.bind(this)
    this.handleBlur = this.handleBlur.bind(this)
    this.handleKey = this.handleKey.bind(this)
  }

  focusNumber(){
    if(this.props.totalFrames === 0){
      //return
    }
    this.setState({
      numberFocused: true
    })
  }

  updateValue(ev) {
    if(ev.target.value === ''){
      this.setState({
        inputValue: ''
      })
      return
    }
    let newValue = parseInt(ev.target.value, 10)
    if(isNaN(newValue) || newValue < 0 || newValue > this.props.totalFrames){
      return
    }
    this.setState({
      inputValue: newValue
    })
    this.props.updateProgress(newValue/this.props.totalFrames)
  }

  setInitialValue() {
    this.setState({
      inputValue: Math.round(this.props.totalFrames * this.props.progress)
    })
  }

  handleBlur() {
    this.setState({
      numberFocused: false
    })
  }

  handleKey(ev){
    if(ev.keyCode === 40 && this.state.inputValue > 0){
      let newValue = this.state.inputValue - 1
      this.setState({
        inputValue: newValue
      })
      this.props.updateProgress(newValue/this.props.totalFrames)
      ev.preventDefault()
    }else if(ev.keyCode === 38 && this.state.inputValue < this.props.totalFrames){
      let newValue = this.state.inputValue + 1
      this.setState({
        inputValue: newValue
      })
      this.props.updateProgress(newValue/this.props.totalFrames)
      ev.preventDefault()
    }
  }

  render() {

    let inputLength = this.props.totalFrames.toString().length

    return (
      <div className={css(styles.container)}>
        <Range updateProgress={this.props.updateProgress} canScrub={this.props.totalFrames !== 0} progress={this.props.progress}/>
        <div className={css(styles.navContainer)}>
          <div onClick={this.focusNumber} className={css(styles.progressNumberContainer)}>
            {!this.state.numberFocused 
              && <div className={css(styles.progressNumber)}>{Math.round(this.props.totalFrames * this.props.progress)}</div>}
            {this.state.numberFocused 
              && <input 
                    autoFocus={true}
                    type="text" 
                    className={css(styles.progressNumber, styles.inputNumber)} 
                    size={inputLength} 
                    value={this.state.inputValue}
                    onFocus={this.setInitialValue} 
                    onBlur={this.handleBlur} 
                    onKeyDown={this.handleKey} 
                    onChange={this.updateValue}/>}
            <div className={css(styles.progressNumber)}>&nbsp;/ {this.props.totalFrames}</div>
          </div>
          <div className={css(styles.emptySpace)}></div>
          <BaseButton text='Take Snapshot' type='gray' classes={styles.button} onClick={this.props.saveFile} icon={snapshot}/>
        </div>
      </div>
      );
  }
}

PreviewScrubber.defaultProps = {
  totalFrames: 0,
  progress: 0,
  max: 1
}

export default PreviewScrubber

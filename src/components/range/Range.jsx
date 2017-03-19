import React from 'react'
import { StyleSheet, css } from 'aphrodite'
import Thumb from '../../assets/svg/preview_thumb.svg'
import Variables from '../../helpers/styles/variables'

const styles = StyleSheet.create({
    container: {
      width: '100%',
      height: '30px',
      backgroundColor:'transparent',
      position: 'relative',
      top: 0,
      left: 0,
      cursor: 'pointer'
    },
    progress: {
      width: '100%',
      height: '10px',
      position: 'absolute',
      margin: 'auto',
      top:0,
      bottom:0,
      backgroundColor: Variables.colors.gray_darkest,
      borderRadius: '5px',
      overflow:'hidden'
    },
    progress_color: {
      width: '100%',
      height: '100%',
      background: Variables.gradients.blueGreenFull
    },
    thumb: {
      width: '20px',
      height: '20px',
      position: 'absolute',
      margin: 'auto',
      top:0,
      bottom:0,
      pointerEvents: 'none'
    },
    thumbDisplay: {
      width: '100%',
      height: '100%',
      transform: 'translateX(-50%)'
    }
})

class Range extends React.Component {

	constructor(){
		super()
		this.state = {
			isDown:false,
			width: 0,
			mix: 0
		}
		this.mouseUpHandler = this.mouseUpHandler.bind(this)
		this.mouseMoveHandler = this.mouseMoveHandler.bind(this)
		this.mouseDownHandler = this.mouseDownHandler.bind(this)
		this.resizeHandler = this.resizeHandler.bind(this)
	}

	componentWillUpdate(nextProps, nextState) {
		if(nextState.isDown === true && this.state.isDown === false) {
			document.addEventListener('mouseup', this.mouseUpHandler)
			document.addEventListener('mousemove', this.mouseMoveHandler)
		}
	}

	mouseMoveHandler(ev) {
		if(!this.state.isDown){
			return
		}
		this.props.updateProgress(Math.min(Math.max(0,(ev.clientX - this.state.min) / (this.state.width)),1))
	}

	mouseUpHandler(ev) {
		document.removeEventListener('mouseup', this.mouseUpHandler)
		document.removeEventListener('mousemove', this.mouseMoveHandler)
		this.setState({
			isDown: false
		})
	}

	mouseDownHandler(ev) {
		if(!this.props.canScrub){
			return
		}
		var rect = this.container.getBoundingClientRect()
		this.setState({
			isDown: true,
			width: rect.right - rect.left,
			min: rect.left
		})
		this.props.updateProgress((ev.clientX - rect.left) / (rect.right - rect.left))
	}

	resizeHandler() {
		var rect = this.container.getBoundingClientRect()
		this.setState({
			width: rect.right - rect.left,
			min: rect.left,
		})
	}

	componentDidMount() {
		window.addEventListener('resize', this.resizeHandler)
		this.resizeHandler()
	}

	componentWillUnmount() {
		window.removeEventListener('resize', this.resizeHandler)
		document.removeEventListener('mouseup', this.mouseUpHandler)
		document.removeEventListener('mousemove', this.mouseMoveHandler)
	}

	render() {
		let pos = this.state.width * this.props.progress
		let styler = {
			'transform':'translateX(' + pos + 'px)',
			'WebkitTransform':'translateX(' + pos + 'px)'
		}

		let progressStyler = {
			'transform':'translateX(' + -(1-this.props.progress)*100 + '%)',
			'WebkitTransform':'translateX(' + -(1-this.props.progress)*100 + '%)'
		}

		return (<div 
					ref={(elem)=>this.container = elem} 
					className={css(styles.container)} 
					onMouseDown={this.mouseDownHandler} >
					<div className={css(styles.progress)}>
						<div className={css(styles.progress_color)} style={progressStyler}>
						
						</div>
					</div>
					<div className={css(styles.thumb)} style={styler}>
						<div className={css(styles.thumbDisplay)} style={styler}>
							<img src={Thumb} alt="Thumb"/>
						</div>
					</div>
				</div>)
	}
}

export default Range
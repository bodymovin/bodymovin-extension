import React from 'react'
import { StyleSheet, css } from 'aphrodite'
import Bodymovin from './bodymovin'
import dots from '../../assets/animations/dots.json'

const styles = StyleSheet.create({
    container: {
    	width: '100%',
    	height: '100%',
    	cursor: 'pointer',
    	background: 'none',
    	padding: 0
    }
})

class BodymovinSettings extends React.Component {

	constructor() {
		super()
		this.mouseEnterHandler = this.mouseEnterHandler.bind(this)
		this.mouseLeaveHandler = this.mouseLeaveHandler.bind(this)
	}

	mouseEnterHandler() {
		this.bm_instance.resetSegments(true)
		this.bm_instance.playSegments([0,48], true)
	}

	mouseLeaveHandler() {
		let currentFrame = this.bm_instance.getCurrentFrame()
		this.bm_instance.resetSegments(true)
		this.bm_instance.playSegments([currentFrame,62], true)
	}

	render() {
		return (<Bodymovin ref={(elem)=>this.bm_instance = elem} animationData={dots} rendererSettings={{preserveAspectRatio:'xMinYMid meet'}} autoplay={false}>
			<button onClick={this.props.onClick} className={css(styles.container)} onMouseEnter={this.mouseEnterHandler} onMouseLeave={this.mouseLeaveHandler} />
		</Bodymovin>)
	}
}

export default BodymovinSettings
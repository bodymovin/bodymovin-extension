import React from 'react'
import Bodymovin from './bodymovin'
import refresh from '../../assets/animations/refresh.json'
import { StyleSheet, css } from 'aphrodite'

const styles = StyleSheet.create({
    wrapper: {
      width: '100%',
      height: '100%',
      background:'none',
      cursor: 'pointer'
    }
})

class BodymovinCheckbox extends React.Component {

	constructor() {
		super()
		this.handleMouseEnter = this.handleMouseEnter.bind(this)
		this.handleMouseLeave = this.handleMouseLeave.bind(this)
	}

	handleMouseEnter(){
		this.bm_instance.resetSegments(true)
		this.bm_instance.playSegments([[0,29],[29,58]], true)
		this.bm_instance.loop(true)
	}

	handleMouseLeave(){
		let currentFrame = this.bm_instance.getCurrentFrame()
		let firstFrame = this.bm_instance.getFirstFrame()
		this.bm_instance.resetSegments(true)
		this.bm_instance.playSegments([[currentFrame + firstFrame,0]], true)
		this.bm_instance.loop(false)
		
	}

	render() {
		return (<Bodymovin ref={(elem)=>this.bm_instance = elem} animationLoaded={this.checkAnimation} animationData={refresh} autoplay={false} loop={true}>
			<button onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave} className={css(styles.wrapper)}></button>
		</Bodymovin>)
	}
}

export default BodymovinCheckbox
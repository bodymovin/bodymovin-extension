import React from 'react'
import { StyleSheet, css } from 'aphrodite'
import Bodymovin from './bodymovin'
import cube from '../../assets/animations/cube.json'
import flame from '../../assets/animations/Flame.json'
import bear from '../../assets/animations/bear.json'
import ghost from '../../assets/animations/ghost.json'
import nessie from '../../assets/animations/nessie.json'

const styles = StyleSheet.create({
    buttonContainer: {
    	width: '100%',
    	height: '100%',
    	position: 'relative',
    	cursor: 'pointer',
    	background: 'none'
    },
    buttonAnim: {
    	width: '100%',
    	height: '100%',
    	position: 'absolute',
    	top: 0,
    	left: 0
    }
})

let anims = [flame, bear, ghost, nessie]

class BodymovinFolder extends React.Component {

	constructor() {
		super()
		this.mouseEnterHandler = this.mouseEnterHandler.bind(this)
		this.mouseLeaveHandler = this.mouseLeaveHandler.bind(this)
		this.animateTopAnim = this.animateTopAnim.bind(this)
		this.state = {
			hovered: false,
			topAnim: null
		}
		this.currentTimeout = -1
	}

	animateTopAnim() {
		if(this.state.hovered) {
			this.top_anim.goToAndPlay(0)
		}
	}

	mouseEnterHandler(){
		let rand = Math.floor(Math.random()*anims.length)
		let anim = anims[rand]
		this.setState({
			hovered: true,
			topAnim: anim
		})
		this.cube_anim.goToAndPlay(0)
		this.currentTimeout = setTimeout(this.animateTopAnim, 750)
	}

	mouseLeaveHandler(){
		this.setState({
			hovered: false,
			topAnim: null
		})
		clearTimeout(this.currentTimeout)
		this.cube_anim.goToAndStop(0)
	}

	render() {
		return (<button onMouseEnter={this.mouseEnterHandler} onMouseLeave={this.mouseLeaveHandler} className={css(styles.buttonContainer)}>
			<Bodymovin ref={(elem)=>this.cube_anim = elem} animationData={cube} loop={false} autoplay={false}>
				<div className={css(styles.buttonAnim)}/>
			</Bodymovin>
			{this.state.hovered && <Bodymovin  ref={(elem)=>this.top_anim = elem} animationData={this.state.topAnim} loop={true} autoplay={false}>
				<div className={css(styles.buttonAnim)}/>
			</Bodymovin>}
		</button>)
	}
}

export default BodymovinFolder
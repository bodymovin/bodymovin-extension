import React from 'react'
import Bodymovin from './bodymovin'
class BodymovinToggle extends React.PureComponent {

	constructor() {
		super()
		this.checkAnimation = this.checkAnimation.bind(this)
	}

	componentWillReceiveProps(props) {
		if (props.toggle !== this.props.toggle) {
			if(props.toggle === 'on') {
				this.bm_instance.setDirection(1)
			} else {
				this.bm_instance.setDirection(-1)
			}
			this.bm_instance.play()
		}
	}

	checkAnimation() {
		if(this.props.toggle === 'on') {
			this.bm_instance.goToAndPlay(0)
		} else {
			this.bm_instance.goToAndStop(0)
		}
	}

	render() {
		return (<Bodymovin ref={(elem)=>this.bm_instance = elem} animationLoaded={this.checkAnimation} animationData={this.props.animationData}>
			{this.props.children}
		</Bodymovin>)
	}
}

export default BodymovinToggle
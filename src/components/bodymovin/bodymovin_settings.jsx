import React from 'react'
import Bodymovin from './bodymovin'
class BodymovinSettings extends React.Component {

	constructor() {
		super()
		this.checkAnimation = this.checkAnimation.bind(this)
	}

	componentWillReceiveProps(props) {
		if (props.animate && !this.props.animate) {
			this.bm_instance.goToAndPlay(0)
		} else if (!props.animate && this.props.animate) {
			this.bm_instance.goToAndStop(0)
		}
	}

	checkAnimation() {
		if(this.props.animate) {
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

export default BodymovinSettings
import React from 'react'
import bodymovin from '../../bodymovin'

class Bodymovin extends React.Component {

	constructor() {
		super()
		this.animationLoaded = this.animationLoaded.bind(this)
		this.setElement = this.setElement.bind(this)
		this.element = null
	}

	animationLoaded() {
		if(this.props.animationLoaded) {
			this.props.animationLoaded()
		}
	}

	componentWillReceiveProps(props) {
		if(props.animationData !== this.props.animationData || props.path !== this.props.path) {
			if(this.animation) {
				this.animation.destroy()
				this.animation = null
			}
		}
	}

	componentDidUpdate() {
		this.attachAnimation()
	}

	setElement(elem) {
		this.element = elem
		this.attachAnimation()
	}

	attachAnimation() {
		if(!this.animation && this.element && (this.props.animationData || this.props.path)){
			try{
				let params = {
					container: this.element,
					renderer: this.props.renderer || 'svg',
					autoplay: this.props.autoplay,
					loop: this.props.loop,
					rendererSettings: {
			            progressiveLoad:true,
			            preserveAspectRatio: 'xMidYMid meet'
			        }
				}
				if(this.props.animationData) {
					params.animationData = this.props.animationData
				} else if(this.props.path) {
					params.path = this.props.path
				}
				if(this.props.rendererSettings){
					params.rendererSettings = {...params.rendererSettings,...this.props.rendererSettings}
				}
				this.animation = bodymovin.loadAnimation(params)
				this.animation.addEventListener('DOMLoaded', this.animationLoaded)
			} catch(err){
				this.element.innerHTML = ''
			}
		}
	}

	goToAndPlay(num, isFrame) {
		if(this.animation){
			this.animation.goToAndPlay(num, isFrame)
		}
	}

	goToAndStop(num, isFrame) {
		if(this.animation){
			this.animation.goToAndStop(num, isFrame)
		}
	}

	playSegments(segments, forceFlag) {
		if(this.animation){
			this.animation.playSegments(segments, forceFlag)
		}
	}

	setSegment(init, end) {
		if(this.animation){
			this.animation.setSegment(init, end)
		}
	}

	resetSegments(flag) {
		if(this.animation){
			this.animation.resetSegments(flag)
		}
	}

	play() {
		if(this.animation){
			this.animation.play()
		}
	}

	stop() {
		if(this.animation){
			this.animation.stop()
		}
	}

	loop(value) {
		if(this.animation){
			this.animation.loop = value
		}
	}

	getCurrentFrame() {
		if(this.animation){
			return this.animation.currentRawFrame
		}
		return 0
	}

	getFirstFrame() {
		if(this.animation){
			return this.animation.firstFrame
		}
		return 0
	}

	render() {
		var cloned = React.cloneElement(
		  this.props.children,
		  {
		  	ref: this.setElement
		  }
		)
		return cloned
	}

	componentWillUnmount() {
		if(this.animation) {
			try {
				this.animation.destroy()
			} catch(err) {
				console.log('destroy error')
			}
			this.animation = null
		}
		if(this.element) {
			this.element = null
		}
	}
}

Bodymovin.defaultProps = {
	autoplay: true,
	loop: false
}

export default Bodymovin
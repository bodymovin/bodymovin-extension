import React from 'react'
import { StyleSheet, css } from 'aphrodite'
import Bodymovin from '../../../components/bodymovin/bodymovin'

const styles = StyleSheet.create({
    container: {
      width: '100%',
      height: '100%',
      borderRadius:'2px',
      position: 'absolute',
      backgroundColor:'#333'
    }
})

class PreviewViewer extends React.Component {

  constructor() {
    super()

    this.animationLoaded = this.animationLoaded.bind(this)
  }

  componentWillReceiveProps(props) {
    if(props.progress !== this.props.progress && this.bm_instance.animation) {
      try{
        this.bm_instance.goToAndStop(parseInt(this.bm_instance.animation.totalFrames * props.progress, 10), true)
      } catch(err) {
        console.log('errr: ', err)
      }
    }
    if(this.props.animationData !== props.animationData){
      this.selectRenderer()
    }
  }

  animationLoaded() {
    this.props.setTotalFrames(this.bm_instance.animation.totalFrames)
  }

  snapshot() {
    return this.bm_instance.element.innerHTML
  }

  selectRenderer() {

  }

  render() {
    return (
      <Bodymovin ref={(elem)=>this.bm_instance = elem} renderer={this.props.renderer} path={this.props.path} autoplay={false} animationLoaded={this.animationLoaded} >
        <div className={css(styles.container)}/>
      </Bodymovin>
      );
  }
}

export default PreviewViewer

import React from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, css } from 'aphrodite'
import Bodymovin from '../../../components/bodymovin/bodymovin'
import SkottiePreviewer from './SkottiePreviewer'
import Variables from '../../../helpers/styles/variables'

const styles = StyleSheet.create({
    wrapper: {
      width: '100%',
      height: '100%',
      borderRadius:'2px',
      position: 'absolute',
      backgroundColor: Variables.colors.gray,
      display: 'flex',
    },
    rendererWrapper: {
      flex: '1 1 0',
      position: 'relative',
      border: `1px solid ${Variables.colors.button_gray_text}`,
    },
    container: {
      width: '100%',
      height: '100%',
      borderRadius:'2px',
      position: 'absolute',
      backgroundColor: Variables.colors.gray,
    }
})

const previewTypes = {
  BROWSER: 'browser',
  SKOTTIE: 'skottie',
}

const memoizeAnimation = (() => {
  
  const renderers = {

  }
  return (animationData, renderer) => {
    if (!renderers[renderer] || renderers[renderer].origin !== animationData) {
      renderers[renderer] = {
        origin: animationData,
        clone: JSON.parse(JSON.stringify(animationData)),
      } 
    }
    return renderers[renderer].clone
  }
})()

class PreviewViewer extends React.PureComponent {

  renderBrowser = () =>
    <div
      className={css(styles.rendererWrapper)}
      key={previewTypes.BROWSER}
    >
      <Bodymovin 
        ref={(elem)=>this.bm_instance = elem}
        renderer={this.props.renderer}
        /*{path={this.props.path}}*/
        animationData={memoizeAnimation(this.props.animationData, previewTypes.BROWSER)}
        autoplay={false}
        animationLoaded={this.animationLoaded}
      >
        <div className={css(styles.container)}/>
      </Bodymovin>
    </div>

  renderSkottie = () =>
    <div
      key={previewTypes.SKOTTIE}
      className={css(styles.rendererWrapper)}
     >
      <SkottiePreviewer
        animationData={memoizeAnimation(this.props.animationData, previewTypes.SKOTTIE)}
        assetsData={this.props.assetsData}
        progress={this.props.progress}
      />
    </div>

  previewRenderers = {
    [previewTypes.BROWSER]: this.renderBrowser,
    [previewTypes.SKOTTIE]: this.renderSkottie,
  }

  componentDidUpdate(prevProps) {
    if (prevProps.progress !== this.props.progress) {
      this.updateFrame()
    }
  }

  updateFrame() {
    const props = this.props
    if(this.bm_instance && this.bm_instance.animation) {
      try{
        this.bm_instance.goToAndStop(parseInt(this.bm_instance.animation.totalFrames * props.progress, 10), true)
      } catch(err) {
        console.log('errr: ', err)
      }
    }
  }

  animationLoaded = () => {
    this.props.setTotalFrames(this.bm_instance.animation.totalFrames)
    this.updateFrame()
  }

  snapshot() {
    return this.bm_instance.element.innerHTML
  }

  renderPreviewers(types) {
      // return [previewTypes.BROWSER, previewTypes.SKOTTIE].map(type => this.previewRenderers[type]())
      return this.props.previewerTypes.map(type => this.previewRenderers[type]())
  }

  render() {
    return (
      <div className={css(styles.wrapper)}>      
        {this.renderPreviewers(this.props.previewerTypes)}
      </div>      
      )
  }
}

PreviewViewer.propTypes = {
  previewerTypes: PropTypes.array,
}

PreviewViewer.defaultProps = {
  previewerTypes: [],
}

export default PreviewViewer

export {previewTypes}
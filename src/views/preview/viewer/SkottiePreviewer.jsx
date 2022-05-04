import React from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, css } from 'aphrodite'
import getCanvasKit from '../../../helpers/SkottieLoader'

const styles = StyleSheet.create({
    container: {
      width: '100%',
      height: '100%',
      borderRadius:'2px',
      position: 'absolute',
    },
    canvas: {
      width: '100%',
      height: '100%',
      'object-fit': 'contain',
    }
})

class SkottiePreviewer extends React.PureComponent {

  constructor(props) {
    super(props)
    this.skottieInstance = null
    this.skottieContext = null
  }

  setCanvasElement = elem => {
    this.canvasElement = elem
  }

  componentDidMount() {
    this.loadAnimation()
  }

  componentDidUpdate(prevProps) {
    if (prevProps.animationData !== this.props.animationData) {
      this.loadAnimation()
    } else if(prevProps.progress !== this.props.progress) {
      this.updateFrame()
    }
  }

  async updateFrame() {
    const CanvasKit = this.CanvasKit
    const totalFrames = this.props.animationData.op - this.props.animationData.ip;
    const frame = parseInt(totalFrames * this.props.progress, 10)
    this.skottieInstance.seekFrame(frame);
    var bounds = CanvasKit.LTRBRect(0, 0, this.props.animationData.w * window.devicePixelRatio,
      this.props.animationData.h * window.devicePixelRatio);
    this.skottieInstance.render(this.skottieCanvas, bounds);
    this.skottieSurface.flush();
  }

  destroyCurrentAnimation() {
    if (this.skottieInstance) {
      this.skottieInstance.delete();
      this.skottieInstance = null;
    }
  }

  componentWillUnmount() {
    this.destroyCurrentAnimation();
  }

  async loadAnimation() {
      if (this.props.animationData) {
        this.destroyCurrentAnimation();
        const CanvasKit = await getCanvasKit();
        const container = this.canvasElement;
        const data = this.props.animationData;
        this.skottieSurface = CanvasKit.MakeCanvasSurface(container);
        this.skottieCanvas = this.skottieSurface.getCanvas();
        this.skottieInstance = CanvasKit.MakeManagedAnimation(JSON.stringify(data), this.props.assetsData);
        // this.skottieContext = CanvasKit.currentContext();
        this.CanvasKit = CanvasKit;
        this.updateFrame();
      }
  }

  render() {

    const width = this.props.animationData 
      ? this.props.animationData.w * window.devicePixelRatio
      : 1

    const height = this.props.animationData 
      ? this.props.animationData.h * window.devicePixelRatio
      : 1

    return (
      <div className={css(styles.container)}>
        <canvas
          className={css(styles.canvas)}
          ref={this.setCanvasElement}
          width={width}
          height={height}
        />
      </div>
      );
  }
}

SkottiePreviewer.propTypes = {
  animationData: PropTypes.object,
  assetsData: PropTypes.object,
  progress: PropTypes.number.isRequired,
}

SkottiePreviewer.defaultProps = {
  animationData: null,
  assetsData: null,
}

export default SkottiePreviewer
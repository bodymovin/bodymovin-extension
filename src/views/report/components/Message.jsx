import React from 'react'
import { StyleSheet, css } from 'aphrodite'
import Variables from '../../../helpers/styles/variables'
import errorIcon from '../../../assets/svg/error.svg'
import warningIcon from '../../../assets/svg/warning.svg'

const styles = StyleSheet.create({
    wrapper: {
      width: '100%',
      backgroundColor: Variables.colors.gray_lightest,
      color: Variables.colors.gray_more_darkest,
      fontSize: '14px',
      marginTop: '10px',
      overflow: 'hidden',
      padding: '6px',
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      borderBottom: `1px solid ${Variables.colors.gray_more_darkest}`,
      paddingBottom: '4px',
    },
    icon: {
      width: '12px',
      height: '12px',
      marginRight: '4px',
    },
    renderers: {
      display: 'flex',
    },
    renderer: {
      paddingRight: '4px',
    },
    content: {
      paddingTop: '10px',
    }
})

class Message extends React.Component {

  icons = {
    error: errorIcon,
    warning: warningIcon,
  }
  labels = {
    error: 'Error',
    warning: 'Warning',
  }
  renderers = {
    android: 'Android',
    ios: 'iOS',
    browser: 'Browser',
    skottie: 'Skottie',
  }

  buildIcon = type => (
    <img
      className={css(styles.icon)}
      src={this.icons[type]}
      alt={this.labels[type]}
    />
  )

  buildRenderers = renderers => (
    <div className={css(styles.renderers)}>
      {renderers.map((renderer, index) => 
        (<div key={renderer} className={css(styles.renderer)}>
          {index > 0 && <span> | </span>}
          {this.renderers[renderer]}
        </div>)
      )}
    </div>
  )

  buildHeader = () => (
    <div className={css(styles.header)}>
      {this.buildIcon(this.props.message.type)}
      {this.buildRenderers(this.props.message.renderers)}
    </div>
  )

  buildExpressionMessage = () => (
    <div>Expressions are not supported</div>
  )

  buildWiggleMessage = () => (
    <div>wiggle expressions is not supported</div>
  )

  buildSepareteDimensionsMessage = () => (
    <div>Separate dimensions are not supported</div>
  )

  buildOrientAlongPathMessage = () => (
    <div>Orient along path is not supported</div>
  )

  buildUnhandleLayer = () => (
    <div>This layer doesn't have reports yet</div>
  )

  buildThreeDLayer = () => (
    <div>3D layers have partial or no support</div>
  )

  buildMotionBlur = () => (
    <div>Motion blur is not supported</div>
  )

  buildDisabledLayer = () => (
    <div>Hidden and Guided layers are not supported in this renderers</div>
  )

  buildUnhandledShape = () => (
    <div>This shape property is not supported</div>
  )

  buildEffects = (payload) => {
    const effects = payload.effects;
    return (
      <div>These effects are not supported:
        <div>
          {effects.map(effect => (
            <div key={effect}>{effect}</div>
          ))}
        </div>
      </div>
    )
  }

  buildAnimatorProperties = (payload) => {
    const properties = payload.properties;
    return (
      <div>These text animator properties are not supported:
        <div>
          {properties.map(animator => (
            <div key={animator}>{animator}</div>
          ))}
        </div>
      </div>
    )
  }

  buildMergePaths = () => (
    <div>Merge paths are not supported</div>
  )

  buildTextAnimators = () => (
    <div>Text animators are not supported</div>
  )

  builders = {
    expressions: this.buildExpressionMessage,
    wiggle: this.buildWiggleMessage,
    separateDimensions: this.buildSepareteDimensionsMessage,
    orientAlongPath: this.buildOrientAlongPathMessage,
    'unhandled layer': this.buildUnhandleLayer,
    'three d layer': this.buildThreeDLayer,
    'motion blur': this.buildMotionBlur,
    'disabled layer': this.buildDisabledLayer,
    'effects': this.buildEffects,
    'unhandled shape': this.buildUnhandledShape,
    'merge paths': this.buildMergePaths,
    'text animators': this.buildTextAnimators,
    'animator properties': this.buildAnimatorProperties,
  }

  buildMessage = (builder, payload) => {
    if (this.builders[builder]) {
      return this.builders[builder](payload)
    } else {
      return null
    }
  }

  buildContent = () => (
    <div className={css(styles.content)}>
      {this.buildMessage(this.props.message.builder, this.props.message.payload)}
    </div>
  )

  render() {
    return (
      <div className={css(styles.wrapper)}>
        {this.buildHeader()}
        {this.buildContent()}
      </div>
      );
  }
}

export default Message

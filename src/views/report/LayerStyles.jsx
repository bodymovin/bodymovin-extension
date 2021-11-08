import React from 'react'
import {
  getStylesMessageCount,
} from '../../helpers/reports/counter'
import RowContainer from './components/RowContainer'
import StrokeStyle from './styles/StrokeStyle'
import DropShadowStyle from './styles/DropShadowStyle'
import InnerShadowStyle from './styles/InnerShadowStyle'
import OuterGlowStyle from './styles/OuterGlowStyle'
import InnerGlowStyle from './styles/InnerGlowStyle'
import BevelEmbossStyle from './styles/BevelEmbossStyle'
import SatinStyle from './styles/SatinStyle'
import ColorOverlayStyle from './styles/ColorOverlayStyle'
import GradientOverlayStyle from './styles/GradientOverlayStyle'

class LayerStyles extends React.Component {

  builders = {
    0: StrokeStyle,
    1: DropShadowStyle,
    2: InnerShadowStyle,
    3: OuterGlowStyle,
    4: InnerGlowStyle,
    5: BevelEmbossStyle,
    6: SatinStyle,
    7: ColorOverlayStyle,
    8: GradientOverlayStyle,
  }

  buildStylesCollection = (shouldAutoExpand, styles) => {
    return styles.map(
      style => {
        var Component = this.builders[style.type];
        return <Component
          key={style.type}
          style={style}
          renderers={this.props.renderers}
          messageTypes={this.props.messageTypes}
          builders={this.props.builders}
          shouldAutoExpand={this.props.shouldAutoExpand}
        />
      }
    )
  }

  buildContent = shouldAutoExpand => {
    return [
      this.buildStylesCollection(shouldAutoExpand, this.props.styles.styles)
    ]
  }

  render() {
    const messageCount = getStylesMessageCount(this.props.styles, this.props.renderers, this.props.messageTypes, this.props.builders)
    return (
      <RowContainer
        name={'Layer Styles'}
        content={this.buildContent}
        messageCount={messageCount}
        shouldAutoExpand={this.props.shouldAutoExpand}
      />
    );
  }
}

export default LayerStyles

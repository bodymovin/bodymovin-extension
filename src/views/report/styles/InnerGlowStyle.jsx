import React from 'react'
import {
  getDropShadowStyleMessageCount,
} from '../../../helpers/reports/counter'
import RowContainer from '../components/RowContainer'
import Property from '../Property'

class InnerGlowStyle extends React.Component {

  styleProperties = [
    {
      key: 'blendMode',
      name: 'Blend Mode',
    },
    {
      key: 'opacity',
      name: 'Opacity',
    },
    {
      key: 'noise',
      name: 'Noise',
    },
    {
      key: 'colorChoice',
      name: 'Color Type',
    },
    {
      key: 'color',
      name: 'Color',
    },
    {
      key: 'gradient',
      name: 'Colors',
    },
    {
      key: 'gradientSmoothness',
      name: 'Gradient Smoothness',
    },
    {
      key: 'glowTechnique',
      name: 'Technique',
    },
    {
      key: 'source',
      name: 'Source',
    },
    {
      key: 'chokeMatte',
      name: 'Spread',
    },
    {
      key: 'blur',
      name: 'Size',
    },
    {
      key: 'inputRange',
      name: 'Range',
    },
    {
      key: 'shadingNoise',
      name: 'Jitter',
    },
  ]

  buildProperties = shouldAutoExpand => (
    this.styleProperties.map(propertyData => (
      <Property
        key={propertyData.key}
        name={propertyData.name}
        messages={this.props.style[propertyData.key]}
        renderers={this.props.renderers}
        messageTypes={this.props.messageTypes}
        builders={this.props.builders}
        shouldAutoExpand={shouldAutoExpand}
      />
    ))
  )

  buildMessages = shouldAutoExpand => (
    <Property
      name={'Style Messages'}
      key={'styles'}
      messages={this.props.style.messages}
      renderers={this.props.renderers}
      messageTypes={this.props.messageTypes}
      builders={this.props.builders}
      shouldAutoExpand={shouldAutoExpand}
    />
  )

  buildContent = shouldAutoExpand => {
    return (
      [
        this.buildMessages(shouldAutoExpand),
        this.buildProperties(shouldAutoExpand),
      ]
    )
  }

  render() {
    const messageCount = getDropShadowStyleMessageCount(
      this.props.style,
      this.props.renderers,
      this.props.messageTypes,
      this.props.builders,
    )
    return (
      <RowContainer
        name={this.props.style.name}
        content={this.buildContent}
        messageCount={messageCount}
        shouldAutoExpand={this.props.shouldAutoExpand}
      />
    );
  }
}

export default InnerGlowStyle

import React from 'react'
import {
  getDropShadowStyleMessageCount,
} from '../../../helpers/reports/counter'
import RowContainer from '../components/RowContainer'
import Property from '../Property'

class InnerShadowStyle extends React.Component {

  styleProperties = [
    {
      key: 'blendMode',
      name: 'Blend Mode',
    },
    {
      key: 'color',
      name: 'Color',
    },
    {
      key: 'opacity',
      name: 'Opacity',
    },
    {
      key: 'globalLight',
      name: 'Global Light',
    },
    {
      key: 'angle',
      name: 'Angle',
    },
    {
      key: 'distance',
      name: 'Distance',
    },
    {
      key: 'choke',
      name: 'Choke',
    },
    {
      key: 'size',
      name: 'Size',
    },
    {
      key: 'noise',
      name: 'Noise',
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

export default InnerShadowStyle

import React from 'react'
import {
  getDropShadowStyleMessageCount,
} from '../../../helpers/reports/counter'
import RowContainer from '../components/RowContainer'
import Property from '../Property'

class DropShadowStyle extends React.Component {

  buildProperties = shouldAutoExpand => (
    [
      <Property
        key={'color'}
        name={'Color'}
        messages={this.props.style.color}
        renderers={this.props.renderers}
        messageTypes={this.props.messageTypes}
        shouldAutoExpand={shouldAutoExpand}
      />,
      <Property
        key={'opacity'}
        name={'Opacity'}
        messages={this.props.style.opacity}
        renderers={this.props.renderers}
        messageTypes={this.props.messageTypes}
        shouldAutoExpand={shouldAutoExpand}
      />,

    ]
  )

  buildMessages = shouldAutoExpand => (
    <Property
      name={'Style Messages'}
      key={'styles'}
      messages={this.props.style.messages}
      renderers={this.props.renderers}
      messageTypes={this.props.messageTypes}
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
      this.props.messageTypes
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

export default DropShadowStyle

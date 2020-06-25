import React from 'react'
import {
  getMasksMessageCount,
} from '../../helpers/reports/counter'
import RowContainer from './components/RowContainer'
import Message from './components/Message'
import Mask from './masks/Mask'

class Masks extends React.Component {

  buildMasks = shouldAutoExpand => {
    return this.props.masks.masks
    .map((mask, index) => {
      return <Mask
        key={index}
        mask={mask}
        renderers={this.props.renderers}
        messageTypes={this.props.messageTypes}
        builders={this.props.builders}
        shouldAutoExpand={shouldAutoExpand}
      />
    })
  }

  buildMessages = shouldAutoExpand => {
    return this.props.masks.messages
    .map((message, index) => {
      return <Message
        key={index}
        message={message}
        renderers={this.props.renderers}
        messageTypes={this.props.messageTypes}
        builders={this.props.builders}
      />
    })
  }

  buildContent = shouldAutoExpand => {
    return [
      this.buildMessages(shouldAutoExpand),
      this.buildMasks(shouldAutoExpand),
    ]
  }

  render() {
    const messageCount = getMasksMessageCount(this.props.masks, this.props.renderers, this.props.messageTypes, this.props.builders)
    return (
      <RowContainer
        name={'Masks'}
        content={this.buildContent}
        messageCount={messageCount}
        shouldAutoExpand={this.props.shouldAutoExpand}
      />
    );
  }
}

export default Masks

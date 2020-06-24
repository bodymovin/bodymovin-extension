import React from 'react'
import {
  getMaskMessageCount,
} from '../../../helpers/reports/counter'
import Property from '../Property'
import RowContainer from '../components/RowContainer'
import Message from '../components/Message'

class Mask extends React.Component {

  buildProperties = shouldAutoExpand => {
    return ([
        <Property
          key={'opacity'}
          name={'Opacity'}
          messages={this.props.mask.opacity}
          renderers={this.props.renderers}
          messageTypes={this.props.messageTypes}
          builders={this.props.builders}
          shouldAutoExpand={shouldAutoExpand}
        />,
        <Property
          key={'expansion'}
          name={'Expansion'}
          messages={this.props.mask.expansion}
          renderers={this.props.renderers}
          messageTypes={this.props.messageTypes}
          builders={this.props.builders}
          shouldAutoExpand={shouldAutoExpand}
        />,
        <Property
          key={'feather'}
          name={'Feather'}
          messages={this.props.mask.feather}
          renderers={this.props.renderers}
          messageTypes={this.props.messageTypes}
          builders={this.props.builders}
          shouldAutoExpand={shouldAutoExpand}
        />,
        <Property
          key={'path'}
          name={'Path'}
          messages={this.props.mask.path}
          renderers={this.props.renderers}
          messageTypes={this.props.messageTypes}
          builders={this.props.builders}
          shouldAutoExpand={shouldAutoExpand}
        />,
      ]
    )
  }

  buildMessages = shouldAutoExpand => {
    return this.props.mask.messages
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
      this.buildProperties(shouldAutoExpand),
    ]
  }

  render() {
    const messageCount = getMaskMessageCount(this.props.mask, this.props.renderers, this.props.messageTypes, this.props.builders)
    return (
      <RowContainer
        name={this.props.mask.name}
        content={this.buildContent}
        messageCount={messageCount}
        shouldAutoExpand={this.props.shouldAutoExpand}
      />
    );
  }
}

export default Mask

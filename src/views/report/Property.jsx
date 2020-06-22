import React from 'react'
import {
  getPropertyMessageCount,
} from '../../helpers/reports/counter'
import RowContainer from './components/RowContainer'
import Message from './components/Message'

class Property extends React.Component {

  buildContent = () => {
    const messages = this.props.messages
    return (
      <div>
      {messages.map((message, index) => (
        <Message 
          key={index}
          message={message}
          renderers={this.props.renderers}
          messageTypes={this.props.messageTypes}
          builders={this.props.builders}
        />
      ))}
      </div>
    )
  }

  render() {
    const messageCount = getPropertyMessageCount(this.props.messages, this.props.renderers, this.props.messageTypes, this.props.builders)
    return (
      <RowContainer
        name={this.props.name}
        content={this.buildContent}
        messageCount={messageCount}
        shouldAutoExpand={this.props.shouldAutoExpand}
      />
    );
  }
}

export default Property

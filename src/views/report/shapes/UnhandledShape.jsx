import React from 'react'
import Property from '../Property'

class UnhandledShape extends React.Component {

  render() {
    return <Property
      name={this.props.name}
      messages={this.props.messages}
      renderers={this.props.renderers}
      messageTypes={this.props.messageTypes}
      builders={this.props.builders}
      shouldAutoExpand={this.props.shouldAutoExpand}
    />
  }
}

export default UnhandledShape

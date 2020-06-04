import React from 'react'
import {
  getShapeRepeaterMessagesCount,
} from '../../../helpers/reports/counter'
import RowContainer from '../components/RowContainer'
import Transform from '../Transform'
import Property from '../Property'

class RepeaterShape extends React.Component {

  buildTransform = () => (
    <Transform
      key={'transform'}
      transform={this.props.repeater.transform}
      renderers={this.props.renderers}
      messageTypes={this.props.messageTypes}
    />
  )

  buildCopies = () => (
    <Property
      key={'copies'}
      name={'Copies'}
      messages={this.props.repeater.copies}
      renderers={this.props.renderers}
      messageTypes={this.props.messageTypes}
    />
  )

  buildOffset = () => (
    <Property
      key={'offset'}
      name={'Offset'}
      messages={this.props.repeater.offset}
      renderers={this.props.renderers}
      messageTypes={this.props.messageTypes}
    />
  )

  buildContent = () => {
    return (
      [
        this.buildTransform(),
        this.buildCopies(),
        this.buildOffset(),
      ]
    )
  }

  render() {
    const messageCount = getShapeRepeaterMessagesCount(
      this.props.repeater,
      this.props.renderers,
      this.props.messageTypes
    )
    return (
      <RowContainer
        name={this.props.name}
        content={this.buildContent}
        messageCount={messageCount}
      />
    );
  }
}

export default RepeaterShape

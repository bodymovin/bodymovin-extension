import React from 'react'
import {
  getShapeRepeaterMessagesCount,
} from '../../../helpers/reports/counter'
import RowContainer from '../components/RowContainer'
import Transform from '../Transform'
import Property from '../Property'

class RepeaterShape extends React.Component {

  buildTransform = shouldAutoExpand => (
    <Transform
      key={'transform'}
      transform={this.props.repeater.transform}
      renderers={this.props.renderers}
      messageTypes={this.props.messageTypes}
      builders={this.props.builders}
      shouldAutoExpand={shouldAutoExpand}
    />
  )

  buildCopies = shouldAutoExpand => (
    <Property
      key={'copies'}
      name={'Copies'}
      messages={this.props.repeater.copies}
      renderers={this.props.renderers}
      messageTypes={this.props.messageTypes}
      builders={this.props.builders}
      shouldAutoExpand={shouldAutoExpand}
    />
  )

  buildOffset = shouldAutoExpand => (
    <Property
      key={'offset'}
      name={'Offset'}
      messages={this.props.repeater.offset}
      renderers={this.props.renderers}
      messageTypes={this.props.messageTypes}
      builders={this.props.builders}
      shouldAutoExpand={shouldAutoExpand}
    />
  )

  buildContent = shouldAutoExpand => {
    return (
      [
        this.buildTransform(shouldAutoExpand),
        this.buildCopies(shouldAutoExpand),
        this.buildOffset(shouldAutoExpand),
      ]
    )
  }

  render() {
    const messageCount = getShapeRepeaterMessagesCount(
      this.props.repeater,
      this.props.renderers,
      this.props.messageTypes,
      this.props.builders,
    )
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

export default RepeaterShape

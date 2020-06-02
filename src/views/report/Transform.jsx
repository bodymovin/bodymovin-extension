import React from 'react'
import {
  getTransformMessageCount,
} from '../../helpers/reports/counter'
import Property from './Property'
import PositionProperty from './components/PositionProperty'
import RotationProperty from './components/RotationProperty'
import RowContainer from './components/RowContainer'

class Transform extends React.Component {

  buildContent = () => {
    return ([
        <Property
          key={'anchorPoint'}
          name={'Anchor Point'}
          messages={this.props.transform.anchorPoint}
          renderers={this.props.renderers}
          messageTypes={this.props.messageTypes}
        />,
        <PositionProperty
          key={'position'}
          property={this.props.transform.position}
          renderers={this.props.renderers}
          messageTypes={this.props.messageTypes}
        />,
        <Property
          key={'scale'}
          name={'Scale'}
          messages={this.props.transform.scale}
          renderers={this.props.renderers}
          messageTypes={this.props.messageTypes}
        />,
        <RotationProperty
          key={'rotation'}
          property={this.props.transform.rotation}
          renderers={this.props.renderers}
          messageTypes={this.props.messageTypes}
        />,
        <Property
          key={'opacity'}
          name={'Opacity'}
          messages={this.props.transform.opacity}
          renderers={this.props.renderers}
          messageTypes={this.props.messageTypes}
        />
      ]
    )
  }

  render() {
    const messageCount = getTransformMessageCount(this.props.transform, this.props.renderers, this.props.messageTypes)
    return (
      <RowContainer
        name={'Transform'}
        content={this.buildContent}
        messageCount={messageCount}
      />
    );
  }
}

export default Transform

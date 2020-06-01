import React from 'react'
import {
  getLayerMessageCount,
} from '../../helpers/reports/counter'
import Transform from './Transform'
import RowContainer from './components/RowContainer'
import Property from './Property'
import LayerCollection from './LayerCollection'

class Layer extends React.Component {

  buildMessages = () => (
    <Property
      name={'Layer Messages'}
      key={'layer'}
      messages={this.props.layer.messages}
      renderers={this.props.renderers}
      messageTypes={this.props.messageTypes}
    />
  )

  buildTransform = () => (
    <Transform
      key={'transform'}
      transform={this.props.layer.transform}
      renderers={this.props.renderers}
      messageTypes={this.props.messageTypes}
    />
  )

  buildLayerContent = () => {
    if (this.props.layer.type === 0) {
      return (
        <LayerCollection
          key={'content'}
          layers={this.props.layer.layers}
          assets={this.props.assets}
          renderers={this.props.renderers}
          messageTypes={this.props.messageTypes}
        />
      )
    } else {
      return null;
    }
  }

  buildContent = () => {
    return (
      [
        this.buildMessages(),
        this.buildTransform(),
        this.buildLayerContent()
      ]
    )
  }

  render() {
    const messageCount = getLayerMessageCount(this.props.layer, this.props.renderers, this.props.messageTypes)
    return (
      <RowContainer
        name={this.props.layer.name}
        content={this.buildContent}
        messageCount={messageCount}
      />
    );
  }
}

export default Layer

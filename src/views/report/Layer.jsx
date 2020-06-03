import React from 'react'
import {
  getLayerMessageCount,
} from '../../helpers/reports/counter'
import Transform from './Transform'
import Effects from './Effects'
import RowContainer from './components/RowContainer'
import Property from './Property'
import LayerCollection from './LayerCollection'
import ShapeCollection from './shapes/ShapeCollection'

class Layer extends React.Component {

  buildMessages = () => (
    <Property
      name={'General Messages'}
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

  buildEffects = () => (
    <Effects
      key={'effects'}
      effects={this.props.layer.effects}
      renderers={this.props.renderers}
      messageTypes={this.props.messageTypes}
    />
  )

  buildLayerContent = () => {
    if (this.props.layer.type === 0) {
      return (
        <LayerCollection
          key={'content'}
          compositionId={this.props.layer.id}
          layers={this.props.layer.layers}
          assets={this.props.assets}
          renderers={this.props.renderers}
          messageTypes={this.props.messageTypes}
          onLayerNavigation={this.props.onLayerNavigation}
        />
      )
    } else if (this.props.layer.type === 4) {
      return (
        <ShapeCollection
          key={'content'}
          compositionId={this.props.layer.id}
          shapes={this.props.layer.shapes}
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
        this.buildEffects(),
        this.buildLayerContent(),
      ]
    )
  }

  onLayerNavigation = () => {
    this.props.onLayerNavigation(this.props.layer.index, this.props.compositionId)
  }

  render() {
    const messageCount = getLayerMessageCount(this.props.layer, this.props.renderers, this.props.messageTypes)
    return (
      <RowContainer
        name={this.props.layer.name}
        content={this.buildContent}
        messageCount={messageCount}
        onHeaderSelect={this.onLayerNavigation}
      />
    );
  }
}

export default Layer

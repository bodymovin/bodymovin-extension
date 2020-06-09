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
import TextLayer from './TextLayer'

class Layer extends React.Component {

  buildMessages = shouldAutoExpand => (
    <Property
      name={'General Messages'}
      key={'layer'}
      messages={this.props.layer.messages}
      renderers={this.props.renderers}
      messageTypes={this.props.messageTypes}
      shouldAutoExpand={shouldAutoExpand}
    />
  )

  buildTransform = shouldAutoExpand => (
    <Transform
      key={'transform'}
      transform={this.props.layer.transform}
      renderers={this.props.renderers}
      messageTypes={this.props.messageTypes}
      shouldAutoExpand={shouldAutoExpand}
    />
  )

  buildEffects = shouldAutoExpand => (
    <Effects
      key={'effects'}
      effects={this.props.layer.effects}
      renderers={this.props.renderers}
      messageTypes={this.props.messageTypes}
      shouldAutoExpand={shouldAutoExpand}
    />
  )

  buildLayerContent = shouldAutoExpand => {
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
          shouldAutoExpand={shouldAutoExpand}
        />
      )
    } else if (this.props.layer.type === 4) {
      return (
        <ShapeCollection
          key={'content'}
          shapes={this.props.layer.shapes}
          renderers={this.props.renderers}
          messageTypes={this.props.messageTypes}
          shouldAutoExpand={shouldAutoExpand}
        />
      )
    } else if (this.props.layer.type === 5) {
      return (
        <TextLayer
          key={'content'}
          text={this.props.layer.text}
          renderers={this.props.renderers}
          messageTypes={this.props.messageTypes}
          shouldAutoExpand={shouldAutoExpand}
        />
      )
    } else {
      return null;
    }
  }

  buildContent = shouldAutoExpand => {
    return (
      [
        this.buildMessages(shouldAutoExpand),
        this.buildTransform(shouldAutoExpand),
        this.buildEffects(shouldAutoExpand),
        this.buildLayerContent(shouldAutoExpand),
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
        shouldAutoExpand={this.props.shouldAutoExpand}
      />
    );
  }
}

export default Layer

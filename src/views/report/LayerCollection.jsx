import React from 'react'
import {
  getLayerCollectionMessagesCount,
} from '../../helpers/reports/counter'
import Layer from './Layer'
import RowContainer from './components/RowContainer'

class LayerCollection extends React.Component {

  buildLayers = shouldAutoExpand => {
    return this.props.layers.map((layer, index) => (
      <Layer
        key={index}
        compositionId={this.props.compositionId}
        layer={layer}
        assets={this.props.assets}
        renderers={this.props.renderers}
        messageTypes={this.props.messageTypes}
        onLayerNavigation={this.props.onLayerNavigation}
        shouldAutoExpand={shouldAutoExpand}
      />
    ))
  }

  buildContent = shouldAutoExpand => {
    return this.buildLayers(shouldAutoExpand)
  }

  render() {
    const messageCount = getLayerCollectionMessagesCount(this.props.layers, this.props.renderers, this.props.messageTypes)
    return (
      <RowContainer
        name={'Composition Layers'}
        content={this.buildContent}
        messageCount={messageCount}
        shouldAutoExpand={this.props.shouldAutoExpand}
      />
    );
  }
}

export default LayerCollection

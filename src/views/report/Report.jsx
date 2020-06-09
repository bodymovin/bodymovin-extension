import React from 'react'
import {
  getAnimationMessageCount
} from '../../helpers/reports/counter'
import LayerCollection from './LayerCollection'
import RowContainer from './components/RowContainer'

class Report extends React.Component {

  buildLayers = shouldAutoExpand => (
    <LayerCollection
      key={'content'}
      compositionId={this.props.report.id}
      layers={this.props.report.layers}
      assets={this.props.report.assets}
      renderers={this.props.renderers}
      messageTypes={this.props.messageTypes}
      onLayerNavigation={this.props.onLayerNavigation}
      shouldAutoExpand={shouldAutoExpand}
    />
  )

  buildContent = shouldAutoExpand => this.buildLayers(shouldAutoExpand)

  render() {
    if (!this.props.report || !this.props.report.version) {
      return null;
    }
    const messageCount = getAnimationMessageCount(this.props.report, this.props.renderers, this.props.messageTypes)
    return (
      <RowContainer
        name={'Animation Report'}
        content={this.buildContent}
        messageCount={messageCount}
        shouldAutoExpand={this.props.shouldAutoExpand}
      />
    );
  }
}

export default Report

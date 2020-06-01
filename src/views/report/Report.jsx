import React from 'react'
import {
  getAnimationMessageCount
} from '../../helpers/reports/counter'
import Layer from './Layer'
import RowContainer from './components/RowContainer'

class Report extends React.Component {

  buildContent = () => {
    const layers = this.props.report.layers
    const assets = this.props.report.assets
    return (
      layers.map((layer, index) => (
        <Layer
          key={index}
          layer={layer}
          assets={assets}
          renderers={this.props.renderers}
          messageTypes={this.props.messageTypes}
        />
      ))
    )
  }

  render() {
    const messageCount = getAnimationMessageCount(this.props.report, this.props.renderers, this.props.messageTypes)
    return (
      <RowContainer
        name={'Animation Report'}
        content={this.buildContent}
        messageCount={messageCount}
      />
    );
  }
}

export default Report

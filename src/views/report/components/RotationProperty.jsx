import React from 'react'
import { StyleSheet, css } from 'aphrodite'
import Variables from '../../../helpers/styles/variables'
import {
  getPositionMessageCount
} from '../../../helpers/reports/counter'
import RowHeader from './RowHeader'
import Property from '../Property'

const styles = StyleSheet.create({
    wrapper: {
      width: '100%',
      backgroundColor: Variables.colors.gray,
      padding: '6px 0',
      overflow: 'hidden',
    },
    content: {

    }
})

class Rotation extends React.Component {

  state = {
    isCollapsed: false,
  }

  toggleCollapse = () => {
    const messageCount = getPositionMessageCount(this.props.property, this.props.renderers, this.props.messageTypes)
    if (messageCount.error || messageCount.warning) {
      this.setState({
        isCollapsed: !this.state.isCollapsed,
      })
    }
  }

  buildHeader = () => {
    const messageCount = getPositionMessageCount(this.props.property, this.props.renderers, this.props.messageTypes)
    return (
      <RowHeader
        name={'Position'}
        isCollapsed={this.state.isCollapsed}
        toggleCollapse={this.toggleCollapse}
        messages={messageCount}
      />
    )
  }

  buildContent = () => {
    if (!this.state.isCollapsed) {
      return null
    } else {
      const property = this.props.property
      return (
        <div className={css(styles.content)}>
          <Property
            name={'Rotation X'}
            messages={property.rotationX}
            renderers={this.props.renderers}
            messageTypes={this.props.messageTypes}
          />
          <Property
            name={'Rotation Y'}
            messages={property.rotationY}
            renderers={this.props.renderers}
            messageTypes={this.props.messageTypes}
          />
          <Property
            name={'Rotation Z'}
            messages={property.rotationZ}
            renderers={this.props.renderers}
            messageTypes={this.props.messageTypes}
          />
          <Property
            name={'Orientation'}
            messages={property.orientation}
            renderers={this.props.renderers}
            messageTypes={this.props.messageTypes}
          />
               
        </div>
      )
    }
  }

  render() {
    const property = this.props.property
    if (!property.isThreeD) {
      return (
        <Property
          name={'Rotation'}
          messages={property.rotation}
          renderers={this.props.renderers}
          messageTypes={this.props.messageTypes}
        />
      )
    } else {
      return (
        <div className={css(styles.wrapper)}>
          {this.buildHeader()}
          {this.buildContent()}
        </div>
      );
    }
  }
}

export default Rotation

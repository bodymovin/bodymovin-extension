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

class Position extends React.Component {

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
            name={'Position X'}
            messages={property.positionX}
            renderers={this.props.renderers}
            messageTypes={this.props.messageTypes}
          />
          <Property
            name={'Position Y'}
            messages={property.positionY}
            renderers={this.props.renderers}
            messageTypes={this.props.messageTypes}
          />
          {property.positionZ && 
            <Property
              name={'Position Z'}
              messages={property.positionZ}
              renderers={this.props.renderers}
              messageTypes={this.props.messageTypes}
            />
          }       
        </div>
      )
    }
  }

  render() {
    const property = this.props.property
    if (!property.dimensionsSeparated) {
      return (
        <Property
          name={'Position'}
          messages={property.position}
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

export default Position

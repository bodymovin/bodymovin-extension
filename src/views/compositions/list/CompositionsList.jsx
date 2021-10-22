import React from 'react'
import { StyleSheet, css } from 'aphrodite'
import CompositionsListItem from './CompositionsListItem'

const styles = StyleSheet.create({
    list: {
      overflow: 'auto',
      flex: '1 1 auto',
    }
})

class CompositionsList extends React.PureComponent {

  createItem(item) {
    return <CompositionsListItem 
              item={item} 
              toggleItem={this.props.toggleItem} 
              showSettings={this.props.showSettings} 
              goToReports={this.props.goToReports} 
              selectDestination={this.props.selectDestination} 
              key={item.id} />
  }

  render() {

  	let items = this.props.items.map((item) => {
  		return this.createItem(item)
  	})

    return (
    	<ul className={css(styles.list)} >
    		{items}
    	</ul>
    	);
  }
}

export default CompositionsList
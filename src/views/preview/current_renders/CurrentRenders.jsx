import React from 'react'
import { StyleSheet, css } from 'aphrodite'
import BaseButton from '../../../components/buttons/Base_button'
import Variables from '../../../helpers/styles/variables'
import textEllipsis from '../../../helpers/styles/textEllipsis'

const styles = StyleSheet.create({
    container: {
      width: '100%',
      height: '100%',
      backgroundColor:'rgba(100,100,100,.8)',
      position: 'absolute',
      top: '0',
      left: '0',
      display: 'flex',
      flexDirection:'column',
      padding: '20px'
    },
    list:{
    	flexGrow: 1,
    	backgroundColor: Variables.colors.gray_darkest,
      width: '100%',
      overflowX: 'hidden',
      overflowY: 'auto'
    },
    nav:{
    	flexGrow: 0,
    	textAlign: 'right',
    	marginBottom: '10px'
    },
    list_item:{
    	width: '100%',
    	height: '30px',
    	fontSize: '12px',
    	lineHeight: '26px',
    	padding: '2px',
    	color: Variables.colors.white,
    	backgroundColor: Variables.colors.gray,
    	borderBottom: '2px solid ' + Variables.colors.gray2,
    	cursor: 'pointer',
      overflow: 'hidden',
    	':hover' : {
    		color: Variables.colors.green,
    	}
    }
})

function getItems(items, itemSelected) {
	return items.map(function(item, index){
		return <li key={index} onClick={()=>itemSelected(item)} className={css(styles.list_item, textEllipsis)}>{item.name}</li>
	})
}

let CurrentRenders = (props) => {
	return (<div className={css(styles.container)}>
				<div className={css(styles.nav)}>
					<BaseButton text='Cancel' type='gray' onClick={props.cancelSelection} />
				</div>
				<ul className={css(styles.list)}>
					{getItems(props.items, props.itemSelected)}
				</ul>
			</div>)
}

export default CurrentRenders
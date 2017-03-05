import React from 'react'
import { StyleSheet, css } from 'aphrodite'
import status_button from '../../../assets/svg/cancel_button.svg'
import complete_icon from '../../../assets/svg/complete_icon.svg'
import Variables from '../../../helpers/styles/variables'
import BodymovinFolder from '../../../components/bodymovin/bodymovin_folder'

const styles = StyleSheet.create({
    compElement: {
    	width: '100%',
    	height: '33px',
        backgroundColor: Variables.colors.gray_darkest,
    	position: 'relative'
    },
    compElementProgress: {
    	width: '100%',
    	height: '100%',
    	background: Variables.gradients.blueGreen,
    	opacity: 0.05,
    	position: 'absolute',
    	top: 0,
    	left: 0
    },
    compElementContent: {
    	width: '100%',
    	height: '100%',
    	position: 'absolute',
    	top: 0,
    	left: 0,
    	display: 'flex',
    	alignItems: 'center'
    },
    compElementContentFolder: {
        width: '50px',
        height: '100%',
        flexGrow: 0,
        padding: '2px 20px 2px 0px'
    },
    compElementContentFolder__button: {
    	background: 'none',
        padding: 0,
        width: '100%',
        height: '100%',
        cursor: 'pointer'
    },
    compElementContentFolder__image: {
    	width: '100%',
    	height: '100%'
    },
    compElementContentToggle: {
    	width: '30px',
    	height: '100%',
    	flexGrow: 0,
    	padding: '5px'
    },
    compElementContentToggleImage: {
    	width: '100%',
    	height: '100%'
    },
    compElementContentName: {
    	width: '100%',
    	flexGrow: 1,
    	padding: '0 4px',
    	whiteSpace: 'nowrap',
    	textOverflow: 'ellipsis',
    	overflow: 'hidden'
    }
})

let RenderItem = (props) => {
	return (<li className={css(styles.compElement)}>
				<div className={css(styles.compElementProgress)}></div>
				<div className={css(styles.compElementContent)}>
				<div className={css(styles.compElementContentName)}>{props.item.name}</div>
				{props.item.renderStatus === 0 && <div className={css(styles.compElementContentToggle)}>
                    <button className={css(styles.compElementContentFolder__button)}>
					   <img src={status_button}  className={css(styles.compElementContentFolder__image)} alt='toggle' />
                    </button>
				</div>}
                {props.item.renderStatus === 1 && <div className={css(styles.compElementContentToggle)}>
                   <img src={complete_icon}  className={css(styles.compElementContentFolder__image)} alt='toggle' />
                </div>}
				<div className={css(styles.compElementContentFolder)}>
                    <div className={css(styles.compElementContentFolder__button)} onClick={()=>props.navigateToFolder(props.item)}>
                        <BodymovinFolder />
                    </div>
				</div>
			</div>
			</li>)
}

export default RenderItem
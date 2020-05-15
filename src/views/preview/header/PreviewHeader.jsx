import React from 'react'
import { StyleSheet, css } from 'aphrodite'
import Variables from '../../../helpers/styles/variables'
import BaseButton from '../../../components/buttons/Base_button'
import {previewTypes} from '../viewer/PreviewViewer'

const styles = StyleSheet.create({
    container: {
      width: '100%',
      marginBottom: '10px'
    },
    right: {
      float: 'right'
    },
    buttons_container: {
    	width: '100%',
    	height: '50px',
        display: 'flex',
        alignItems:'center'
    },
    button: {
        marginRight:'5px',
        flexGrow: 0
    },
    buttons_separator: {
        flexGrow: 1
    },
    refresh: {
    	width: '40px',
    	height: '34px',
    	backgroundColor: 'transparent',
      	verticalAlign:'middle'
    },
    refresh_image: {
    	maxWidth: '100%',
    	maxHeight: '100%'
    },
    separator: {
        width: '100%',
        height: '1px',
        backgroundColor: Variables.colors.gray2,
        marginTop: '20px',
        marginBottom: '20px'
    },
    renderersContainer: {
        display: 'flex',
        alignItems: 'baseline',
    },
    renderersLabel: {
        flex: '0 0 auto',
        marginRight: '5px',
        color: Variables.colors.white,
    },
    renderersButton: {
    	flex: '0 0 auto'
    }
})

function PreviewHeader(props) {
	return (<div className={css(styles.container)}>
				<div className={css(styles.buttons_container)}>
                    <BaseButton text='Browse' type='green' classes={styles.button} onClick={props.browseFiles}/>
                    <BaseButton text='Current Renders' type='green' classes={styles.button} onClick={props.selectCurrentRenders}/>
                    <div className={css(styles.buttons_separator)}></div>
					<BaseButton text='‹ Back' type='gray' classes={styles.button} onClick={props.goToComps}/>
				</div>
				<div className={css(styles.separator)}></div>
                    <div className={css(styles.renderersContainer)}>
                        <div className={css(styles.renderersLabel)}>Select Previewer:
                        </div>
                        <BaseButton 
                            text='Browser'
                            type={props.selectedTypes.includes(previewTypes.BROWSER) ? 'green' : 'gray'}
                            classes={styles.renderersButton}
                            onClick={()=>props.onRendererSelected(previewTypes.BROWSER)}
                        />
                        <BaseButton
                            text='Skottie'
                            type={props.selectedTypes.includes(previewTypes.SKOTTIE) ? 'green' : 'gray'}
                            classes={styles.renderersButton}
                            onClick={()=>props.onRendererSelected(previewTypes.SKOTTIE)}
                        />
                    </div>
			</div>)
}

export default PreviewHeader
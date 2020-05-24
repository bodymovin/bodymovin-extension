import React from 'react'
import { StyleSheet, css } from 'aphrodite'
import Variables from '../../../helpers/styles/variables'
import BaseButton from '../../../components/buttons/Base_button'
import {previewTypes} from '../viewer/PreviewViewer'
import BodymovinCheckbox from '../../../components/bodymovin/bodymovin_checkbox'
import checkbox from '../../../assets/animations/checkbox.json'

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
        marginTop: '10px',
        marginBottom: '10px'
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
        marginRight:'5px',
    	flex: '0 0 auto',
    },
    previewOption: {
        marginRight: '20px',
        cursor: 'pointer',
        color: Variables.colors.white,
    },
    'previewOption-checkbox': {
        width: '25px',
        display: 'inline-block',
        verticalAlign: 'middle',
        marginRight: '4px',
    }
})

function PreviewHeader(props) {
	return (<div className={css(styles.container)}>
				<div className={css(styles.buttons_container)}>
                    <BaseButton text='Browse Local Files' type='green' classes={styles.button} onClick={props.browseFiles}/>
                    <BaseButton text='Current Renders' type='green' classes={styles.button} onClick={props.selectCurrentRenders}/>
                    <div className={css(styles.buttons_separator)}></div>
					<BaseButton text='‹ Back' type='gray' classes={styles.button} onClick={props.goToComps}/>
				</div>
				<div className={css(styles.separator)}></div>
                    <div className={css(styles.renderersContainer)}>
                        <div className={css(styles.renderersLabel)}>Select Previewer:
                        </div>
                        <div
                            className={css(styles.previewOption)}
                            onClick={()=>props.onRendererSelected(previewTypes.BROWSER)}
                        >
                            <BodymovinCheckbox
                                animationData={checkbox}
                                animate={props.selectedTypes.includes(previewTypes.BROWSER)}
                            >
                                <div
                                    className={css(styles['previewOption-checkbox'])}
                                    
                                />
                            </BodymovinCheckbox>
                            <span>Browser</span>
                        </div>
                        <div
                            className={css(styles.previewOption)}
                            onClick={()=>props.onRendererSelected(previewTypes.SKOTTIE)}
                        >
                            <BodymovinCheckbox
                                animationData={checkbox}
                                animate={props.selectedTypes.includes(previewTypes.SKOTTIE)}
                            >
                                <div
                                    className={css(styles['previewOption-checkbox'])}
                                    
                                />
                            </BodymovinCheckbox>
                            <span>Skottie</span>
                        </div>
                    </div>
			</div>)
}

export default PreviewHeader
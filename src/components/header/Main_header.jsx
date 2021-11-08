import React from 'react'
import { StyleSheet, css } from 'aphrodite'
import BaseButton from '../buttons/Base_button'
import Variables from '../../helpers/styles/variables'

const styles = StyleSheet.create({
    container: {
      width: '100%',
      marginBottom: '10px'
    },
    right: {
      marginRight:'7px',
    },
    buttons_container: {
    	width: '100%',
    	height: '50px',
        display: 'flex',
        alignItems:'center',
        justifyContent: 'space-between',
    },
    buttons_group: {
        display: 'inline-block',
    },
    button: {
        marginRight:'7px',
        flex: '0 0 auto',
    },
    buttons_separator: {
        flex: '1 1 auto',
    },
    refresh: {
    	width: '40px',
    	height: '31px',
    	backgroundColor: 'transparent',
      	verticalAlign:'middle',
        cursor: 'pointer',
        transition: 'transform 500ms ease-out',
        webkitFilter: 'saturate(100%)'
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
    }
})

function Main_header(props) {
	return (<div className={css(styles.container)}>
				<div className={css(styles.buttons_container)}>
					<BaseButton text='Preview' type='gray' classes={styles.button} onClick={props.goToPreview} />
                    <div className={css(styles.buttons_separator)}></div>
                    <BaseButton text='Import Lottie Animation' type='gray' classes={styles.right} onClick={props.goToImportFile}/>
                    <BaseButton text='Get the Player' type='gray' classes={styles.right} onClick={props.goToPlayer}/>
                    <BaseButton text='Reports' type='gray' classes={styles.right} onClick={() => props.goToReports()}/>
					<BaseButton text='Annotations' type='gray' classes={styles.right} onClick={props.goToAnnotations}/>
				</div>
				<div className={css(styles.separator)}></div>
                <div className={css(styles.buttons_container)}>
                    <div className={css(styles.buttons_group)}>
                        <BaseButton text='Render' type='green' classes={styles.button} disabled={!props.canRender} onClick={props.startRender} />
                    </div>
                    <div className={css(styles.buttons_group)}>
                        <BaseButton
                            text='Apply Settings'
                            alt='Apply Settings to Selected Comps'
                            type='gray'
                            classes={styles.button}
                            onClick={props.applySettings}
                        />
                        <BaseButton
                            text='Refresh list'
                            type='gray'
                            classes={styles.button}
                            onClick={props.refresh}
                        />
                        <BaseButton
                            text='Project Settings'
                            type='gray'
                            classes={styles.button}
                            onClick={props.openGlobalSettings}
                        />
                    </div>
                </div>
			</div>)
}

export default Main_header
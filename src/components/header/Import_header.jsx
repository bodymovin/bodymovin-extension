import React from 'react'
import { StyleSheet, css } from 'aphrodite'
import BaseButton from '../buttons/Base_button'
import Variables from '../../helpers/styles/variables'

const styles = StyleSheet.create({
    container: {
      width: '100%',
      marginBottom: '10px',
      flex: '0 0 auto',
    },
    right: {
      marginRight:'7px',
    },
    buttons_container: {
        width: '100%',
        height: '50px',
        display: 'flex',
        alignItems:'center'
    },
    buttons_subgroup: {
        width: '100%',
        flex: '1 1 auto',
        alignItems:'center'
    },
    input_container: {
        paddingTop: '10px',
        width: '100%',
        display: 'flex',
    },
    input_element: {
        flex: '1 1 auto',
    },
    button_input: {
        flex: '0 0 auto',
    },
    button_flex: {
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
    	marginTop: '20px',
    	marginBottom: '20px'
    }
})

function getHeaderType(importState) {
    if (importState === 'processing' || importState === 'loading') {
        return 'processing'
    } else {
        return 'idle'
    }
}

function Import_header(props) {
	return (<div className={css(styles.container)}>
                <div className={css(styles.buttons_container)}>
                    <div className={css(styles.buttons_separator)}></div>
                    <BaseButton text='Back' type='gray' classes={styles.right} onClick={props.onBack}/>
                </div>
				<div className={css(styles.buttons_container)}>
                    {getHeaderType(props.state) !== 'processing' && 
                        <div className={css(styles.buttons_subgroup)}>
                            <BaseButton text='Import Local File' type='green' classes={styles.button_flex} onClick={props.onSelect} />
                            <div className={css(styles.input_container)}>
                                <input 
                                    className={css(styles.input_element)}
                                    value={props.urlImportValue}
                                    onChange={(ev) => props.handleUrlImportChange(ev.target.value)}
                                    type="text" 
                                    onFocus={(ev) => ev.target.select()}
                                />
                                <BaseButton 
                                    text='Import From Url' 
                                    type='green' 
                                    disabled={!props.urlImportValue}
                                    classes={styles.button_input} 
                                    onClick={props.onUrlImportSubmit}
                                />
                            </div>
                        </div>
                    }
					{getHeaderType(props.state) === 'processing' && 
                        <BaseButton text='Cancel Import' type='green' classes={styles.button_flex} onClick={props.onCancel} />
                    }
				</div>
				<div className={css(styles.separator)}></div>
			</div>)
}

export default Import_header
import React from 'react'
import { StyleSheet, css } from 'aphrodite'
import BaseLink from '../buttons/Base_Link'
import Variables from '../../helpers/styles/variables'
import {
    goToPreview, 
    goToPlayer, 
    goToImportFile,
    goToAnnotations,
    goToComps,
    goToReports,
    goToSupportedFeatures,
} from '../../redux/actions/compositionActions'
import {connect} from 'react-redux'
import {routes} from '../../redux/reducers/routes'

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
        display: 'flex',
        alignItems:'center'
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
    	marginTop: '10px',
    	marginBottom: '10px'
    }
})

function BaseHeader(props) {
	return (<div className={css(styles.container)}>
				<div className={css(styles.buttons_container)}>
                    <BaseLink
                        text='Compositions'
                        type='gray'
                        classes={styles.right}
                        onClick={props.goToComps}
                        selected={props.currentRoute === routes.compositions}
                    />
					<BaseLink
                        text='Preview'
                        type='gray'
                        classes={styles.button}
                        onClick={props.goToPreview}
                        selected={props.currentRoute === routes.preview}
                    />
                    <BaseLink
                        text='Import Lottie Animation'
                        type='gray'
                        classes={styles.right}
                        onClick={props.goToImportFile}
                        selected={props.currentRoute === routes.importFile}
                    />
                    <BaseLink
                        text='Reports'
                        type='gray'
                        classes={styles.right}
                        onClick={() => props.goToReports()}
                        selected={props.currentRoute === routes.reports}
                    />
                    <BaseLink
                        text='Get the Player'
                        type='gray'
                        classes={styles.right}
                        onClick={props.goToPlayer}
                        selected={props.currentRoute === routes.player}
                    />
                    <BaseLink
                        text='Supported Features'
                        type='gray'
                        classes={styles.right}
                        onClick={props.goToSupportedFeatures}
                        selected={props.currentRoute === routes.supported_features}
                    />
                    <BaseLink
                        text='Annotations'
                        type='gray'
                        classes={styles.right}
                        onClick={props.goToAnnotations}
                        selected={props.currentRoute === routes.annotations}
                    />
                    <div className={css(styles.buttons_separator)}></div>
				</div>
                <div className={css(styles.separator)} />
			</div>)
}

function mapStateToProps(state) {
    return {
        currentRoute: state.routes.route
    }
}

const mapDispatchToProps = {
    goToComps: goToComps,
    goToPreview: goToPreview,
    goToPlayer: goToPlayer,
    goToImportFile: goToImportFile,
    goToAnnotations: goToAnnotations,
    goToReports: goToReports,
	goToSupportedFeatures: goToSupportedFeatures,
}

export default connect(mapStateToProps, mapDispatchToProps)(BaseHeader)

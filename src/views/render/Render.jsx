import React from 'react'
import {connect} from 'react-redux'
import { StyleSheet, css } from 'aphrodite'
import {
  stopRender,
  previewAnimation,
} from '../../redux/actions/renderActions'
import {goToComps, goToReports} from '../../redux/actions/compositionActions'
import render_selector from '../../redux/selectors/render_selector'
import RenderItem from './list/RenderItem'
import BaseButton from '../../components/buttons/Base_button'
import Variables from '../../helpers/styles/variables'
import {
  goToFolder,
} from '../../helpers/CompositionsProvider'
import Bodymovin from '../../components/bodymovin/bodymovin'
import fluido from '../../assets/animations/fluido.json'

const styles = StyleSheet.create({
    wrapper: {
      width: '100%',
      height: '100%',
      padding: '10px',
      backgroundColor: '#474747'
    },
    container: {
      width: '100%',
      height: '100%',
      fontSize: '12px',
      color: Variables.colors.white,
      display: 'flex',
      flexDirection: 'column'
    },
    header: {
      width: '100%',
      color: Variables.colors.white,
      flexGrow: 0,
      marginBottom: '10px',
      height: '40px'
    },
    message: {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      color: Variables.colors.white,
      display: 'inline-block',
      fontSize: '12px',
      fontFamily: 'Roboto-Bold',
      verticalAlign: 'middle'
    },
    headerAnim: {
    	width: '50px',
      height: '100%',
      display: 'inline-block',
      verticalAlign: 'middle'
    },
    renderBar: {
      borderRadius:'4px',
      height:'8px',
      width: '100%',
      overflow: 'hidden',
      position:'relative',
      flexGrow: 0,
			marginBottom: '20px'
    },
    renderBarBackground: {
      borderRadius:'4px',
      height:'100%',
      width: '100%',
      backgroundColor: '#303030'
    },
    renderBarProgress: {
      borderRadius:'4px',
      height:'100%',
      width: '100%',
      position: 'absolute',
      top:0,
      left:0,
			background: 'linear-gradient(left, rgb(0,142,211) 15%,rgb(0,182,72) 85%)'
    },
    compsListContainer: {
      width: '100%',
      background: 'black',
      flexGrow: 1,
      overflow: 'hidden',
      position: 'relative'
    },
    compsList: {
      width: '100%',
      height: '100%',
      position: 'absolute',
      top: '0',
      left: '0',
      overflow: 'auto'
    },
    bottomNavigation: {
      borderRadius:'4px',
      width: '100%',
      flexGrow: 0,
      height: '40px',
      marginBottom: '20px',
      marginTop: '20px',
      textAlign: 'center'
    },
    templateModal: {
      width: '100%',
      height: '100%',
      position: 'absolute',
      top: '0',
      left: '0',
      padding: '20px',
      backgroundColor: 'rgba(0,0,0,0.75)',

    },
    templateModalContent: {
      width: '100%',
      height: '100%',
      backgroundColor: '#474747',
      padding: '8px',
    },
    templateModalContentTitle: {
      color: Variables.colors.white,
      fontSize: '16px',
      marginBottom: '24px',
    },
    templateModalContentList: {
      color: Variables.colors.white,
      fontSize: '12px',
    },
    templateModalContentListItem: {
      color: Variables.colors.green,
      textDecoration: 'underline',
      backgroundColor: Variables.colors.gray_darkest,
      padding: '8px 4px',
      margin: '4px 0',
    },
})

class Render extends React.Component {

  constructor() {
    super()
    this.endRender = this.endRender.bind(this)
    this.getItem = this.getItem.bind(this)
    this.state = {
      template: null,
    }
  }

  getItem(item) {
    return (
      <RenderItem 
        key={item.id} 
        item={item}
        navigateToFolder={this.navigateToFolder} 
        navigateToReports={this.props.goToReports} 
        preview={this.preview} 
        template={this.template} 
      />)
  }

	getItems() {
		return this.props.renderingItems.map(this.getItem)
	}

  endRender() {
    if(!this.props.render.finished) {
      this.props.stopRender()
    } else {
      this.props.goToComps()
    }
    //browserHistory.push('/')
  }

  navigateToFolder(item) {
    goToFolder(item.destination)
  }

  preview = (item) => {
    this.props.previewAnimation(item.destination)
  }

  template = (item) => {
    this.setState({
      template: item,
    })
  }

  closeTemplate = () => {
    this.setState({
      template: null,
    })
  }


  render() {
  	let progress = this.props.render.progress
  	let barStyle = {'transform':'translateX(-' + 100  * (1 - progress) + '%)'}
    let finishText = this.props.render.finished ? 'Done' : 'Cancel'
    return (
    	<div className={css(styles.wrapper)}>
    		<div className={css(styles.container)}>
          <div className={css(styles.header)}>
            <Bodymovin animationData={fluido} autoplay={true} loop={true}>
              <div className={css(styles.headerAnim)}></div>
            </Bodymovin>
    		    <div className={css(styles.message)}>{this.props.render.message}</div>
          </div>
    			<div className={css(styles.renderBar)}>
    				<div className={css(styles.renderBarBackground)} />
    				<div className={css(styles.renderBarProgress)} style={barStyle} />
    			</div>
          <div className={css(styles.compsListContainer)}>
  	    		<ul className={css(styles.compsList)}>
  	    			{this.getItems()}
            </ul>
	    		</div>
	    		<div className={css(styles.bottomNavigation)}>
	    			<BaseButton text={finishText} type='green' onClick={this.endRender}></BaseButton>
	    		</div>
    		</div>
        {this.state.template && <div className={css(styles.templateModal)} onClick={this.closeTemplate}>
          <div className={css(styles.templateModalContent)}>
            <div className={css(styles.templateModalContentTitle)}>The animation has some missing features:</div>
            <ul className={css(styles.templateModalContentList)}>
              <li className={css(styles.templateModalContentListItem)}>Metadata has not the right labels</li>
              <li className={css(styles.templateModalContentListItem)}>Total colors exceed the maximum allowed colors</li>
              <li className={css(styles.templateModalContentListItem)}>Colors don't match the palette</li>
              <li className={css(styles.templateModalContentListItem)}>Text layer is missing the right naming convention</li>
            </ul>
          </div>
        </div>}
    	</div>
    	);
  }
}

function mapStateToProps(state) {
  return render_selector(state)
}

const mapDispatchToProps = {
  stopRender: stopRender,
  goToComps: goToComps,
  goToReports: goToReports,
  previewAnimation: previewAnimation,
}

export default connect(mapStateToProps, mapDispatchToProps)(Render)

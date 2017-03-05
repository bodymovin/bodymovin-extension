import React from 'react'
import { StyleSheet, css } from 'aphrodite'
import BodymovinCheckbox from '../../../components/bodymovin/bodymovin_checkbox'
import anim from '../../../assets/animations/checkbox.json'
import Variables from '../../../helpers/styles/variables'

const styles = StyleSheet.create({
	wrapper:{
		marginTop: '5px',
		marginBottom: '15px',
		borderBottom: '2px solid ' +  Variables.colors.gray_lighter
	},
	originSelect: {
      display:'inline-block',
      verticalAlign:'middle',
      paddingBottom: '10px',
      marginRight: '15px'

    },
    'originSelect--radio': {
      width: '20px',
      padding:'2px',
      background:'none',
      display:'inline-block',
      verticalAlign:'middle',
      	':focus':{
      		border:'none',
      		outline:'none'
      	}
    },
    'originSelect--label': {
  		display:'inline-block',
		verticalAlign:'middle',
		color:'white',
		fontSize: '10px'
    },
    inputLabel:{
    	color:'white',
    	fontSize: '10px'
    },
    inputBox:{
    	color:'white',
    	width:'100%',
      	border: '1px solid ' + Variables.colors.white,
  		backgroundColor: Variables.colors.gray_darkest,
      	borderRadius: '6px',
      	lineHeight:'20px',
      	padding: '2px',
      	':focus':{
      		outline:'none'
      	}
    },
    inputBlock:{
    	padding: '0 4px 10px 4px'
    },
    halfBlock:{
    	width:'50%',
      	display: 'inline-block'
    },
    fontNameTitle: {
    	color: Variables.colors.white,
    	fontFamily: 'Roboto-Bold',
    	fontSize: '12px',
    	padding: '0 4px 10px 4px'
    }
})

let FontForm = function(props) {
	return (
		<div className={css(styles.wrapper)}>
			<div>
				<p className={css(styles.fontNameTitle)}>{props.data.fName}</p>
				<ul>
					<li className={css(styles.originSelect)} onClick={()=>props.changeOrigin(0, props.data)}>
						<BodymovinCheckbox animationData={anim} animate={props.data.origin === 0} autoplay={false} loop={false} >
				          <button className={css(styles['originSelect--radio'])}></button>
				        </BodymovinCheckbox>
				        <div  className={css(styles['originSelect--label'])}>None</div>
					</li>
					<li className={css(styles.originSelect)} onClick={()=>props.changeOrigin(1, props.data)}>
						<BodymovinCheckbox animationData={anim} animate={props.data.origin === 1} autoplay={false} loop={false} >
				          <button className={css(styles['originSelect--radio'])}></button>
				        </BodymovinCheckbox>
				        <div  className={css(styles['originSelect--label'])}>Google Font</div>
					</li>
					<li className={css(styles.originSelect)} onClick={()=>props.changeOrigin(2, props.data)}>
						<BodymovinCheckbox animationData={anim} animate={props.data.origin === 2} autoplay={false} loop={false} >
				          <button className={css(styles['originSelect--radio'])}></button>
				        </BodymovinCheckbox>
				        <div  className={css(styles['originSelect--label'])}>Typekit</div>
					</li>
					<li className={css(styles.originSelect)} onClick={()=>props.changeOrigin(3, props.data)}>
						<BodymovinCheckbox animationData={anim} animate={props.data.origin === 3} autoplay={false} loop={false} >
				          <button className={css(styles['originSelect--radio'])}></button>
				        </BodymovinCheckbox>
				        <div  className={css(styles['originSelect--label'])}>URL</div>
					</li>
				</ul>
				<div className={css(styles.inputBlock)}>
					<div className={css(styles.inputLabel)}>CSS Class</div>
					<input 
						className={css(styles.inputBox)} 
						type="text" 
						onChange={(ev)=>props.updateInput(ev.target.value, 'fClass', props.data)}
						value={props.data.fClass}/>
				</div>
				<div className={css(styles.inputBlock)}>
					<div className={css(styles.inputLabel)}>Font Path</div>
					<input 
						className={css(styles.inputBox)} 
						type="text" 
						onChange={(ev)=>props.updateInput(ev.target.value, 'fPath', props.data)}
						value={props.data.fPath}/>
				</div>
				<div className={css(styles.inputBlock)}>
					<div className={css(styles.inputLabel)}>Font Family</div>
					<input 
						className={css(styles.inputBox)} 
						type="text" 
						onChange={(ev)=>props.updateInput(ev.target.value, 'fFamily', props.data)}
						value={props.data.fFamily}/>
				</div>
				<div className={css(styles.inputBlock, styles.halfBlock)}>
					<div className={css(styles.inputLabel)}>Font Weight</div>
					<input 
						className={css(styles.inputBox)} 
						type="text" 
						onChange={(ev)=>props.updateInput(ev.target.value, 'fWeight', props.data)}
						value={props.data.fWeight}/>
				</div>
				<div className={css(styles.inputBlock, styles.halfBlock)}>
					<div className={css(styles.inputLabel)}>Font Style</div>
					<input 
						className={css(styles.inputBox)} 
						type="text" 
						onChange={(ev)=>props.updateInput(ev.target.value, 'fStyle', props.data)}
						value={props.data.fStyle}/>
				</div>
			</div>
		</div>
	)
}

export default FontForm
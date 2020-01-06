import React from 'react'
import { StyleSheet, css } from 'aphrodite'
import {baseStyles} from './alertStyles'
import Variables from '../../../helpers/styles/variables'
import {rgbToHex} from '../../../helpers/colorConverter'

const styles = StyleSheet.create({
	...baseStyles,
	gradient_message_text: {
		marginTop: '10px',
	},
	gradient_title: {
		fontSize: '16px',
		fontWeight: '900',
		padding: '4px 0 0 0',
	},
	gradient_keyframe: {
		fontSize: '14px',
		fontWeight: '900',
		padding: '10px 10px',
		margin: '0 0 10px 0',
		border: '1px solid ' + Variables.colors.blue,
	},
	gradient_keyframe_title: {
		color: Variables.colors.blue,
	},
	gradient_position: {
		marginTop: '4px',
		fontSize: '14px',
		padding: '2px 6px',
		border: '1px solid ' + Variables.colors.blue,
	},
	gradient_item: {
		padding: '2px 0',
	},
})

function GradientAlert(props) {
	const alertData = props.data;
	return (
		<div className={css(styles.alert_message)}>
			<div className={css(styles.alert_message_text)}>
				{alertData.message}
			</div>

			{!!alertData.layer &&
				<div className={css(styles.alert_message_label)}>
					<span className={css(styles.alert_message_label_span)}>Layer:</span> {alertData.layer}
				</div>
			}
			{!!alertData.comp &&
				<div className={css(styles.alert_message_label)}>
					<span className={css(styles.alert_message_label_span)}>Composition:</span> {alertData.comp}
				</div>
			}
			<div className={css(styles.alert_message_text, styles.gradient_message_text)}>
				For each keyframe you need to insert this values:
			</div>
			{/* COLORS START */}
			<div className={css(styles.gradient_title)}>COLORS:</div>
			{
				alertData.colorData.colors.map((colorList, index) => {
					return (
						<div className={css(styles.gradient_keyframe)}
							key={index}
						>
							<div 
								className={css(styles.gradient_keyframe_title)}
							>
								At Keyframe {index + 1}
							</div>
							{
								colorList.map((colorItem, colorItemIndex) => 
									(
										<div 
											key={colorItemIndex}
											 className={css(styles.gradient_position)}
										>
											<div className={css(styles.gradient_item)}>Handler position: 
												<span> {colorItem.p} %</span>
											</div>
											<div className={css(styles.gradient_item)}>
												Red: 
												<span> {colorItem.r}</span>
											</div>
											<div className={css(styles.gradient_item)}>
												Green: 
												<span> {colorItem.g}</span>
											</div>
											<div className={css(styles.gradient_item)}>
												Blue: 
												<span> {colorItem.b}</span>
											</div>
											<div className={css(styles.gradient_item)}>
												HEX: 
												<span> {rgbToHex(Math.round(colorItem.r), Math.round(colorItem.g), Math.round(colorItem.b))}</span>
											</div>
										</div>
									)
								)
							}
							
						</div>
					)
				})
			}
			{/* COLORS END */}
			{/* ALPHAS START */}
			{!!alertData.colorData.alphas.length && <div className={css(styles.gradient_title)}>ALPHAS:</div>}
			{!!alertData.colorData.alphas.length && 
				alertData.colorData.alphas.map((colorList, index) => {
					return (
						<div className={css(styles.gradient_keyframe)}
							key={index}
						>
							<div 
								className={css(styles.gradient_keyframe_title)}
							>
								At Keyframe {index + 1}
							</div>
							{
								colorList.map((colorItem, colorItemIndex) => 
									(
										<div 
											key={colorItemIndex}
											 className={css(styles.gradient_position)}
										>
											<div className={css(styles.gradient_item)}>Handler position: 
												<span> {colorItem.p} %</span>
											</div>
											<div className={css(styles.gradient_item)}>
												Alpha Value: 
												<span> {colorItem.a}</span>
											</div>
										</div>
									)
								)
							}
							
						</div>
					)
				})
			}
			{/* COLORS END */}
		</div>
	)
}

export default GradientAlert
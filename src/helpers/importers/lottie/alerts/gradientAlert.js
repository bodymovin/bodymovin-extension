function buildGradientKeyframes(gradientData) {
	// console.log(gradientData)
	const totalPositions = gradientData.p;
	const colors = [];
	const alphas = [];
	gradientData.k.k.forEach(gradient => {
		// console.log(gradient);
		const gradientValue = gradient.s;
		const colorList = [];
		let count = 0, index = 0;
		while (count < totalPositions) {
			index = count * 4;
			colorList.push({
				p: Math.round(100 * gradientValue[index + 0] * 100) / 100,
				r: Math.round(gradientValue[index + 1] * 255 * 100) / 100,
				g: Math.round(gradientValue[index + 2] * 255 * 100) / 100,
				b: Math.round(gradientValue[index + 3] * 255 * 100) / 100,
			})
			count += 1;
		}
		colors.push(colorList)

		if (gradientValue / 4 !== totalPositions) {

		}
	});
	return {
		colors,
		alphas,
	}
}

function buildAlert(layerData) {
	return {
		type: 'gradient',
		message: `Gradient data can't be imported. You will need to fill it manually.`,
		colorData: buildGradientKeyframes(layerData.g),
	}
}

export default buildAlert
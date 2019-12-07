const versions = [
	{
		name: 'Full',
		value: 'full',
		fileSize: '60Kb',
		cdnjs: 'https://cdnjs.cloudflare.com/ajax/libs/bodymovin/5.5.9/lottie.min.js',
		local: 'lottie.min.js',
		renderers: ['svg', 'canvas', 'html'],
	},
	{
		name: 'Svg Full (Full svg renderer)',
		value: 'svg_full',
		fileSize: '60Kb',
		cdnjs: 'https://cdnjs.cloudflare.com/ajax/libs/bodymovin/5.5.9/lottie_svg.min.js',
		local: 'lottie_svg.min.js',
		renderers: ['svg'],
	},
	{
		name: 'Svg Light (Svg renderer, no expressions or effects)',
		value: 'svg_light',
		fileSize: '60Kb',
		cdnjs: 'https://cdnjs.cloudflare.com/ajax/libs/bodymovin/5.5.9/lottie_light.min.js',
		local: 'lottie_light.min.js',
		renderers: ['svg'],
	},
	{
		name: 'Canvas Full (Full canvas renderer)',
		value: 'canvas_full',
		fileSize: '60Kb',
		cdnjs: 'https://cdnjs.cloudflare.com/ajax/libs/bodymovin/5.5.9/lottie_canvas.min.js',
		local: 'lottie_canvas.min.js',
		renderers: ['canvas'],
	},
	{
		name: 'Canvas Light (Canvas renderer, no expressions or effects)',
		value: 'canvas_light',
		fileSize: '60Kb',
		cdnjs: 'https://cdnjs.cloudflare.com/ajax/libs/bodymovin/5.5.9/lottie_light_canvas.min.js',
		local: 'lottie_light_canvas.min.js',
		renderers: ['canvas'],
	}
]

function findLottieVersion(value) {
	return versions.find(version => version.value === value) 
}

export default versions

export {
	findLottieVersion
}
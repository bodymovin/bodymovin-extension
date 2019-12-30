function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

function hexToRgbAsNormalizedArray(hex) {
	const color = hexToRgb(hex)
	return [color.r / 255, color.g / 255, color.b / 255]
}

export {
	hexToRgb,
	hexToRgbAsNormalizedArray,
}
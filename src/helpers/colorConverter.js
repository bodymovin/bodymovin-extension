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

function rgbToHex(r, g, b) {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

export {
	hexToRgb,
	hexToRgbAsNormalizedArray,
  rgbToHex,
}
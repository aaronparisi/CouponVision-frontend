import rgbHex from 'rgb-hex'

export const maybeFaded = (color, hoverColor) => {
  if (color[0] === "#") {
    if (!hoverColor || color === hoverColor) {
      return color
    } else {
      return color + "22"
    }
  } else {
    if (!hoverColor || color === hoverColor) {
      return `#${rgbHex(color)}`
    } else {
      return `#${rgbHex(color)}` + "22"
    }
  }
}
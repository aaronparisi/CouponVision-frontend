import {
  RECEIVE_COUPON_COUNTS_BY_BRAND_PER_GROCER,
  RECEIVE_COUPONS_BY_BRAND_PER_GROCER
} from '../actions/grocers_actions'

var randomColor = require('random-color');
var cd = require('color-difference')

const _nullColors = {
  activeOverTimeColors: [],
  countsByBrandColors: []
}

const genColors = numColors => {
  // returns an array of hex colors,
  // ensuring "sufficienty" differentiation in colors
  const colors = []
  const diffIdx = 20
  let i = 0

  while (colors.length < numColors) {
    if (i > numColors*10) {
      // let's just start over
      colors.filter(el => true)
      i = 0
    }
    const toAdd = randomColor(0.99, 0.99).hexString()

    if (colors.every(color => cd.compare(color, toAdd) > diffIdx)) {
      colors.push(toAdd)
    }

    i += 1
  }

  return colors
}

const colorsReducer = (state = _nullColors, action) => {
  Object.freeze(state)

  const colors = genColors(action.numColors)
  switch(action.type) {
    case RECEIVE_COUPON_COUNTS_BY_BRAND_PER_GROCER:
      return {
        ...state,
        countsByBrandColors: colors
      }
    case RECEIVE_COUPONS_BY_BRAND_PER_GROCER:
      return {
        ...state,
        activeOverTimeColors: colors
      }
    default:
      return state;
  }
}

export default colorsReducer
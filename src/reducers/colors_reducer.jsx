import {
  RECEIVE_COUPON_COUNTS_BY_BRAND_PER_GROCER,
  RECEIVE_COUPONS_BY_BRAND_PER_GROCER
} from '../actions/grocers_actions'

var randomColor = require('random-color');
var cd = require('color-difference')

const _nullColors = {
  activeOverTimeColors: {},
  countsByBrandColors: {}
}

const genColors = (grocers, numColors) => {
  // returns an array of hex colors,
  // ensuring "sufficienty" differentiation in colors
  // atodo make colors "different enough" while ensuring speed of generation
  const colors = {}
  const diffIdx = 5
  
  grocers.forEach((grocer, idx) => {
    let toAdd = randomColor(0.99, 0.99).hexString()
    
    while (Object.values(colors).some(color => cd.compare(color, toAdd) < diffIdx)) {
      toAdd = randomColor(0.99, 0.99).hexString()
    }
    colors[grocer.name] = toAdd
  })

  return colors
}

const colorsReducer = (state = _nullColors, action) => {
  Object.freeze(state)
  let colors = {}
  switch(action.type) {
    case RECEIVE_COUPON_COUNTS_BY_BRAND_PER_GROCER:
      colors = genColors(action.grocers, action.numColors)
      return {
        ...state,
        countsByBrandColors: colors
      }
    case RECEIVE_COUPONS_BY_BRAND_PER_GROCER:
      colors = genColors(action.grocers, action.numColors)
      return {
        ...state,
        activeOverTimeColors: colors
      }
    default:
      return state;
  }
}

export default colorsReducer
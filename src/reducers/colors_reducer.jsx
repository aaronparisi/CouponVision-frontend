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

const genColors = (names, numColors) => {
  // returns an array of hex colors,
  // ensuring "sufficienty" differentiation in colors
  // atodo make colors "different enough" while ensuring speed of generation
  const colors = {}
  const diffIdx = 5
  
  names.forEach(name => {
    let toAdd = randomColor(0.99, 0.99).hexString()
    
    while (Object.values(colors).some(color => cd.compare(color, toAdd) < diffIdx)) {
      toAdd = randomColor(0.99, 0.99).hexString()
    }
    colors[name] = toAdd
  })

  return colors
}

const colorsReducer = (state = _nullColors, action) => {
  Object.freeze(state)
  let colors = {}
  switch(action.type) {
    // stacked bar
    case RECEIVE_COUPON_COUNTS_BY_BRAND_PER_GROCER:
      colors = genColors(action.brands.map(brand => brand.name), action.numColors)
      return {
        ...state,
        countsByBrandColors: colors
      }
    case RECEIVE_COUPONS_BY_BRAND_PER_GROCER:
      // active over time line
      colors = genColors(action.grocers.map(grocer => grocer.name), action.numColors)
      return {
        ...state,
        activeOverTimeColors: colors
      }
    default:
      return state;
  }
}

export default colorsReducer
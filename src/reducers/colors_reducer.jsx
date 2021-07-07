import {
  RECEIVE_COUPON_COUNTS_BY_BRAND_PER_GROCER,
  RECEIVE_COUPONS_BY_BRAND_PER_GROCER
} from '../actions/grocers_actions'

import distinctColors from 'distinct-colors'

const _nullColors = {
  activeOverTimeColors: {},
  countsByBrandColors: {}
}

const genColors = (names, numColors) => {
  // returns an array of hex colors,
  // ensuring "sufficienty" differentiation in colors
  // atodo no need for numColors anymore
  const colors = distinctColors({ count: numColors }).map(color => color.hex())
  
  names.forEach((name, idx) => colors[name] = colors[idx])

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
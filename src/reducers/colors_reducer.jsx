import {
  RECEIVE_COUPON_COUNTS_BY_BRAND,
  RECEIVE_ACTIVE_COUPONS_OVER_TIME
} from '../actions/grocers_actions'

import {
  RECEIVE_SAVINGS_BY_BRAND
} from '../actions/brands_actions'

import distinctColors from 'distinct-colors'

const _nullColors = {
  activeCouponsOverTimeColors: {},
  countsByBrandColors: {},
  savingsByBrandColors: {}
}

const genColors = (names, numColors) => {
  // returns an array of hex colors,
  // ensuring "sufficienty" differentiation in colors
  // atodo no need for numColors anymore
  const colors = distinctColors({ count: numColors, lightMin: 40, lightMax: 80 }).map(color => color.hex())

  return names.reduce((ret, name, idx) => {
    return {
      ...ret,
      [name]: colors[idx]
    }
  }, {})
}

const colorsReducer = (state = _nullColors, action) => {
  Object.freeze(state)
  let colors = {}
  switch(action.type) {
    // stacked bar
    case RECEIVE_SAVINGS_BY_BRAND:
      colors = genColors(action.brands.children.map(brand => brand.name), action.numColors)
      return {
        ...state,
        savingsByBrandColors: colors
      }
    case RECEIVE_COUPON_COUNTS_BY_BRAND:
      colors = genColors(action.brands.map(brand => brand.name), action.numColors)
      return {
        ...state,
        countsByBrandColors: colors
      }
    case RECEIVE_ACTIVE_COUPONS_OVER_TIME:
      // active over time line
      colors = genColors(action.grocers.map(grocer => grocer.name), action.numColors)
      return {
        ...state,
        activeCouponsOverTimeColors: colors
      }
    default:
      return state;
  }
}

export default colorsReducer
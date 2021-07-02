import {
  RECEIVE_COUPON_COUNTS_BY_BRAND_PER_GROCER,
  RECEIVE_COUPONS_BY_BRAND_PER_GROCER
} from '../actions/grocers_actions'

var randomColor = require('randomcolor'); // import the script

const _nullColors = {
  activeOverTimeColors: [],
  countsByBrandColors: []
}

const colorsReducer = (state = _nullColors, action) => {
  Object.freeze(state)
  const colors = randomColor({
    count: action.numColors,
    // luminosity: 'bright'
  })

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
import {
  RECEIVE_COUPON_COUNTS_BY_BRAND,
} from '../actions/grocers_actions'

const _nullGrocers = {
  grocers: [],
  brands: []
}

const couponCountsByBrandReducer = (state = _nullGrocers, action) => {
  Object.freeze(state)
  
  switch(action.type) {
    case RECEIVE_COUPON_COUNTS_BY_BRAND:
      return {
        grocers: action.grocers,
        brands: action.brands
      }
    default:
      return state;
  }
}

export default couponCountsByBrandReducer
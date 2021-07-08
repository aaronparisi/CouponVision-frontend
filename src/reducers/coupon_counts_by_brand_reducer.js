import {
  RECEIVE_COUPON_COUNTS_BY_BRAND,
} from '../actions/grocers_actions'

const _nullGrocers = []

const couponCountsByBrandReducer = (state = _nullGrocers, action) => {
  Object.freeze(state)
  
  switch(action.type) {
    case RECEIVE_COUPON_COUNTS_BY_BRAND:
      return action.grocers
    default:
      return state;
  }
}

export default couponCountsByBrandReducer
import {
  RECEIVE_COUPON_COUNTS_BY_BRAND_PER_GROCER,
} from '../actions/grocers_actions'

const _nullGrocers = []

const couponCountsByBrandReducer = (state = _nullGrocers, action) => {
  Object.freeze(state)
  
  switch(action.type) {
    case RECEIVE_COUPON_COUNTS_BY_BRAND_PER_GROCER:
      return action.grocers
    default:
      return state;
  }
}

export default couponCountsByBrandReducer
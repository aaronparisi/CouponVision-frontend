import {
  RECEIVE_COUPON_COUNTS_BY_BRAND_PER_GROCER,
  RECEIVE_COUPONS_BY_BRAND_PER_GROCER
} from '../actions/grocers_actions'

const _nullGrocers = []

const grocersReducer = (state = _nullGrocers, action) => {
  Object.freeze(state)

  switch(action.type) {
    case RECEIVE_COUPON_COUNTS_BY_BRAND_PER_GROCER:
      return action.data.grocers
    case RECEIVE_COUPONS_BY_BRAND_PER_GROCER:
      return action.data.grocers
    default:
      return state;
  }
}

export default grocersReducer
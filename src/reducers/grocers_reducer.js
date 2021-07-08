import {
  RECEIVE_COUPON_COUNTS_BY_BRAND,
  RECEIVE_ACTIVE_COUPONS_OVER_TIME
} from '../actions/grocers_actions'

const _nullGrocers = []

const grocersReducer = (state = _nullGrocers, action) => {
  Object.freeze(state)

  switch(action.type) {
    case RECEIVE_COUPON_COUNTS_BY_BRAND:
      return action.grocers
    case RECEIVE_ACTIVE_COUPONS_OVER_TIME:
      return action.grocers
    default:
      return state;
  }
}

export default grocersReducer
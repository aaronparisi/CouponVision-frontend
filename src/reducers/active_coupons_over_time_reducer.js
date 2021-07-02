import {
  RECEIVE_COUPONS_BY_BRAND_PER_GROCER,
} from '../actions/grocers_actions'

const _nullGrocers = []

const activeCouponsOverTimeReducer = (state = _nullGrocers, action) => {
  Object.freeze(state)

  switch(action.type) {
    case RECEIVE_COUPONS_BY_BRAND_PER_GROCER:
      return action.grocers
    default:
      return state;
  }
}

export default activeCouponsOverTimeReducer
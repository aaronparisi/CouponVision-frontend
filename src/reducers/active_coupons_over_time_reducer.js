import {
  RECEIVE_ACTIVE_COUPONS_OVER_TIME,
} from '../actions/grocers_actions'

const _nullGrocers = []

const activeCouponsOverTimeReducer = (state = _nullGrocers, action) => {
  Object.freeze(state)

  switch(action.type) {
    case RECEIVE_ACTIVE_COUPONS_OVER_TIME:
      return action.grocers
    default:
      return state;
  }
}

export default activeCouponsOverTimeReducer
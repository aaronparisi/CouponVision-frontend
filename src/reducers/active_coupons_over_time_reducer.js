import {
  RECEIVE_ACTIVE_COUPONS_OVER_TIME,
  RECEIVE_DATE_RANGE
} from '../actions/active_coupons_over_time_actions'

const _null_data = {
  grocers: [],
  earlyDate: null,
  lateDate: null
}

const activeCouponsOverTimeReducer = (state = _null_data, action) => {
  Object.freeze(state)

  switch(action.type) {
    case RECEIVE_ACTIVE_COUPONS_OVER_TIME:
      return {
        ...state,
        grocers: action.grocers
      }
    case RECEIVE_DATE_RANGE:
      return {
        ...state,
        earlyDate: action.earlyDate,
        lateDate: action.lateDate
      }
    default:
      return state;
  }
}

export default activeCouponsOverTimeReducer
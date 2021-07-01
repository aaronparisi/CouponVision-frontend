import { 
  RECEIVE_COUPONS
} from '../actions/coupons_actions'

const _nullCoupons = {
  
}

const couponsReducer = (state = _nullCoupons, action) => {
  Object.freeze(state)

  switch(action.type) {
    case RECEIVE_COUPONS:
      // return Object.assign(
      //   {}, 
      //   state, 
      //   { currentUser: action.user })
      return action.coupons
    default:
      return state;
  }
}

export default couponsReducer
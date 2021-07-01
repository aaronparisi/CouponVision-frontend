import {
  RECEIVE_COUPON_COUNTS_BY_BRAND_PER_GROCER
} from '../actions/grocers_actions'

const _nullBrands = [
  
]

const brandsReducer = (state = _nullBrands, action) => {
  Object.freeze(state)

  switch(action.type) {
    case RECEIVE_COUPON_COUNTS_BY_BRAND_PER_GROCER:
      return action.data.brands
    default:
      return state;
  }
}

export default brandsReducer
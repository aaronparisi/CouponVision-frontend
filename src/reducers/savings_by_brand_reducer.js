import {
  RECEIVE_SAVINGS_BY_BRAND
} from '../actions/savings_by_brand_actions'

const _nullBrands = {}

const savingsByBrandReducer = (state = _nullBrands, action) => {
  Object.freeze(state)

  switch(action.type) {
    case RECEIVE_SAVINGS_BY_BRAND:
      return action.brands
    default:
      return state;
  }
}

export default savingsByBrandReducer
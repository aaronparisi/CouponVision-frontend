import {
  RECEIVE_SAVINGS_BY_BRAND,
  RECEIVE_DATE
} from '../actions/savings_by_brand_actions'

const _nullData = {
  brands: {},
  date: null
}

const savingsByBrandReducer = (state = _nullData, action) => {
  Object.freeze(state)

  switch(action.type) {
    case RECEIVE_SAVINGS_BY_BRAND:
      return {
        ...state,
        brands: action.brands
      }
    case RECEIVE_DATE:
      return {
        ...state,
        date: action.date
      }
    default:
      return state;
  }
}

export default savingsByBrandReducer
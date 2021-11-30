import {
  RECEIVE_SAVINGS_TIERS_BY_BRAND,
  RECEIVE_DATE
} from '../actions/savings_tiers_by_brand_actions'

const _nullData = {
  brands: {},
  tiers: {},
  date: null
}

const savingsByBrandReducer = (state = _nullData, action) => {
  Object.freeze(state)

  switch(action.type) {
    case RECEIVE_SAVINGS_TIERS_BY_BRAND:
      return {
        ...state,
        brands: action.brands,
        tiers: action.tiers
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
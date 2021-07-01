import { 
  RECEIVE_TOTAL_STORE_SAVINGS
} from '../actions/stores_actions'

const _nullStores = {
  
}

const storesReducer = (state = _nullStores, action) => {
  Object.freeze(state)

  switch(action.type) {
    case RECEIVE_TOTAL_STORE_SAVINGS:
      return action.stores
    default:
      return state;
  }
}

export default storesReducer
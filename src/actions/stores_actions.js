import * as storesApiUtil from '../utils/stores_util'
import { history } from '../index'

export const RECEIVE_TOTAL_STORE_SAVINGS = 'RECEIVE_TOTAL_STORE_SAVINGS'

export const receiveTotalStoreSavings = stores => {
  return {
    type: RECEIVE_TOTAL_STORE_SAVINGS,
    stores
  }
}

// thunk stuff - will be exported to containers

export const getTotalStoreSavings = () => dispatch => {
  return storesApiUtil.getTotalStoreSavings()
  .then(
    stores => {
      if (stores.data !== '') {
        dispatch(receiveTotalStoreSavings(stores.data))
      }
      return stores
    },
    err => {
      console.log('error getting total store savings')
    }
  )
}
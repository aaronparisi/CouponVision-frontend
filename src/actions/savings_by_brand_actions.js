import * as apiUtil from '../utils/api_util'
import { receiveLoadingInfo } from './loading_actions'

export const RECEIVE_SAVINGS_BY_BRAND = 'RECEIVE_SAVINGS_BY_BRAND'

export const receiveSavingsByBrand = data => {
  return {
    type: RECEIVE_SAVINGS_BY_BRAND,
    grocers: data.grocers,
    brands: data.brands,
    numColors: data.numColors
  }
}

// thunk stuff - will be exported to containers

export const getSavingsByBrand = () => dispatch => {
  dispatch(receiveLoadingInfo(true))
  return apiUtil.getSavingsByBrand()
  .then(
    savingsByBrandData => {
      /*
      atodo display the shape of this data...
      */
      if (savingsByBrandData.data !== '') {
        const dataWithColors = {
          brands: savingsByBrandData.data,
          numColors: savingsByBrandData.data.children.length  // this chart needs colors per brand
        }
        dispatch(receiveSavingsByBrand(dataWithColors))
        dispatch(receiveLoadingInfo(false))
      }
      return savingsByBrandData
    },
    err => {
      console.log('error getting coupons by brand per grocer')
    }
  )
}
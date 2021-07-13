import * as apiUtil from '../utils/api_util'
import { receiveLoadingInfo } from './loading_actions'

export const RECEIVE_COUPON_COUNTS_BY_BRAND = 'RECEIVE_COUPON_COUNTS_BY_BRAND'

export const receiveCouponsByBrand = data => {
  return {
    type: RECEIVE_COUPON_COUNTS_BY_BRAND,
    grocers: data.grocers,
    brands: data.brands,
    numColors: data.numColors
  }
}

// thunk stuff - will be exported to containers

// for stacked bar
export const getCouponCountsByBrand = () => dispatch => {
  dispatch(receiveLoadingInfo(true))
  return apiUtil.getCouponCountsByBrand()
  .then(
    couponCountsByBrandData => {
      /*
      data is an array of objects containing a grocer and their coupon counts per brand:
      [
        { 1: 2, 2: 4, 9: 0, grocer_name: "Albertson's"},
        {},
        ...
      ]
      */
      if (couponCountsByBrandData.data !== '') {
        const data = {
          grocers: couponCountsByBrandData.data.grocers,
          brands: couponCountsByBrandData.data.brands
        }
        dispatch(receiveCouponsByBrand(data))
        dispatch(receiveLoadingInfo(false))
      }
      return couponCountsByBrandData
    },
    err => {
      console.log('error getting coupons by brand per grocer')
    }
  )
}
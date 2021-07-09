import * as grocersApiUtil from '../utils/grocers_util'

export const RECEIVE_COUPON_COUNTS_BY_BRAND = 'RECEIVE_COUPON_COUNTS_BY_BRAND'
export const RECEIVE_ACTIVE_COUPONS_OVER_TIME = 'RECEIVE_ACTIVE_COUPONS_OVER_TIME'
export const RECEIVE_LOADING_INFO = 'RECEIVE_LOADING_INFO'

export const receiveLoadingInfo = loading => {
  return {
    type: RECEIVE_LOADING_INFO,
    loading: loading
  }
}

export const receiveCouponsByBrand = data => {
  return {
    type: RECEIVE_COUPON_COUNTS_BY_BRAND,
    grocers: data.grocers,
    brands: data.brands,
    numColors: data.numColors
  }
}

export const receiveActiveCouponsOverTime = data => {
  return {
    type: RECEIVE_ACTIVE_COUPONS_OVER_TIME,
    grocers: data.grocers,
    numColors: data.numColors
  }
}

// thunk stuff - will be exported to containers

// for stacked bar
export const getCouponCountsByBrand = () => dispatch => {
  return grocersApiUtil.getCouponCountsByBrand()
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
        const dataWithColors = {
          grocers: couponCountsByBrandData.data.grocers,
          brands: couponCountsByBrandData.data.brands,
          numColors: couponCountsByBrandData.data.brands.length  // this chart needs colors per brand
        }
        dispatch(receiveCouponsByBrand(dataWithColors))
      }
      return couponCountsByBrandData
    },
    err => {
      console.log('error getting coupons by brand per grocer')
    }
  )
}

// for line with time slider
export const getActiveCouponsOverTime = () => dispatch => {
  dispatch(receiveLoadingInfo(true))
  return grocersApiUtil.getActiveCouponsOverTime()
  .then(
    activeCouponsOverTimeData => {
      // data is an array of objects
      /*
      [
        { name: "Albertson's", 
          coupons: [{activation_date: ..., expiration_date: ...}, {}, ...] 
        }, 
        { name: "QFC",
          coupons: [...]
        },
         ...
      ]
      */
      if (activeCouponsOverTimeData.data !== '') {
        const dataWithColors = {
          grocers: activeCouponsOverTimeData.data.grocers,
          numColors: activeCouponsOverTimeData.data.grocers.length  // this one needs colors per grocer
        }
        dispatch(receiveActiveCouponsOverTime(dataWithColors))
        dispatch(receiveLoadingInfo(false))
      }
      return activeCouponsOverTimeData
    },
    err => {
      console.log('error getting coupons by brand per grocer')
    }
  )
}
import * as grocersApiUtil from '../utils/grocers_util'

export const RECEIVE_COUPON_COUNTS_BY_BRAND = 'RECEIVE_COUPON_COUNTS_BY_BRAND'
export const RECEIVE_ACTIVE_COUPONS_OVER_TIME = 'RECEIVE_ACTIVE_COUPONS_OVER_TIME'

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
    brands: data.brands,
    numColors: data.numColors
  }
}

// thunk stuff - will be exported to containers

// for stacked bar
export const getCouponCountsByBrand = () => dispatch => {
  return grocersApiUtil.getCouponCountsByBrand()
  .then(
    couponCountsByBrandData => {
      if (couponCountsByBrandData.data !== '') {
        const addColors = {
          grocers: couponCountsByBrandData.data.grocers,
          brands: couponCountsByBrandData.data.brands,
          numColors: couponCountsByBrandData.data.brands.length  // this chart needs colors per brand
        }
        dispatch(receiveCouponsByBrand(addColors))
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
  return grocersApiUtil.getActiveCouponsOverTime()
  .then(
    activeCouponsOverTimeData => {
      if (activeCouponsOverTimeData.data !== '') {
        const addColors = {
          grocers: activeCouponsOverTimeData.data.grocers,
          brands: activeCouponsOverTimeData.data.brands,
          numColors: activeCouponsOverTimeData.data.grocers.length  // this one needs colors per grocer
        }
        dispatch(receiveActiveCouponsOverTime(addColors))
      }
      return activeCouponsOverTimeData
    },
    err => {
      console.log('error getting coupons by brand per grocer')
    }
  )
}
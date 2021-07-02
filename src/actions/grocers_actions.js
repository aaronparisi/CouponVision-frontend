import * as grocersApiUtil from '../utils/grocers_util'

export const RECEIVE_COUPON_COUNTS_BY_BRAND_PER_GROCER = 'RECEIVE_COUPON_COUNTS_BY_BRAND_PER_GROCER'
export const RECEIVE_COUPONS_BY_BRAND_PER_GROCER = 'RECEIVE_COUPONS_BY_BRAND_PER_GROCER'

export const receiveCouponCountsByBrandPerGrocer = data => {
  return {
    type: RECEIVE_COUPON_COUNTS_BY_BRAND_PER_GROCER,
    data
  }
}

export const receiveCouponsByBrandPerGrocer = data => {
  return {
    type: RECEIVE_COUPONS_BY_BRAND_PER_GROCER,
    data
  }
}

// thunk stuff - will be exported to containers

// for stacked bar
export const getCouponCountsByBrandPerGrocer = () => dispatch => {
  return grocersApiUtil.getCouponCountsByBrandPerGrocer()
  .then(
    couponCountsByBrandData => {
      if (couponCountsByBrandData.data !== '') {
        dispatch(receiveCouponCountsByBrandPerGrocer(couponCountsByBrandData.data))
      }
      return couponCountsByBrandData
    },
    err => {
      console.log('error getting coupons by brand per grocer')
    }
  )
}

// for line with time slider
export const getCouponsByBrandPerGrocer = () => dispatch => {
  return grocersApiUtil.getCouponsByBrandPerGrocer()
  .then(
    couponByBrandData => {
      if (couponByBrandData.data !== '') {
        dispatch(receiveCouponsByBrandPerGrocer(couponByBrandData.data))
      }
      return couponByBrandData
    },
    err => {
      console.log('error getting coupons by brand per grocer')
    }
  )
}
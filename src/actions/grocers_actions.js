import * as grocersApiUtil from '../utils/grocers_util'

export const RECEIVE_COUPON_COUNTS_BY_BRAND_PER_GROCER = 'RECEIVE_COUPON_COUNTS_BY_BRAND_PER_GROCER'
export const RECEIVE_COUPONS_BY_BRAND_PER_GROCER = 'RECEIVE_COUPONS_BY_BRAND_PER_GROCER'

export const receiveCouponCountsByBrandPerGrocer = data => {
  return {
    type: RECEIVE_COUPON_COUNTS_BY_BRAND_PER_GROCER,
    grocers: data.grocers,
    brands: data.brands,
    numColors: data.numColors
  }
}

export const receiveCouponsByBrandPerGrocer = data => {
  return {
    type: RECEIVE_COUPONS_BY_BRAND_PER_GROCER,
    grocers: data.grocers,
    brands: data.brands,
    numColors: data.numColors
  }
}

// thunk stuff - will be exported to containers

// for stacked bar
export const getCouponCountsByBrandPerGrocer = () => dispatch => {
  return grocersApiUtil.getCouponCountsByBrandPerGrocer()
  .then(
    couponCountsByBrandData => {
      if (couponCountsByBrandData.data !== '') {
        const addColors = {
          grocers: couponCountsByBrandData.data.grocers,
          brands: couponCountsByBrandData.data.brands,
          numColors: couponCountsByBrandData.data.brands.length  // ! this chart needs colors per brand
        }
        console.log(addColors.numColors)
        dispatch(receiveCouponCountsByBrandPerGrocer(addColors))
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
    couponsByBrandData => {
      if (couponsByBrandData.data !== '') {
        const addColors = {
          grocers: couponsByBrandData.data.grocers,
          brands: couponsByBrandData.data.brands,
          numColors: couponsByBrandData.data.grocers.length  // ! this one needs colors per grocer
        }
        console.log(addColors.numColors)
        dispatch(receiveCouponsByBrandPerGrocer(addColors))
      }
      return couponsByBrandData
    },
    err => {
      console.log('error getting coupons by brand per grocer')
    }
  )
}
import * as couponsApiUtil from '../utils/coupons_util'

export const RECEIVE_COUPONS = 'RECEIVE_COUPONS'

export const receiveCoupons = coupons => {
  return {
    type: RECEIVE_COUPONS,
    coupons
  }
}

// thunk stuff - will be exported to containers

export const getAllCoupons = () => dispatch => {
  return couponsApiUtil.getAllCoupons()
  .then(
    coupons => {
      if (coupons.data !== '') {
        dispatch(receiveCoupons(coupons.data))
      }
      return coupons
    },
    err => {
      console.log('error getting coupons')
    }
  )
}
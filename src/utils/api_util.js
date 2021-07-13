import { axiosIns } from "../index"

export const getCouponCountsByBrand = () => {
  return axiosIns({
    method: 'get',
    url: '/api/coupon_counts_by_brand',
  })
}

export const getActiveCouponsOverTime = () => {
  return axiosIns({
    method: 'get',
    url: '/api/active_coupons_over_time',
  })
}

export const getSavingsByBrand = () => {
  return axiosIns({
    method: 'get',
    url: '/api/savings_by_brand',
  })
}
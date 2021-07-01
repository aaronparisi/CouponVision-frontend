import { axiosIns } from "../index"

export const getCouponCountsByBrandPerGrocer = () => {
  return axiosIns({
    method: 'get',
    url: '/api/grocers/coupon_counts_by_brand_per_grocer',
  })
}

export const getCouponsByBrandPerGrocer = () => {
  return axiosIns({
    method: 'get',
    url: '/api/grocers/coupons_by_brand_per_grocer',
  })
}
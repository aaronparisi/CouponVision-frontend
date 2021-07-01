import { axiosIns } from "../index"

export const getAllCoupons = () => {
  return axiosIns({
    method: 'get',
    url: '/api/coupons',
  })
}
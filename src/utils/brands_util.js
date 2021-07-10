import { axiosIns } from "../index"

export const getSavingsByBrand = () => {
  return axiosIns({
    method: 'get',
    url: '/api/savings_by_brand',
  })
}
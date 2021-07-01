import { axiosIns } from "../index"

export const getTotalStoreSavings = () => {
  return axiosIns({
    method: 'get',
    url: '/api/stores/total_savings',
  })
}
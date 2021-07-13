import * as apiUtil from '../utils/api_util'
import { receiveLoadingInfo } from './loading_actions'

export const RECEIVE_ACTIVE_COUPONS_OVER_TIME = 'RECEIVE_ACTIVE_COUPONS_OVER_TIME'
export const RECEIVE_DATE_RANGE = 'RECEIVE_DATE_RANGE'

export const receiveDateRange = data => {
  return {
    type: RECEIVE_DATE_RANGE,
    earlyDate: data[0],
    lateDate: data[1]
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

// for line with time slider
export const getActiveCouponsOverTime = () => dispatch => {
  dispatch(receiveLoadingInfo(true))
  return apiUtil.getActiveCouponsOverTime()
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
        const data = {
          grocers: activeCouponsOverTimeData.data.grocers
        }
        dispatch(receiveActiveCouponsOverTime(data))
        dispatch(receiveLoadingInfo(false))
      }
      return activeCouponsOverTimeData
    },
    err => {
      console.log('error getting coupons by brand per grocer')
    }
  )
}
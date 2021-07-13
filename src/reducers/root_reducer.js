import { combineReducers } from 'redux';
import activeCouponsOverTimeReducer from './active_coupons_over_time_reducer'
import couponCountsByBrandReducer from './coupon_counts_by_brand_reducer'
import savingsByBrandReducer from './savings_by_brand_reducer'
import loadingReducer from './loading_reducer'

export default combineReducers({
  activeCouponsOverTime: activeCouponsOverTimeReducer,
  couponCountsByBrand: couponCountsByBrandReducer,
  savingsByBrand: savingsByBrandReducer,
  loading: loadingReducer
});
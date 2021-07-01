import { combineReducers } from 'redux';
// import sessionReducer from './session_reducer';
// import couponsReducer from './coupons_reducer'
// import storesReducer from './stores_reducer';
// import grocersReducer from './grocers_reducer'
import brandsReducer from './brands_reducer'
import dateReducer from './date_reducer'
import activeCouponsOverTimeReducer from './active_coupons_over_time_reducer'
import couponCountsByBrandReducer from './coupon_counts_by_brand_reducer'

export default combineReducers({
  // session: sessionReducer
  // coupons: couponsReducer,
  // stores: storesReducer,
  // grocers: grocersReducer,
  brands: brandsReducer,
  date: dateReducer,
  activeCouponsOverTime: activeCouponsOverTimeReducer,
  couponCountsByBrand: couponCountsByBrandReducer
});
import * as apiUtil from '../utils/api_util'
import { receiveLoadingInfo } from './loading_actions'

export const RECEIVE_SAVINGS_TIERS_BY_BRAND = 'RECEIVE_SAVINGS_TIERS_BY_BRAND'
export const RECEIVE_DATE = 'RECEIVE_DATE'

export const receiveDate = data => {
  return {
    type: RECEIVE_DATE,
    date: data[0]  // atodo maybe modify the values structure in DateSlider?
  }
}

export const receiveSavingsTiersByBrand = data => {
  return {
    type: RECEIVE_SAVINGS_TIERS_BY_BRAND,
    brands: data.brands,
    tiers: data.tiers
  }
}

// thunk stuff - will be exported to containers

export const getSavingsTiersByBrand = () => dispatch => {
  dispatch(receiveLoadingInfo(true))
  return apiUtil.getSavingsTiersByBrand()
  .then(
    savingsTiersByBrandData => {
      if (savingsTiersByBrandData.data !== '') {
        dispatch(receiveSavingsTiersByBrand({
          brands: savingsTiersByBrandData.data.treeData,
          tiers: savingsTiersByBrandData.data.tiers
        }))
        dispatch(receiveLoadingInfo(false))
      }
      return savingsTiersByBrandData
    },
    err => {
      console.log('error getting savings tier data')
    }
  )
}

/*
{
  name: "brands",
  children: [
    {
      name: "Kraft",
      children: [
        {
          name: "1",  // <- the tier index
          children: [
            { ... coupon ...},
            { ... coupon ...}, ...
          ]
        },
        {
          name: "2",
          children: [
            { ... coupon ...},
            { ... coupon ...}, ...
          ]
        },
        ... more tiers ...
      ]
    },
    {
      name: "Kellog's",
      children: [
        {
          name: "1",
          children: [
            { ... coupon ...},
            { ... coupon ...}, ...
          ]
        },
        {
          name: "2",
          children: [
            { ... coupon ...},
            { ... coupon ...}, ...
          ]
        },
        ... more tiers ...
      ]
    },
    ... more brands ...
  ]
}
*/
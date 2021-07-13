import React, { useEffect } from 'react'
import CouponCountsByBrand from './CouponCountsByBrand'
import { 

} from "date-fns";

const CouponCountsByBrandWrapper = ({
  grocers,
  brands,
  getCouponCountsByBrand
}) => {

  useEffect(() => {
    getCouponCountsByBrand()
  }, [])
  
  return (
    <div className="counts-by-brand data-vis" >
      <h1>Coupon Counts by Brand</h1>
      <br />
      <CouponCountsByBrand 
        grocers={grocers} 
        brands={brands} 
        keys={brands.map(brand => brand.id)}
      />
      <div className="data-buttons">
        {/* <button onClick={e => generateNewData(e)} >Generate New Data</button> */}
      </div>
    </div>
  )
}

export default CouponCountsByBrandWrapper
import React, { useState, useEffect } from 'react'
import CouponCountsByBrand from './CouponCountsByBrand'
import { 

} from "date-fns";
import { randColors } from '../../helpers/colors.jsx'

const CouponCountsByBrandWrapper = ({
  grocers,
  brands,
  getCouponCounts
}) => {  
  const [colors, setColors] = useState({})

  const generateNewData = e => {
    e.preventDefault()

    console.log("... generate new data now ...")
  }

  useEffect(() => {
    if (grocers.length === 0) getCouponCounts()
  }, [getCouponCounts])

  useEffect(() => {
    setColors(randColors(brands.length))
  }, [brands.length])  // ! this is hacky
  
  return (
    <div className="counts-by-brand" >
      <h1>Coupon Counts by Brand</h1>
      <br />
      <CouponCountsByBrand 
        grocers={grocers} 
        brands={brands} 
        keys={brands.map(brand => brand.id)}
        colors={colors} 
      />
      <div className="data-buttons">
        <button
          onClick={e => generateNewData(e)}
        >
          Generate New Data
        </button>
      </div>
    </div>
  )
}

export default CouponCountsByBrandWrapper
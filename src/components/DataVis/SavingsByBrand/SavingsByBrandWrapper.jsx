import React, { useEffect, useState } from 'react'
import SavingsByBrand from './SavingsByBrand'

const SavingsByBrandWrapper = ({ 
  brands,
  colors,
  loading,
  getSavingsByBrand
}) => {

  useEffect(() => {
    if (brands.length === 0) getSavingsByBrand()
  }, [])

  return (
    <div className="savings-by-brand data-vis">
      <h1>Savings By Brand</h1>
      <br />
      <SavingsByBrand
        brands={brands}
        colors={colors}
        loading={loading}
      />
      {/* <div className="data-buttons">
        <DateSliderContainer minDate={minDate} maxDate={maxDate} />
        <button
          onClick={e => generateNewData(e)}
        >
          Generate New Data
        </button>
      </div> */}
    </div>
  )
}

export default SavingsByBrandWrapper
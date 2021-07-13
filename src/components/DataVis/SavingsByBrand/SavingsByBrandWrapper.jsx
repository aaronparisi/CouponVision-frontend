import React, { useEffect } from 'react'
import SavingsByBrand from './SavingsByBrand'

const SavingsByBrandWrapper = ({ 
  brands,
  loading,
  getSavingsByBrand
}) => {

  useEffect(() => {
    getSavingsByBrand()
  }, [])

  return (
    <div className="savings-by-brand data-vis">
      <h1>Savings By Brand</h1>
      <br />
      <SavingsByBrand
        brands={brands}
        loading={loading}
      />
      {/* atodo date slider here? */}
    </div>
  )
}

export default SavingsByBrandWrapper
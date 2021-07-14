import React, { useEffect } from 'react'
import SavingsByBrand from './SavingsByBrand'
import { 
  subYears, 
  addYears, 
  startOfToday,
} from "date-fns";
import DateSliderContainer from '../../DateSlider/DateSliderContainer';

const SavingsByBrandWrapper = ({ 
  brands,
  loading,
  curDate,
  getSavingsByBrand,
  dateReceivedCallback
}) => {

  const minDate = subYears(startOfToday(), 4)
  const maxDate = addYears(startOfToday(), 4)

  useEffect(() => {
    getSavingsByBrand()
    dateReceivedCallback([new Date()])
  }, [])
  
  return (
    <div className="savings-by-brand data-vis">
      <h1>Savings By Brand</h1>
      <br />
      <SavingsByBrand
        brands={brands}
        loading={loading}
        curDate={curDate}
      />
      <div className="data-buttons">
        <DateSliderContainer 
          minDate={minDate} 
          maxDate={maxDate}
          mode={1}
          dateReceivedCallback={dateReceivedCallback}
          values={[new Date()]}
          step={1000 * 60 * 60 * 24}  // day
        />
      </div>
    </div>
  )
}

export default SavingsByBrandWrapper
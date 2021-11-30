import React, { useEffect } from 'react'
import SavingsTiersByBrand from './SavingsTiersByBrand'
import { 
  subYears, 
  addYears, 
  startOfToday,
} from "date-fns";
import DateSliderContainer from '../../DateSlider/DateSliderContainer';

const SavingsTiersByBrandWrapper = ({ 
  brands,
  tiers,
  loading,
  curDate,
  getSavingsTiersByBrand,
  dateReceivedCallback
}) => {

  const minDate = subYears(startOfToday(), 4)
  const maxDate = addYears(startOfToday(), 4)

  useEffect(() => {
    getSavingsTiersByBrand()
    dateReceivedCallback([new Date()])
  }, [])
  
  return (
    <div className="savings-by-brand data-vis">
      <h1>Savings Tiers By Brand</h1>
      <br />
      <SavingsTiersByBrand
        brands={brands}
        tiers={tiers}
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

export default SavingsTiersByBrandWrapper
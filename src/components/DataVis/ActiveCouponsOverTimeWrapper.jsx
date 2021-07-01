import React, { useEffect, useState } from 'react'
import DateSliderContainer from '../DateSlider/DateSliderContainer'
import ActiveCouponsOverTime from './ActiveCouponsOverTime'
import { 
  subYears, 
  addYears, 
  startOfToday,
} from "date-fns";

const ActiveCouponsOverTimeWrapper = ({
  grocers,
  curDate,
  getCouponsByBrandPerGrocer
}) => {
  const minDate = subYears(startOfToday(), 2)
  const maxDate = addYears(startOfToday(), 2)

  const generateNewData = e => {
    e.preventDefault()

    console.log("... generate new data now ...")
  }

  useEffect(() => {
    if (grocers.length === 0) getCouponsByBrandPerGrocer()
    // ? just use local state?
    // ? redux lets me keep data so i don't have to query again
  }, [])

  return (
    <React.Fragment >
      <h1>Non-Expired Coupons Over Time</h1>
      <br />
      <ActiveCouponsOverTime grocers={grocers} minDate={minDate} maxDate={maxDate} curDate={curDate} />
      <div className="data-buttons">
        <DateSliderContainer minDate={minDate} maxDate={maxDate} />
        <button
          onClick={e => generateNewData(e)}
        >
          Generate New Data
        </button>
      </div>
    </React.Fragment>
  )
}

export default ActiveCouponsOverTimeWrapper
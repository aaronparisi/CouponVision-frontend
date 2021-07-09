import React, { useEffect, useState } from 'react'
import DateSliderContainer from '../../DateSlider/DateSliderContainer'
import ActiveCouponsOverTime from './ActiveCouponsOverTime'
import { 
  subYears, 
  addYears, 
  startOfToday,
} from "date-fns";

const ActiveCouponsOverTimeWrapper = ({
  grocers,
  earlyDate,
  lateDate,
  colors,
  getActiveCouponsOverTime
}) => {
  const [zoomMode, setZoomMode] = useState(true)

  const minDate = subYears(startOfToday(), 2)
  const maxDate = addYears(startOfToday(), 2)

  const generateNewData = e => {
    e.preventDefault()

    console.log("... generate new data now ...")
  }

  useEffect(() => {
    if (grocers.length === 0) getActiveCouponsOverTime()
  }, [])
  
  return (
    <div className="active-over-time data-vis">
      <h1>Non-Expired Coupons Over Time</h1>
      <button
        onClick={e => setZoomMode(!zoomMode)}
      >
        Zoom Mode: {(zoomMode) ? "On" : "Off"}
      </button>
      <br />
      <ActiveCouponsOverTime 
        grocers={grocers} 
        earlyDate={earlyDate} 
        lateDate={lateDate} 
        minScaleDate={(zoomMode) ? earlyDate : minDate} 
        maxScaleDate={(zoomMode) ? lateDate : maxDate} 
        colors={colors} 
      />
      <div className="data-buttons">
        <DateSliderContainer minDate={minDate} maxDate={maxDate} />
        {/* <button
          onClick={e => generateNewData(e)}
        >
          Generate New Data
        </button> */}
      </div>
    </div>
  )
}

export default ActiveCouponsOverTimeWrapper
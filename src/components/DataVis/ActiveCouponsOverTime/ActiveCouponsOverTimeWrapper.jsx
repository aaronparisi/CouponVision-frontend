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
  loading,
  getActiveCouponsOverTime,
  dateReceivedCallback
}) => {
  const [zoomMode, setZoomMode] = useState(true)

  const today = new Date()
  const minDate = subYears(startOfToday(), 4)
  const maxDate = addYears(startOfToday(), 4)

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
      
      <ActiveCouponsOverTime 
        grocers={grocers} 
        earlyDate={earlyDate} 
        lateDate={lateDate} 
        minScaleDate={(zoomMode) ? earlyDate : minDate} 
        maxScaleDate={(zoomMode) ? lateDate : maxDate}
        loading={loading}
      />
      <div className="data-buttons">
        <DateSliderContainer 
          minDate={minDate} 
          maxDate={maxDate}
          mode={2}
          dateReceivedCallback={dateReceivedCallback}
          values={[minDate, today]}
          step={1000 * 60 * 60 * 24 * 7} // week
        />
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
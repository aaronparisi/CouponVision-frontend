import React from 'react'
import CurvedLineChart from './CurvedLineChart'
import RandArrayWrapper from './RandArrayWrapper'

const CurvedLineChartWrapper = () => {

  return (
    <div className="data-vis">
      <RandArrayWrapper Comp={CurvedLineChart} />
    </div>
  )
}

export default CurvedLineChartWrapper
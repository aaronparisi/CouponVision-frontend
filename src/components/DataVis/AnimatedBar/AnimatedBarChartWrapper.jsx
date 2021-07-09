import React from 'react'
import AnimatedBarChart from './AnimatedBarChart'
import RandArrayWrapper from '../RandArrayWrapper'

const AnimatedBarChartWrapper = () => {
  return (
    <div className="data-vis">
      <RandArrayWrapper Comp={AnimatedBarChart} />
    </div>
  )
}

export default AnimatedBarChartWrapper

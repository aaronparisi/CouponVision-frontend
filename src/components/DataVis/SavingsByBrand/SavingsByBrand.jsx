import React, { useEffect, useRef, useState } from 'react'
import {
  select,
  treemap
} from 'd3'
import {
  addMonths
} from 'date-fns'

import useResizeObserver from '../../../helpers/useResizeObserver'

const SavingsByBrand = ({
  brands,
  colors,
  loading,
}) => {
  const svgRef = useRef()
  const wrapperRef = useRef()
  const wrapperContentRect = useResizeObserver(wrapperRef)

  useEffect(() => {
    // svg rendering
    const svg = select(svgRef.current)
    if (
      !wrapperContentRect || 
      !brands
    ) return

    const { width, height } = wrapperContentRect

    svg
      .selectAll("pie")
      .data(brands)
      .join()

  }, [brands.length, wrapperContentRect])

  const Loading = () => {

    return <div className="loading">Loading...</div>
  }

  return <React.Fragment >
    <div className="data-wrapper" ref={wrapperRef}>
    {loading
        ? <Loading />
        : <svg ref={svgRef}>
            <g className="x-axis" />
            <g className="y-axis" />
          </svg>
      }
    </div>
  </React.Fragment>
}

export default SavingsByBrand
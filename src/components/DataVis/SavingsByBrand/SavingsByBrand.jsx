import React, { useEffect, useRef, useState } from 'react'
import {
  hierarchy,
  interpolateRgb,
  scaleOrdinal,
  schemeCategory10,
  select,
  treemap
} from 'd3'
import {
  addMonths
} from 'date-fns'

import useResizeObserver from '../../../helpers/useResizeObserver'
import { couponIsActive } from '../../../helpers/coupons_helpers'

const SavingsByBrand = ({
  brands,
  colors,
  loading,
}) => {
  const svgRef = useRef()
  const wrapperRef = useRef()
  const wrapperContentRect = useResizeObserver(wrapperRef)

  const filterCoupons = date => {
    const ret = {
      name: brands.name,
      children: brands.children.map(brandObj => {
        return {
          name: brandObj.name,
          children: brandObj.children.filter(stateObj => {
            return {
              name: stateObj.name,
              children: stateObj.children.map(coupon => {
                return couponIsActive(coupon, date)
              })
            }
          })
        }
      })
    }
    
    return ret
  }

  useEffect(() => {
    // svg rendering
    const svg = select(svgRef.current)
    if (
      !wrapperContentRect || 
      !brands ||
      brands.children === undefined
    ) return

    const { width, height } = wrapperContentRect

    const brandsOnlyActiveCoupons = filterCoupons(new Date())
    const root = hierarchy(brandsOnlyActiveCoupons)
      .sum(d => {
        return d.savings
      })
      .sort((d1, d2) => d2.savings - d1.savings)

    const treemapRoot = treemap().size([width, height]).padding(1)(root)

    const fader = color => interpolateRgb(color, '#fff')(0.3)
    const colorScale = scaleOrdinal(schemeCategory10.map(fader))
    // debugger
    svg
      .selectAll("g")
      .data(treemapRoot.leaves())
      .join("g")
      .attr('transform', d => `translate(${d.x0},${d.y0})`)
      .append('rect')
      .attr('width', d => d.x1 - d.x0)
      .attr('height', d => d.y1 - d.y0)
      .attr('fill', d => {
        return colorScale(d.data.state)
      })


  }, [brands.length, wrapperContentRect])

  const Loading = () => {

    return <div className="loading">Loading...</div>
  }

  return <React.Fragment >
    <div className="data-wrapper" ref={wrapperRef}>
    {loading
        ? <Loading />
        : <svg ref={svgRef}>
            
          </svg>
      }
    </div>
  </React.Fragment>
}

export default SavingsByBrand
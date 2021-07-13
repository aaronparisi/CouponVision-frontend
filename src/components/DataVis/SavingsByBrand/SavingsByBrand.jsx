import React, { useEffect, useRef } from 'react'
import {
  hierarchy,
  select,
  treemap,
  scaleSequential
} from 'd3'

import useResizeObserver from '../../../helpers/useResizeObserver'
import { couponIsActive } from '../../../helpers/coupons_helpers'

import * as d3Chromatic from 'd3-scale-chromatic'

const SavingsByBrand = ({
  brands,
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
          children: brandObj.children.map(stateObj => {
            const activeCoupons = stateObj
              .children
              .filter(coupon => couponIsActive(coupon, date))
            const totalSavings = (activeCoupons.length === 0) ? 0 :
              activeCoupons
                .reduce((accum, curr) => accum + curr.savings, 0)

            return {
              name: stateObj.name,
              totalSavings: totalSavings
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

    const brandsOnlyActiveCoupons = filterCoupons(new Date())  // will always show data for 'today'
    
    const root = hierarchy(brandsOnlyActiveCoupons)
      .sum(d => {
        return d.totalSavings
      })
      .sort((d1, d2) => d2.totalSavings - d1.totalSavings)

    const treemapRoot = treemap().size([width, height]).padding(1)(root)

    const colorScale = scaleSequential()
    .interpolator(d3Chromatic.interpolateSinebow)
    
    const numBrands = brands.children.length
    const brandColorIdxs = {}
    brands.children.forEach((brand, idx) => {
      brandColorIdxs[brand.name] = idx / numBrands
    })
    
    svg
      .selectAll(".tile")
      .data(treemapRoot.leaves())
      .join("rect")
      .attr("class", "tile")
      .attr('x', d => d.x0)
      .attr('y', d => d.y0)
      .attr('width', d => d.x1 - d.x0)
      .attr('height', d => d.y1 - d.y0)
      .attr('fill', d => {
        return colorScale(brandColorIdxs[d.parent.data.name])
      })
      .on("mouseenter", (e, d) => {
        svg
          .selectAll(".total-tooltip")
          .data([d])
          .join("text")
          .attr("class", "total-tooltip")
          .attr("fill", "black")
          .text(d => {
            return `${d.data.name}: $${parseFloat(d.data.totalSavings).toFixed(2)}`
          })
          .attr("x", d => d.x0 + 5)
          .attr("y", d => d.y0 + 12)
          .attr("font-size", 12)
      })
      .on("mouseleave", () => svg.select(".total-tooltip").remove())
      
    // legend
    svg
      .selectAll(".legend-label")
      .data(Object.keys(brandColorIdxs))
      .join("text")
      .attr("class", "legend-label")
      .attr("fill", () => "black")
      .text(d => d)
      .attr("x", (val, i) => ((i+1) * (width / 5)) % width)
      .attr("y", (val, i) => height + 25 + (Math.ceil((i+1) / 5)) * 25)
      .on("mouseenter", (e, d) => {
        // atodo
        // how do I access the data from the treemap
        // without iterating all through all the levels of it?
        // goal here is to have all others fade
        // and total savings for entire brand appear
      })

    svg
      .selectAll(".legend-checkbox")
      .data(Object.keys(brandColorIdxs))
      .join("circle")
      .attr("class", "legend-checkbox")
      .attr("cx", (val, i) => (((i+1) * (width / 5)) % width) - 15)
      .attr("cy", (val, i) => height + 20 + (Math.ceil((i+1) / 5)) * 25)
      .attr("r", 7)
      .style("fill", val => {
        return colorScale(brandColorIdxs[val])
      })

  }, [brands.children, wrapperContentRect, loading])

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
import React, { useEffect, useRef, useState } from 'react'
import {
  hierarchy,
  select,
  treemap,
  scaleSequential
} from 'd3'

import useResizeObserver from '../../../helpers/useResizeObserver'
import { couponIsActive } from '../../../helpers/coupons_helpers'

import * as d3Chromatic from 'd3-scale-chromatic'
import { maybeFaded } from '../../../helpers/colors'

import tinyColor from 'tinycolor2'
import rgbHex from 'rgb-hex'

const SavingsByBrand = ({
  brands,
  loading,
  curDate
}) => {
  const svgRef = useRef()
  const wrapperRef = useRef()
  const wrapperContentRect = useResizeObserver(wrapperRef)

  const [hoverColor, setHoverColor] = useState(null)

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
                .reduce((accum, curr) => parseFloat(accum) + parseFloat(curr.savings), 0)

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

    const brandsOnlyActiveCoupons = filterCoupons(curDate)
    // const brandsOnlyActiveCoupons = filterCoupons(new Date())  // will always show data for 'today'
    
    const root = hierarchy(brandsOnlyActiveCoupons)
      .sum(d => {
        return d.totalSavings
      })
      .sort((d1, d2) => d2.totalSavings - d1.totalSavings)

    const treemapRoot = treemap().size([width, height]).padding(1)(root)

    const colorScale = scaleSequential()
    // .interpolator(d3Chromatic.interpolateSinebow)
    .interpolator(d3Chromatic.interpolateTurbo)

    const numBrands = brands.children.length
    const brandColorIdxs = {}
    brands.children.forEach((brand, idx) => {
      brandColorIdxs[brand.name] = idx / numBrands
    })

    const getColorFromName = name => {
      return colorScale(brandColorIdxs[name])
    }

    const getMaybeFadedFromName = name => {
      return maybeFaded(getColorFromName(name), hoverColor)
    }
    
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
        const curBrand = d.parent.data.name
        return getMaybeFadedFromName(curBrand)
      })
      .on("mouseenter", (e, d) => {
        svg
          .selectAll(".total-tooltip")
          .data([d])
          .join("text")
          .attr("class", "total-tooltip")
          .attr("fill", d => {
            const color = `#${rgbHex(getColorFromName(d.parent.data.name))}`
            const tColor = tinyColor(color)
            return (tColor.isDark()) ? "white" : "black"
          })
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
      .data(treemapRoot.children)
      .join("text")
      .attr("class", "legend-label")
      .attr("fill", () => "black")
      .text(child => {
        return child.data.name
      })
      .attr("x", (val, i) => ((i+1) * (width / 5)) % width + 30)
      .attr("y", (val, i) => height + 25 + (Math.ceil((i+1) / 5)) * 30)
      .on("mouseenter", (e, child) => {
        setHoverColor(getColorFromName(child.data.name))

        svg
          .selectAll(".legend-tooltip")
          .data([child])
          .join("text")
          .attr("class", "legend-tooltip")
          .attr("fill", "black")
          .text(child => {
            const tot = child.data.children.reduce((tot, coupon) => {
              return parseFloat(tot) + parseFloat(coupon.totalSavings)
            }, 0).toFixed(2)
            return `${child.data.name}: ` + `$${tot}`
          })
          .attr("font-size", "20px")
          .attr("x", child => {
            return child.x0 - (Math.max(0, (child.x1 + 150 - width))) / 2
          })
          .attr("y", child => {
            return child.y0 - 10
          })
          
      })
      .on("mouseleave", () => {
        setHoverColor(null)

        svg
          .selectAll(".legend-tooltip").remove()
      })

    svg
      .selectAll(".legend-checkbox")
      .data(Object.keys(brandColorIdxs))
      .join("rect")
      .attr("class", "legend-checkbox")
      .attr("x", (val, i) => (((i+1) * (width / 5)) % width))
      .attr("y", (val, i) => height + 20 + (Math.ceil((i+1) / 5)) * 30 - 15)  // atodo abstract these
      .attr("height", 25)
      .attr("width", 25)
      .style("fill", val => {
        return colorScale(brandColorIdxs[val])
      })

  }, [brands.children, wrapperContentRect, loading, hoverColor, curDate])

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
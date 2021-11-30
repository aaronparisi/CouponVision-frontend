import React, { useEffect, useRef, useState } from 'react'
import {
  hierarchy,
  select,
  treemap,
  scaleSequential,
  scaleOrdinal
} from 'd3'

import useResizeObserver from '../../../helpers/useResizeObserver'
import { couponIsActive } from '../../../helpers/coupons_helpers'

import * as d3Chromatic from 'd3-scale-chromatic'
import { maybeFaded } from '../../../helpers/colors'

import tinyColor from 'tinycolor2'
import rgbHex from 'rgb-hex'

const SavingsTiersByBrand = ({
  brands,
  tiers,
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
          children: brandObj.children.map(tierObj => {
            const activeCoupons = tierObj
              .children
              .filter(coupon => couponIsActive(coupon, date))
            const totalSavings = (activeCoupons.length === 0) ? 0 :
              activeCoupons
                .reduce((accum, curr) => parseFloat(accum) + parseFloat(curr.savings), 0)

            return {
              name: tierObj.name,
              totalSavings: totalSavings,
              numCouponsInTier: activeCoupons.length
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
    
    const root = hierarchy(brandsOnlyActiveCoupons)
      .sum(d => {
        return d.totalSavings
        // return d.numCouponsInTier
      })
      .sort((d1, d2) => d2.totalSavings - d1.totalSavings)
      // .sort((d1, d2) => d2.numCouponsInTier - d1.numCouponsInTier)

    const treemapRoot = treemap().size([width, height]).padding(1)(root)

    const colorScale = scaleSequential()
    // .interpolator(d3Chromatic.interpolateSinebow)
    .interpolator(d3Chromatic.interpolateTurbo)
    // .interpolator(d3Chromatic.interpolateMagma)

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

    const opacityMap = tier => {
      // fixme this only works up to 5 tiers
      switch (tier) {
        case 1:
          return "88"
        case 2:
          return "aa"
        case 3:
          return "cc"
        case 4:
          return "ee"
        case 5:
          return ""
        default:
          return ""
      }
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
        const tier = d.data.name
        const baseColor = getMaybeFadedFromName(curBrand)
        return (hoverColor) ? baseColor : (baseColor + opacityMap(tier))
      })
      .on("mouseenter", (e, d) => {
        svg
          .selectAll(".total-tooltip")
          .data([d])
          .join("text")
          .attr("class", "total-tooltip")
          .attr("fill", d => {
            // atodo make text color dependent on FADED sub-tile color
            const color = `#${rgbHex(getColorFromName(d.parent.data.name))}`
            const tColor = tinyColor(color)
            return (tColor.isDark()) ? "white" : "black"
          })
          .text(d => {
            if (tiers[d.data.name] === undefined) {
              debugger
            }
            return `[$${tiers[d.data.name].tierMin} - $${tiers[d.data.name].tierMax}]: ${d.data.numCouponsInTier} coupons => $${parseFloat(d.data.totalSavings).toFixed(2)} total savings`
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
            const totSavings = child.data.children.reduce((tot, tier) => {
              return parseFloat(tot) + parseFloat(tier.totalSavings)
            }, 0).toFixed(2)
            const totCoupons = child.data.children.reduce((tot, tier) => {
              return parseInt(tot) + parseInt(tier.numCouponsInTier)
            }, 0)
            return `${child.data.name}: ${totCoupons} coupons => $${totSavings} total savings`
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

export default SavingsTiersByBrand
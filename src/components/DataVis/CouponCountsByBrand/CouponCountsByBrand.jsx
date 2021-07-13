import React, { useEffect, useRef, useState } from 'react'
import {
  select,
  scaleLinear,
  scaleBand,
  axisLeft,
  axisBottom,
  max,
  stack,
  stackOrderAscending,
  scaleSequential
} from 'd3'

import useResizeObserver from '../../../helpers/useResizeObserver'
import * as d3Chromatic from 'd3-scale-chromatic'
import { maybeFaded } from '../../../helpers/colors'

const CouponCountsByBrand = ({ grocers=[], brands=[], keys }) => {
  const svgRef = useRef()
  const wrapperRef = useRef()
  const wrapperContentRect = useResizeObserver(wrapperRef)

  const [hoverColor, setHoverColor] = useState(null)
  
  useEffect(() => {
    const svg = select(svgRef.current)
    const { width, height } = wrapperContentRect || wrapperRef.current.getBoundingClientRect()

    // stacks, layers
    const stackGenerator = stack()
      .keys(keys)
      .order(stackOrderAscending);
    const layers = stackGenerator(grocers)
    
    const extent = [
      0,
      max(layers, layer => {
        return max(layer, sequence => sequence[1])
      })
    ]
    
    // color stuff
    const numBrands = brands.length
    const brandColorIdxs = {}
    brands.forEach((brand, idx) => {
      brandColorIdxs[brand.name] = idx / numBrands
    })

    const colorScale = scaleSequential()
      .interpolator(d3Chromatic.interpolateSinebow)
      // other options: interpolateRainbow, interpolateTurbo, 

    const getColorFromName = name => {
      return colorScale(brandColorIdxs[name])
    }

    const getMaybeFadedFromName = name => {
      return maybeFaded(getColorFromName(name), hoverColor)
    }

    // scales & axes
    const xScale = scaleLinear()
      .domain(extent)
      .range([0, width])

    const yScale = scaleBand()
      .domain(grocers.map(grocer => grocer.grocer_name))
      .range([height, 0])
      .padding(0.55)

    const xAxis = axisBottom(xScale)
    svg
      .select(".x-axis")
      .attr("transform", `translate(0, ${height})`)
      .call(xAxis)

    const yAxis = axisLeft(yScale)
    svg
      .select(".y-axis")
      .call(yAxis)

    // stacks
    svg
      .selectAll(".layer")
      .data(layers)
      .join("g")
      .attr("class", "layer")
      .attr("data-brand", layer => {
        return brands[layer.key-1].name
      })
      .attr("fill", layer => {
        const curBrandName = brands[layer.key-1].name
        const curColor = getColorFromName(curBrandName)
        
        if (!hoverColor || curColor === hoverColor) {
          return curColor
        } else {
          return getMaybeFadedFromName(curBrandName)
        }
      })
      .selectAll("rect")
      .data(layer => layer)
      .join("rect")
      .attr("x", sequence => xScale(sequence[0]))
      .attr("width", sequence => xScale(sequence[1]) - xScale(sequence[0]))
      .attr("y", sequence => yScale(sequence.data.grocer_name))
      .attr("height", yScale.bandwidth())
      .on("mouseenter", (event, val) => {
        const tgt = event.currentTarget  // the 'rect'
        const couponCount = val[1] - val[0]
        const brandName = tgt.parentElement.dataset.brand
        
        svg
          .selectAll(".coupon-stacked-tooltip")
          .data([val])
          .join((enter) => {
            return enter.append("text")
              .attr("y", yScale(val.data.grocer_name))
          })
          .attr("class", "coupon-stacked-tooltip")
          .text(`${brandName}: ${couponCount}`)
          .attr("x", xScale(val[0]) + 50)
          .attr("text-anchor", "middle")
          .transition()
          .attr("y", yScale(val.data.grocer_name) - 3)
          .attr("opacity", 1)
      })
      .on("mouseleave", () => {
        svg
          .select(".coupon-stacked-tooltip")
          .remove()
      })

    // legend
    svg
      .selectAll(".legend-label")
      .data(brands)
      .join("text")
      .attr("class", "legend-label")
      .attr("fill", "black")
      .text(brand => brand.name)
      .attr("x", () => width + 40)
      .attr("y", (brand, i) => 55 + (i * 22))
      .on("mouseenter", (e, label) => {
        setHoverColor(getColorFromName(label.name))
      })
      .on("mouseleave", () => {
        setHoverColor(null)
      })

    svg
      .selectAll(".legend-checkbox")
      .data(brands)
      .join("circle")
      .attr("class", "legend-checkbox")
      .attr("cx", (brand, i) => width + 28)
      .attr("cy", (brand, i) => 50 + (i * 22))
      .attr("r", 7)
      .style("fill", brand => {
        const curColor = getColorFromName(brand.name)
        if (hoverColor === null || hoverColor === curColor) {
          return curColor
        } else {
          return getMaybeFadedFromName(brand.name)
        }
      })
      .on("mouseenter", (e, checkbox) => {
        setHoverColor(getColorFromName(checkbox.name))
      })
      .on("mouseleave", () => {
        setHoverColor(null)
      })

  }, [grocers, brands, keys, wrapperContentRect, hoverColor])
  
  return (
    <div className="counts-content" >
      <div className="data-wrapper" ref={wrapperRef} >
        <svg ref={svgRef} style={{paddingLeft: "4%"}}>
          <g className="x-axis" />
          <g className="y-axis" />
        </svg>
      </div>
    </div>
  )
}

export default CouponCountsByBrand
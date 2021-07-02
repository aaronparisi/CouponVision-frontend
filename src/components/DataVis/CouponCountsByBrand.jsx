import React, { useEffect, useRef, useState } from 'react'
import {
  select,
  scaleLinear,
  scaleBand,
  axisLeft,
  axisBottom,
  max,
  stack,
  stackOrderAscending
} from 'd3'

import useResizeObserver from '../../helpers/useResizeObserver'

const CouponCountsByBrand = ({ grocers=[], brands=[], keys, colors={} }) => {
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
      .attr("fill", layer => {
        const color = colors[layer.key - 1]
        const fadedColor = color + "33"

        if (!hoverColor || color === hoverColor) {
          return color
        } else {
          return fadedColor
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
        const brandKey = colors.indexOf(tgt.parentElement.getAttribute("fill")) + 1

        if (brands.filter(brand => brand.id === brandKey)[0] === undefined) {
          // * I think this can be removed?
          debugger
        }
        const brandName = brands.filter(brand => brand.id === brandKey)[0].name
        
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
      .on("mouseleave", (event, val) => {
        const tgt = event.currentTarget  // the 'rect'
        svg
          .select(".coupon-stacked-tooltip")
          .remove()
      })

  }, [grocers, brands, colors, keys, wrapperContentRect, hoverColor])
  
  return <div className="counts-content" >
    <div className="data-wrapper" ref={wrapperRef} >
      <svg ref={svgRef} style={{paddingLeft: "4%"}}>
        <g className="x-axis" />
        <g className="y-axis" />
      </svg>
    </div>
    <div className="legend">
      <ul>
        {
          brands.map((brand, idx) => {
            return <li 
              key={idx}
              id={idx}
              className="legend-brand" 
              onMouseEnter={e => {
                setHoverColor(colors[e.currentTarget.id])
              }}
              onMouseLeave={e => {
                setHoverColor(null)
              }}
            >
              <div className="brand-color" style={{backgroundColor: colors[idx]}}></div>
              {brand.name}
            </li>
          })
        }
      </ul>
    </div>
  </div>
}

export default CouponCountsByBrand

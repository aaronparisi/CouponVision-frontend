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
    // ???? aren't the layers supposed to be per brand?
    // => look at the way the grocers data is formatted
    //    (it generates layers based off the keys for the coupon counts)
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
    // debugger
    svg
      .selectAll(".layer")
      .data(layers)
      .join("g")
      .attr("class", "layer")
      .attr("fill", layer => {
        const color = colors[brands[layer.key-1].name]
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
      // atodo can I get an outline on the bars?
      // current issue is that the bar doesn't know what color it is...
      // .attr("style", (layer, idx) => {
      //   debugger
      //   const color = colors[idx]
      //   if (!hoverColor || color !== hoverColor) {
      //     return "outline: none"
      //   } else {
      //     return "outline: thin solid black"
      //   }
      // })
      .on("mouseenter", (event, val) => {
        const tgt = event.currentTarget  // the 'rect'
        const couponCount = val[1] - val[0]
        const brandKey = Object.values(colors).indexOf(tgt.parentElement.getAttribute("fill")) + 1

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
  
  return (
    <div className="counts-content" >
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
                  setHoverColor(colors[e.currentTarget.innerText])
                }}
                onMouseLeave={e => {
                  setHoverColor(null)
                }}
              >
                <div className="brand-color" style={{backgroundColor: colors[brand.name]}}></div>
                {brand.name}
              </li>
            })
          }
        </ul>
      </div>
    </div>
  )
}

export default CouponCountsByBrand

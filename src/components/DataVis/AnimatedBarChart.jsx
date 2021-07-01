import React, { useEffect, useRef } from 'react'
import {
  select,
  axisBottom,
  axisLeft,
  scaleLinear,
  scaleBand
} from 'd3'

import useResizeObserver from '../../helpers/useResizeObserver'

const AnimatedBarChart = ({ data, maxData }) => {
  const svgRef = useRef()
  const wrapperRef = useRef()
  const wrapperContentRect = useResizeObserver(wrapperRef)

  useEffect(() => {
    const svg = select(svgRef.current)
    
    if (! wrapperContentRect) return

    const xScale = scaleBand()
      .domain(data.map((val, idx) => idx))
      .range([0, wrapperContentRect.width])
      .padding(0.5)
      // * note the use of scaleBand instead of scaleLinear
      // * also note that scaleBand does not require a range of integers,
      // * rather, can take an array or ARBITRARY values that it will
      // * spread out over the given range (good for bar charts...)

    const yScale = scaleLinear()
      .domain([0, maxData])  // todo change
      .range([wrapperContentRect.height, 0])
    // in this case, the inputs are the "y" values, i.e. the actual vals in data

    const colorScale = scaleLinear()
      .domain([maxData/2, maxData*.75, maxData])
      .range(["green", "orange", "red"])
      .clamp(true)

    const xAxis = axisBottom(xScale)
      .ticks(data.length)
      // .tickFormat(index => index+1)
      // * no need to format ticks this time
    svg
      .select(".x-axis")
      .style("transform", `translateY(${wrapperContentRect.height}px)`)
      .call(xAxis)
    
    const yAxis = axisLeft(yScale)
    svg
      .select(".y-axis")
      // .style("transform", `translateY(${700}px)`) => not necessary
      .call(yAxis)

    svg
      .selectAll(".bar")
      .data(data)
      .join("rect")
      .attr("class", "bar")
      .style("transform", "scale(1,-1)")
      .attr("x", (val, idx) => xScale(idx))
      // .attr("y", yScale)
      .attr("y", -wrapperContentRect.height)
      .attr("width", xScale.bandwidth())
      .on("mouseenter", (event, val) => {
        const idx = svg.selectAll(".bar").nodes().indexOf(event.target)
        svg
          .selectAll(".tooltip")
          .data([val])
          .join((enter) => enter.append("text").attr("y", yScale(val) - 4))
          .attr("class", "tooltip")
          .text(val)
          .attr("x", xScale(idx) + xScale.bandwidth() / 2)
          .attr("text-anchor", "middle")
          .transition()
          .attr("y", yScale(val) - 8)
          .attr("opacity", 1)
      })
      .on("mouseleave", () => {
        svg
          .select(".tooltip")
          .remove()
      })
      .transition()
      .attr("height", value => wrapperContentRect.height - yScale(value))
      .attr("fill", colorScale)
  }, [data, wrapperContentRect, maxData])

  return <React.Fragment >
    <div className="data-wrapper" ref={wrapperRef}>
      <svg ref={svgRef}>
        
        <g className="x-axis" />
        <g className="y-axis" />
      </svg>
    </div>
  </React.Fragment>
}

export default AnimatedBarChart

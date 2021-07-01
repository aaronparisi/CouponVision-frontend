import React, { useEffect, useRef } from 'react'
import {
  select,
  scaleLinear,
  scaleBand,
  max,
  axisBottom
} from 'd3'

import useResizeObserver from '../../helpers/useResizeObserver'

const RacingBarChart = ({ data }) => {
  const svgRef = useRef()
  const wrapperRef = useRef()
  const wrapperContentRect = useResizeObserver(wrapperRef)

  useEffect(() => {
    const svg = select(svgRef.current)
    if (!wrapperContentRect) return

    // sort data
    data.sort((a, b) => b.value - a.value)

    // scales
    const yScale = scaleBand()
      .paddingInner(0.1)
      .domain(data.map((val, idx) => idx))
      .range([0, wrapperContentRect.height])

    const xScale = scaleLinear()
      .domain([0, Math.max(max(data, horse => horse.value), 100)])
      .range([0, wrapperContentRect.width])
      // .clamp(true)

    // x-axis (optional)
    const xAxis = axisBottom(xScale)
    svg
      .select('.x-axis')
      .style('transform', `translateY(${wrapperContentRect.height}px)`)
      .call(xAxis)

    // draw the bars
    svg.selectAll(".bar")
      .data(data, (horse, idx) => horse.name) // so rect is tied to HORSE
      .join(enter => {
        return enter
          .append("rect")
          .attr("y", (horse, idx) => yScale(idx))
      })  // to prevent y transition on page load
      .attr("class", "bar")
      .attr("x", 0)  // all bars start on left of svg
      .attr("height", yScale.bandwidth())
      .attr("fill", horse => horse.color)
      .transition()
      .attr("width", horse => xScale(horse.value))
      .attr("y", (horse, idx) => yScale(idx))

    // draw the labels
    svg
      .selectAll(".label")
      .data(data, (horse, idx) => horse.name)
      .join(enter => {
        return enter
          .append("text")
          .attr(
            "y",
            (horse, idx) => yScale(idx) + yScale.bandwidth() / 2 + 5
          )
      })
      .text(horse => `🐎 - ${horse.name}: ${horse.value} meters`)
      .attr("class", "label")
      .attr("overflow", "elipsis")
      .attr("x", 10)
      .transition()
      .attr("width", horse => xScale(horse.value))
      .attr("y", (horse, idx) => yScale(idx) + yScale.bandwidth() / 2 + 5)
  }, [data, wrapperContentRect])

  return <React.Fragment >
    <div className="data-wrapper" ref={wrapperRef}>
      <svg ref={svgRef}>
      <g className="x-axis" />
      </svg>
    </div>
  </React.Fragment>
}

export default RacingBarChart

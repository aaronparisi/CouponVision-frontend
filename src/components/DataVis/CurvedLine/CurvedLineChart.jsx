import React, { useEffect, useRef } from 'react'
import {
  select, 
  line, 
  // curveCardinal, 
  axisBottom,
  axisLeft,
  scaleLinear
} from 'd3'

import useResizeObserver from '../../../helpers/useResizeObserver'

const CurvedLineChart = ({ data, maxData }) => {
  const svgRef = useRef()
  const wrapperRef = useRef()
  const wrapperContentRect = useResizeObserver(wrapperRef)

  useEffect(() => {
    const svg = select(svgRef.current)
    if (!wrapperContentRect) return

    const xScale = scaleLinear()
      .domain([0, data.length-1])
      .range([0, wrapperContentRect.width])
    // "create a scale that maps the input values to some ~scaled~ output val"
    // in this case, the inputs are the "x" values, i.e. 0...data.length

    const yScale = scaleLinear()
      .domain([0, maxData])
      .range([wrapperContentRect.height, 0])
    // in this case, the inputs are the "y" values, i.e. the actual vals in data

    const xAxis = axisBottom(xScale)
      .ticks(data.length)
      .tickFormat(index => index+1)
    svg
      .select(".x-axis")
      .style("transform", `translateY(${wrapperContentRect.height}px)`)
      .call(xAxis)
    
    const yAxis = axisLeft(yScale)
    svg
      .select(".y-axis")
      // .style("transform", `translateY(${wrapperContentRect.height}px)`) => not necessary
      .call(yAxis)

    const myLine = line()
      .x((value, index) => xScale(index))
      .y(value => yScale(value))
      // .curve(curveCardinal)
      // myLine is a function that will generate the "d" attribute
      // for a path element
    
    svg
      .selectAll(".line")  // line because the D3 makes path el's for axes
      .data([data])  // we want ONE path element for the entire ARRAY of data
      .join("path")  // create the path element
      .attr("d", value => {
        return myLine(value)
      })  // include the "d" attribute
      .attr("fill", "none")
      .attr("stroke", "blue")
      .attr("class", "line")
  }, [data, maxData, wrapperContentRect])

  return <React.Fragment >
    <div className="data-wrapper" ref={wrapperRef}>
      <svg ref={svgRef}>
        {/* <path d="M0,150 100,100 150,120" stroke="blue" fill="none" /> */}
        {/* sample path */}
        <g className="x-axis" />
        <g className="y-axis" />
      </svg>
    </div>
  </React.Fragment>
}

export default CurvedLineChart

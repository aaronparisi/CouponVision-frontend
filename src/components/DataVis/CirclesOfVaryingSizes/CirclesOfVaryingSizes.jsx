import React, { useEffect, useRef } from 'react'
import { select } from 'd3'

const CirclesOfVaryingSizes = ({ data, maxData }) => {
  const svgRef = useRef()

  useEffect(() => {
  // * circles of varying radii
    const svg = select(svgRef.current)
    svg
      .selectAll('circle')
      .data(data)
      .join("circle"
        // enter => enter
        //     .append("circle")
        //     .attr("class", "new"),
        // * no need for explicit enter callback
        // update => update
        //     .attr("class", "updated"),
        // * no need for explicit update callback if attr's are below join
        // exit => exit
        //     .remove()
        // * exiting elements are removed automatically
      )
      .attr("r", value => value)
      .attr("cx", value => value*14)
      .attr("cy", value => 400)
      .attr("stroke", "red")
  }, [data])

  return <React.Fragment>
    <svg ref={svgRef}></svg>
  </React.Fragment>
}

export default CirclesOfVaryingSizes

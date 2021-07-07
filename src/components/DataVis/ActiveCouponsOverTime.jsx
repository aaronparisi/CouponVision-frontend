import React, { useEffect, useRef, useState } from 'react'
import {
  select,
  scaleLinear,
  line,
  axisLeft,
  axisBottom,
  max,
  scaleTime,
} from 'd3'
import {
  addMonths
} from 'date-fns'

import useResizeObserver from '../../helpers/useResizeObserver'

const CouponLineChart = ({ grocers, minDate, maxDate, curDate, colors }) => {
  const svgRef = useRef()
  const wrapperRef = useRef()
  const wrapperContentRect = useResizeObserver(wrapperRef)

  const [selectedGrocers, setSelectedGrocers] = useState({})

  const couponIsActive = (coupon, aDate) => {
    return (
      (new Date(coupon.activation_date) <= aDate) &&
      (new Date(coupon.expiration_date) >= aDate)
    )
  }

  useEffect(() => {
    setSelectedGrocers(
      grocers.reduce((obj, grocer) => {
        return {
          ...obj,
          [grocer.name]: true
        }
      }, {})
    )
  }, [grocers.length])
  
  useEffect(() => {
    const svg = select(svgRef.current)
    if (
      !wrapperContentRect || 
      !grocers || 
      grocers.some(grocer => grocer.coupons_by_brand === undefined)
    ) return

    const getNumActiveCoupons = grocer => {
      // returns an array of objects
      // the objects represent the number of active coupons at a date
      const pairs = []
      let aDate = minDate

      while (aDate < curDate) {
        // get number of coupons active at this date
        const numActive = grocer
          .coupons_by_brand
          .filter(coupon => couponIsActive(coupon, aDate))
          .length

        pairs.push({date: aDate, numActive: numActive })

        aDate = addMonths(aDate, 1)
      }

      const ret = {}
      ret["grocer"] = grocer
      ret["pairs"] = pairs

      return ret;
    }

    const lines = grocers
      // .filter(grocer => selectedGrocers[grocer.name])
        // anote we do the filtering at the point of data attachment
        // => lets us have the full list of grocers for the y-scale
        // => selecting and de-selecting grocers does not change the scale
      .map(grocer => {
      // maps the array of grocers to an array of objects consisting of:
      // a grocer (has info about the grocer to be used for data attr's),
      // an array of date-numActive pairs, for the d attr of the line
      const ret = getNumActiveCoupons(grocer)
      return ret;
    })
    
    const yScale = scaleLinear()
      .domain(
        [
          0, 
          max(lines, line => {
            return Math.max(...line.pairs.map(obj => obj.numActive))
          })
        ]
      )
      .range([wrapperContentRect.height, 0])

    const xScale = scaleTime()
      .domain([minDate, maxDate])
      .range([0, wrapperContentRect.width])
      // .ticks(24)

    const yAxis = axisLeft(yScale)
    svg
      .select(".y-axis")
      .call(yAxis)

    const xAxis = axisBottom(xScale)
      .ticks(12)
    svg
      .select(".x-axis")
      .style("transform", `translateY(${wrapperContentRect.height}px)`)
      .call(xAxis)

    const genLine = line()
      .x(val => xScale(val["date"]))
      .y(val => yScale(val["numActive"]))
    
    svg
      .selectAll(".line")
      .data(lines.filter(line => selectedGrocers[line.grocer.name]))
      .join("path")
      .attr("d", val => {
        return genLine(val.pairs)
      })
      .attr("fill", "none")
      .attr("stroke", (val, idx) => colors[val.grocer.name])
      .attr("stroke-width", "2")
      .attr("class", "line")
      .on("mouseenter", (event, val) => {
        const toolTipNum = val.pairs[val.pairs.length-1].numActive
        const toolTipName = val.grocer.name
        svg
          .selectAll("active-counts-tooltip")
          .data([val])  // ? not sure what this is doing
          .join((enter) => {
            return enter.append("text")
              .attr("x", xScale(curDate) + 2)
          })
          .attr("class", "active-counts-tooltip")
          .text(`${toolTipName}: ${toolTipNum}`)
          .attr("y", yScale(toolTipNum))
          .transition()
          .attr("x", xScale(curDate) + 4)
          .attr("opacity", 1)
      })
      .on("mouseleave", (event, val) => {
        svg.select(".active-counts-tooltip").remove()
      })
  }, [grocers, wrapperContentRect, curDate, colors, Object.values(selectedGrocers)])
  // atodo dependency array has ARRAY in it (grocers) => how to test array equality?
  
  return <React.Fragment >
    <div className="data-wrapper" ref={wrapperRef} >
      <svg ref={svgRef}>
        <g className="x-axis" />
        <g className="y-axis" />
      </svg>
    </div>
    <div className="legend">
      {
        Object.keys(selectedGrocers).map((grocer_name, idx) => {
          return (
            <div className="grocer-checkbox" key={idx}>
              <input 
                type="checkbox" 
                id={`${grocer_name}`} 
                onClick={e => {
                  setSelectedGrocers({
                    ...selectedGrocers,
                    [e.currentTarget.id]: e.currentTarget.checked
                  })
                }}
                defaultChecked={true}
              />
              <label htmlFor={`${grocer_name}`}>
                <div className="label-name">{grocer_name}</div>
              </label>
              <div className="label-color" style={{backgroundColor: colors[grocer_name]}}></div>
            </div>
          )
        })
      }
    </div>
  </React.Fragment>
}

export default CouponLineChart
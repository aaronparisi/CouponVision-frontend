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

import useResizeObserver from '../../../helpers/useResizeObserver'
import Legend from './Legend'

const CouponLineChart = ({ grocers, earlyDate, lateDate, minScaleDate, maxScaleDate, colors }) => {
  const svgRef = useRef()
  const wrapperRef = useRef()
  const wrapperContentRect = useResizeObserver(wrapperRef)

  const [selectedGrocers, setSelectedGrocers] = useState({})
  const [hoverColor, setHoverColor] = useState(null)

  const couponIsActive = (coupon, aDate) => {
    // * aDate will only go up to lateDate
    return (
      (new Date(coupon.activation_date) <= aDate) &&
      (new Date(coupon.expiration_date) >= aDate)
    )
  }

  useEffect(() => {
    // select all grocers on load
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
    // svg rendering
    const svg = select(svgRef.current)
    if (
      !wrapperContentRect || 
      !grocers || 
      grocers.some(grocer => grocer.coupons === undefined)
    ) return

    const { width, height } = wrapperContentRect

    const getNumActiveCoupons = grocer => {
      // returns an array of objects
      // the objects represent the number of active coupons
      // for the given grocer on a particular date
      const pairs = []
      let aDate = earlyDate

      while (aDate < lateDate) {
        // get number of coupons active at this date
        const numActive = grocer
          .coupons
          .filter(coupon => couponIsActive(coupon, aDate))
          .length

        pairs.push({
          date: aDate, 
          numActive: numActive,
          grocerName: grocer.name  // used for point rendering
        })

        aDate = addMonths(aDate, 1)
      }

      const ret = {}
      ret["grocer"] = grocer
      ret["pairs"] = pairs

      return ret;
    }

    // anote keep separate variables for lines and visibleLines
    // => lets us have the full list of grocers for the y-scale
    // => selecting and de-selecting grocers does not change the scale
    const lines = grocers
      .map(grocer => {
      const ret = getNumActiveCoupons(grocer)
      return ret;
    })
    /*
    [
      {grocer: {}, pairs: [ {date: <some-date>, numActive: 5, grocerName: "QFC"}, {}, ...]}, 
      {...},
      ...
    ]
    */

    const visibleLines = lines.filter(line => selectedGrocers[line.grocer.name])
    
    const yScale = scaleLinear()  // from 0 to the highest coupon count
      .domain(
        [
          0, 
          max(lines, line => {
            return Math.max(...line.pairs.map(obj => obj.numActive))
          })
        ]
      )
      .range([height, 0])

    // anote another possibility - make x-scale fixed
    const xScale = scaleTime()
      .domain([minScaleDate, maxScaleDate])
      .range([0, width])

    const yAxis = axisLeft(yScale)
    svg
      .select(".y-axis")
      .call(yAxis)

    const xAxis = axisBottom(xScale)
      .ticks(12)
    svg
      .select(".x-axis")
      .style("transform", `translateY(${height}px)`)
      .call(xAxis)

    const genLine = line()
      .x(pair => xScale(pair["date"]))
      .y(pair => yScale(pair["numActive"]))
    
    const maybeFaded = color => {
      if (!hoverColor || color === hoverColor) {
        return color
      } else {
        return color + "22"
      }
    }
    // lines
    svg
      .selectAll(".line")
      .data(visibleLines)
      .join("path")
      .attr("d", val => {
        return genLine(val.pairs)
      })
      .attr("fill", "none")
      .attr("stroke", val => {
        const color = colors[val.grocer.name]
        return maybeFaded(color)
      })
      .attr("stroke-width", "2")
      .attr("class", "line")

      // datapoints
      const pointsWithGrocerName = visibleLines.reduce((ret, line) => {
        // collects just the pair objects consisting of
        // date, numActive, and grocerName
        return ret.concat(line.pairs)
      }, [])

      svg
        .selectAll(".data-point")
        .data(pointsWithGrocerName)
        .join("circle")
        .attr("class", "data-point")
        .attr("fill", point => {
          const color = colors[point.grocerName]
          return maybeFaded(color)
        })
        .attr("stroke", "none")
        .attr("cx", point => xScale(point.date))
        .attr("cy", point => yScale(point.numActive))
        .attr("r", 3)
        .on("mouseenter", (event, hoverPoint) => {
          const toolTipNum = hoverPoint.numActive
          const toolTipDate = hoverPoint.date
          const toolTipName = hoverPoint.grocerName
          // anote you don't necessarily have to do this here,
          // just grab that info from the passed in hoverPoint data
          svg
            .selectAll("active-counts-tooltip")
            .data([hoverPoint])
            .join((enter) => {
              return enter.append("text")
                .attr("y", yScale(toolTipNum) - 4)
                .attr("opacity", 0)
            })
            .attr("class", "active-counts-tooltip")
            .text(`${toolTipName}: ${toolTipNum} (${toolTipDate.toDateString()})`)
            .attr("x", xScale(toolTipDate))
            .transition()
            .attr("y", yScale(toolTipNum) - 25)
            .attr("opacity", 1)
            
            setHoverColor(colors[toolTipName])
          })
          .on("mouseleave", (event, hoverPoint) => {
            svg.select(".active-counts-tooltip").remove()
            setHoverColor(null)
          })

  }, 
  [
    grocers.length,
    wrapperContentRect,
    earlyDate,
    lateDate,
    minScaleDate,
    maxScaleDate,
    colors,
    Object.values(selectedGrocers).filter(checked => checked).length,
    hoverColor
  ])
  // atodo dependency array has ARRAYs in it (grocers, selected grocers)
  
  return <React.Fragment >
    <div className="data-wrapper" ref={wrapperRef} >
      <svg ref={svgRef}>
        <g className="x-axis" />
        <g className="y-axis" />
      </svg>
    </div>
    <Legend 
      selectedGrocers={selectedGrocers} 
      setSelectedGrocers={setSelectedGrocers}
      hoverColor={hoverColor}
      setHoverColor={setHoverColor}
      colors={colors}
    />
  </React.Fragment>
}

export default CouponLineChart
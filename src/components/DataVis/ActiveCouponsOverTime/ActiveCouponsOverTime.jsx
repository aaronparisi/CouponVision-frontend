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

const CouponLineChart = ({ grocers, earlyDate, lateDate, colors }) => {
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

  const removeApostrophe = string => {
    return string
    .split('')
    .filter(char => /[^']/.test(char)).join('')
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
      grocers.some(grocer => grocer.coupons === undefined)
    ) return

    const getNumActiveCoupons = grocer => {
      // returns an array of objects
      // the objects represent the number of active coupons at a date
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

    const visibleLines = lines.filter(line => selectedGrocers[line.grocer.name])
    
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
      .domain([earlyDate, lateDate])
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
      .x(pair => xScale(pair["date"]))
      .y(pair => yScale(pair["numActive"]))
    
    // lines
    svg
      .selectAll(".line")
      .data(visibleLines)
      .join("path")
      .attr("d", val => {
        return genLine(val.pairs)
      })
      .attr("fill", "none")
      .attr("stroke", (val, idx) => {
        const color = colors[val.grocer.name]
        const fadedColor = color + "33"
        if (!hoverColor || color === hoverColor) {
          return color
        } else {
          return fadedColor
        }
      })
      .attr("stroke-width", "2")
      .attr("class", "line")

      // datapoints
      const pointsWithGrocerName = visibleLines.reduce((ret, line) => {
        return ret.concat(line.pairs)
      }, [])

      svg
        .selectAll(".data-point")
        .data(pointsWithGrocerName)
        .join("circle")
        .attr("class", "data-point")
        .attr("fill", point => {
          const color = colors[point.grocerName]
          const fadedColor = color + "33"
          if (!hoverColor || color === hoverColor) {
            return color
          } else {
            return fadedColor
          }
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
                .attr("x", xScale(lateDate) + 2)
            })
            .attr("class", "active-counts-tooltip")
            .text(`${toolTipName}: ${toolTipNum} on ${toolTipDate.toDateString()}`)
            .attr("y", yScale(toolTipNum))
            .transition()
            .attr("x", xScale(lateDate) + 4)
            .attr("opacity", 1)

          // highlight corresponding legend label
          document
            .getElementById(`grocer-checkbox-${removeApostrophe(toolTipName)}`)
            .classList.add("hovered")
          })
          .on("mouseleave", (event, hoverPoint) => {
            svg.select(".active-counts-tooltip").remove()

            // remove legend label highlight
            document
              .getElementById(`grocer-checkbox-${removeApostrophe(hoverPoint.grocerName)}`)
              .classList.remove("hovered")
          })

  }, 
  [
    grocers.length,
    wrapperContentRect,
    earlyDate,
    lateDate,
    colors,
    Object.values(selectedGrocers).filter(checked => checked).length,
    hoverColor
  ])
  // atodo dependency array has ARRAYs in it (grocers, selected grocers)
  //  => how to test array equality?
  
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
            <div 
              className="grocer-checkbox" 
              key={idx} 
              id={`grocer-checkbox-${removeApostrophe(grocer_name)}`}
              data-grocer-name={grocer_name}
              onMouseEnter={e => {
                setHoverColor(colors[e.currentTarget.innerText])
              }}
              onMouseLeave={e => {
                setHoverColor(null)
              }}
            >
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
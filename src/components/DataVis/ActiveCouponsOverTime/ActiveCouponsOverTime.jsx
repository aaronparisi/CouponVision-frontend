import React, { useEffect, useRef, useState } from 'react'
import {
  select,
  scaleLinear,
  line,
  axisLeft,
  axisBottom,
  max,
  scaleTime,
  scaleSequential,
} from 'd3'

import * as d3Chromatic from 'd3-scale-chromatic'
import rgbHex from 'rgb-hex'

import {
  addMonths
} from 'date-fns'

import useResizeObserver from '../../../helpers/useResizeObserver'
import Legend from './Legend'
import { couponIsActive } from '../../../helpers/coupons_helpers'

const CouponLineChart = ({ 
  grocers, 
  earlyDate, 
  lateDate, 
  minScaleDate, 
  maxScaleDate, 
  colors, 
  loading 
}) => {
  const svgRef = useRef()
  const wrapperRef = useRef()
  const wrapperContentRect = useResizeObserver(wrapperRef)

  const [selectedGrocers, setSelectedGrocers] = useState({})
  const [hoverColor, setHoverColor] = useState(null)

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

    const numLines = lines.length
    const grocerColorIdxs = {}
    lines.forEach((line, idx) => {
      grocerColorIdxs[line.grocer.name] = idx / numLines
    })

    const colorScale = scaleSequential()
      .interpolator(d3Chromatic.interpolateSinebow)
      // .interpolator(d3Chromatic.interpolateRainbow)
      // .interpolator(d3Chromatic.interpolateTurbo)
    
    const maybeFaded = color => {
      if (color[0] === "#") {
        if (!hoverColor || color === hoverColor) {
          return color
        } else {
          return color + "22"
        }
      } else {
        if (!hoverColor || color === hoverColor) {
          return `#${rgbHex(color)}`
        } else {
          return `#${rgbHex(color)}` + "22"
        }
      }
    }

    const getColorFromName = name => {
      return colorScale(grocerColorIdxs[name])
    }

    const getMaybeFadedFromName = name => {
      return maybeFaded(getColorFromName(name))
    }
    
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
        return getMaybeFadedFromName(val.grocer.name)
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
        return getMaybeFadedFromName(point.grocerName)
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
          .attr("x", () => {
            const initVal = xScale(toolTipDate)
            const overflow = Math.max(0, initVal + 200 - width)
            return initVal - overflow
          })
          .transition()
          .attr("y", yScale(toolTipNum) - 25)
          .attr("opacity", 1)
          
          setHoverColor(getColorFromName(toolTipName))
        })
        .on("mouseleave", (event, hoverPoint) => {
          svg.select(".active-counts-tooltip").remove()
          setHoverColor(null)
        })

    // legend
    svg
      .selectAll(".legend-label")
      .data(lines)
      .join("text")
      .attr("class", "legend-label")
      .attr("fill", () => "black")
      .text(val => val.grocer.name)
      .attr("x", (val, i) => ((i+1) * (width / 5)) % width)
      .attr("y", (val, i) => height + 25 + (Math.ceil((i+1) / 5)) * 25)
      .style("text-decoration", val => {
        return (selectedGrocers[val.grocer.name]) ? "none" : "line-through"
      })
      .on("mouseenter", (event, label) => {
        const curName = label.grocer.name
        if (selectedGrocers[curName]) {
          // setHoverColor(colors[curName])
          setHoverColor(getColorFromName(curName))
        }
      })
      .on("mouseleave", () => {
        setHoverColor(null)
      })
      .on("click", (event, label) => {
        const curName = label.grocer.name
        setSelectedGrocers({
          ...selectedGrocers,
          [curName]: (!selectedGrocers[curName])
        })
        setHoverColor((hoverColor) ? null : getColorFromName(curName))
      })

    svg
      .selectAll(".legend-checkbox")
      .data(lines)
      .join("circle")
      .attr("class", "legend-checkbox")
      .attr("cx", (val, i) => (((i+1) * (width / 5)) % width) - 15)
      .attr("cy", (val, i) => height + 20 + (Math.ceil((i+1) / 5)) * 25)
      .attr("r", 7)
      .style("fill", val => {
        if (selectedGrocers[val.grocer.name]) {
          return getMaybeFadedFromName(val.grocer.name)
        } else {
          return "transparent"
        }
      })
      .style("stroke", val => {
        if (selectedGrocers[val.grocer.name]) {
          return getMaybeFadedFromName(val.grocer.name)
        } else {
          return "black"
        }
      })
      .on("mouseenter", (event, checkbox) => {
        const curName = checkbox.grocer.name
        if (selectedGrocers[curName]) {
          setHoverColor(getColorFromName(curName))
        }
      })
      .on("mouseleave", () => {
        setHoverColor(null)
      })
      .on("click", (event, checkbox) => {
        const curName = checkbox.grocer.name
        setSelectedGrocers({
          ...selectedGrocers,
          [curName]: (!selectedGrocers[curName])
        })
        setHoverColor((hoverColor) ? null : getColorFromName(curName))
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

  const Loading = () => {

    return <div className="loading">Loading...</div>
  }

  const overRide = (truthVal) => {
    return Object
      .fromEntries(Object.keys(selectedGrocers).map(grocer => [grocer, truthVal]))
  }
  
  return <React.Fragment >
    <div className="data-wrapper" ref={wrapperRef} >
      <div className="legend-buttons">
        <button
          onClick={e => {
            setSelectedGrocers(overRide(true))
          }}
        >
          Select All
        </button>
        <button
          onClick={e => {
            setSelectedGrocers(overRide(false))
          }}
        >
          De-Select All
        </button>
      </div>
      {loading
        ? <Loading />
        : <svg ref={svgRef}>
            <g className="x-axis" />
            <g className="y-axis" />
          </svg>
      }
    </div>
    {/* <Legend 
      selectedGrocers={selectedGrocers} 
      setSelectedGrocers={setSelectedGrocers}
      hoverColor={hoverColor}
      setHoverColor={setHoverColor}
      colors={colors}
    /> */}
  </React.Fragment>
}

export default CouponLineChart
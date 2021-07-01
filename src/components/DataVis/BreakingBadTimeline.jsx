import React, { useEffect, useRef } from 'react'
import {
  select,
  min,  // for x-axis
  max,  // for x-axis
  scaleTime,
  scaleLinear,
  axisBottom
} from 'd3'

import useResizeObserver from '../../helpers/useResizeObserver'

const getDate = dateString => {
  const date = dateString.split("-")
  return new Date(date[2], date[0] - 1, date[1])
}

const BreakingBadTimeline = ({ episodes, selectedCharacters }) => {
  const svgRef = useRef()
  const wrapperRef = useRef()
  const wrapperContentRect = useResizeObserver(wrapperRef)

  useEffect(() => {
    const hasCharacters = characters => {
      if (
        (selectedCharacters.length > 0) &&
        (selectedCharacters.some(selChar => selChar !== undefined)) &&
        (selectedCharacters.every(selChar => {
          return selChar === undefined || characters.includes(selChar)
        }))
      ) {
        return "lime"
      } else {
        return "black"
      }
    }

    const svg = select(svgRef.current)
    if (! wrapperContentRect) return

    // create y-scale (maps # of main chars in ep to height of bar)
    const yScale = scaleLinear()
      .domain([max(episodes, episode => episode.characters.length), 0])
      .range([0, wrapperContentRect.height])

    // create x-axis timeline
    const minDate = min(episodes, episode => getDate(episode.air_date))
    const maxDate = max(episodes, episode => getDate(episode.air_date))

    const xScale = scaleTime()
      .domain([minDate, maxDate])
      .range([0, wrapperContentRect.width])

    const xAxis = axisBottom(xScale)
    svg
      .select(".x-axis")
      .call(xAxis)
      .style("transform", `translateY(${wrapperContentRect.height}px)`)

    // episode bars
    svg
      .selectAll(".episode")
      .data(episodes)
      .join("line")
      .attr("class", "episode")
      .attr("stroke", episode => hasCharacters(episode.characters))
      .attr("x1", episode => xScale(getDate(episode.air_date)))
      .attr("x2", episode => xScale(getDate(episode.air_date)))
      .attr("y1", wrapperContentRect.height)
      .attr("y2", episode => yScale(episode.characters.length))

  }, [episodes, wrapperContentRect, selectedCharacters])

  return <React.Fragment >
    <div className="data-wrapper" ref={wrapperRef}>
      <svg ref={svgRef}>
        <g className="x-axis" />
      </svg>
    </div>
  </React.Fragment>
}

export default BreakingBadTimeline

import React, { useEffect, useMemo, useRef } from 'react'
import {
  select,
  min,  // for x-axis
  max,  // for x-axis
  scaleTime,
  scaleLinear,
  axisBottom
} from 'd3'

import useResizeObserver from '../../../helpers/useResizeObserver'

const getDate = dateString => {
  const date = dateString.split("-")
  return new Date(date[2], date[0] - 1, date[1])
}

const BreakingBadTimeline = ({ episodes, selectedCharacters }) => {
  // episodes: array representing all episodes
  // selectedCharacters: array representing characters selected by dropdowns
  const svgRef = useRef()
  const wrapperRef = useRef()
  const wrapperContentRect = useResizeObserver(wrapperRef)

  useEffect(() => {
    console.log(JSON.stringify(selectedCharacters))
    const hasCharacters = characters => {
      // given an array of characters, representing the characters
      // in a particular episode,
      // returns true if ALL of the selectedCharacters are in that array
      if (selectedCharacters.length === 0) {
        return false
      } else {
        return selectedCharacters.every(selChar => characters.includes(selChar))
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
      .attr("stroke", episode => {
        if (hasCharacters(episode.characters)) {
          return "lime"
        } else {
          return "black"
        }
      })
      .attr("x1", episode => xScale(getDate(episode.air_date)))
      .attr("x2", episode => xScale(getDate(episode.air_date)))
      .attr("y1", wrapperContentRect.height)
      .attr("y2", episode => yScale(episode.characters.length))

  }, [JSON.stringify(episodes), wrapperContentRect, JSON.stringify(selectedCharacters)])

  return <React.Fragment >
    <div className="data-wrapper" ref={wrapperRef}>
      <svg ref={svgRef}>
        <g className="x-axis" />
      </svg>
    </div>
  </React.Fragment>
}

export default BreakingBadTimeline

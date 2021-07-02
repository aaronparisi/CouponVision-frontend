import React, { useState } from 'react'
import RacingBarChart from './RacingBarChart'
import useInterval from '../../helpers/useInterval'

const getRandomIndex = array => {
  return Math.floor(array.length * Math.random())
}

const resetData = () => {
  return [
    {
      name: "alpha",
      value: 10,
      color: "#fdfd96"
    },
    {
      name: "beta",
      value: 10,
      color: "#45C0A0"
    },
    {
      name: "charlie",
      value: 10,
      color: "#5D69CB"
    },
    {
      name: "delta",
      value: 10,
      color: "#9656a1"
    },
    {
      name: "echo",
      value: 10,
      color: "#fa697c"
    },
    {
      name: "foxtrot",
      value: 10,
      color: "#fcc169"
    },
  ]
}

const RacingBarChartWrapper = () => {
  const [iteration, setIteration] = useState(0)
  const [start, setStart] = useState(false)
  const [data, setData] = useState(resetData())

  const resetRace = () => {
  setStart(false)
  setData(resetData())
  setIteration(0)
  }

  useInterval(() => {
    if (start) {
      const randomIndex = getRandomIndex(data)

      setData(
        data.map((entry, idx) => {
          if (idx === randomIndex) {
            return { ...entry, value: entry.value + 10 }
          } else {
            return entry
          }
        })
      )

      setIteration(iteration + 1)
    }
  }, 200)
  
  return (
    <div className="data-vis">
      <h1>Racing Bar Chart</h1>
      <RacingBarChart data={data} />
      <div className="data-buttons">
        <button
          onClick={(() => setStart(!start))}
          style={{fontSize: "50px"}}
        >
          {start ? "🛑" : "🏁"}
        </button>
        <button
          onClick={(() => resetRace())}
          style={{fontSize: "50px"}}
        >
          🔁
        </button>
        <p>Iteration: {iteration}</p>
      </div>
    </div>
  )
}

export default RacingBarChartWrapper
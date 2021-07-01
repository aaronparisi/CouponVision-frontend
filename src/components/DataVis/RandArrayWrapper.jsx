import React, { useState } from 'react'

const RandArrayWrapper = ({ Comp }) => {
  const maxData = 500
  const originalNumData = 5

  const randArray = () => {
    return Array.from({length: originalNumData}, () => randInt(maxData))
  }
  
  const randInt = max => {
    return Math.floor(Math.random() * max)
  }

  const addData = () => {
    setNumData(numData + 1)
    setData(data => [...data, randInt(maxData)])
  }

  const [numData, setNumData] = useState(originalNumData)
  const [data, setData] = useState(randArray())

  return (
    <React.Fragment >
      <Comp data={data} maxData={maxData} />
      <div className="data-buttons">
        <button onClick={() => setData(randArray())}>
          Update Data
        </button>
        <button onClick={() => setData(data => {
          return data.map(val => (val >= maxData*.75) ? 0 : val)
        })}>
          Filter Data
        </button>
        <button onClick={e => addData()}>
          Add Data
        </button>
      </div>
    </React.Fragment>
  )
}

export default RandArrayWrapper

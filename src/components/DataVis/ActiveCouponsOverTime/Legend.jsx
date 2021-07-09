import React from 'react'

const Legend = ({ selectedGrocers, setSelectedGrocers, hoverColor, setHoverColor, colors }) => {
  const MyCheckbox = ({ color, grocerName, checked }) => {
  
    return (
      <div 
        className="checkbox"
        id={grocerName}
        style={{ backgroundColor: color }}
      >
        { (checked) ? `\u2714` : "" }
      </div>
    )
  }

  return (
    <div className="legend">
      {
        Object.keys(selectedGrocers).map((grocerName, idx) => {
          return (
            <div 
              className="grocer-checkbox" 
              key={idx}
              data-grocer-name={grocerName}
              style={{ 
                backgroundColor: (hoverColor === colors[grocerName]) ? hoverColor + "33" : "#eeeeee"
              }}
              onClick={e => {
                e.preventDefault()
                const checked = selectedGrocers[grocerName]
                const color = colors[grocerName]

                if (!checked) {
                  setHoverColor(color)
                } else {
                  setHoverColor(null)
                }
          
                setSelectedGrocers({
                  ...selectedGrocers,
                  [grocerName]: !checked
                })
              }}
              onMouseEnter={e => {
                if (selectedGrocers[grocerName]) {
                  setHoverColor(colors[grocerName])
                }
              }}
              onMouseLeave={e => {
                setHoverColor(null)
              }}
            >
              <MyCheckbox 
                grocerName={grocerName} 
                color={colors[grocerName]}
                checked={selectedGrocers[grocerName]}
              />
              <label htmlFor={`${grocerName}`}>
                {grocerName}
              </label>
            </div>
          )
        })
      }
    </div>
  )
}

export default Legend
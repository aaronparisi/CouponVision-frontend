import React, { useEffect, useState } from 'react'
import BreakingBadTimeline from './BreakingBadTimeline'

const BreakingBadTimelineWrapper = () => {
  const [episodes, setEpisodes] = useState([]);
  const [characters, setCharacters] = useState([]);
  const [selectedCharacters, setSelectedCharacters] = useState({})
  const [numCharacterDropdowns, setNumCharacterDropdowns] = useState(0)

  const MySelect = ({ character, idx }) => {

    const handleCharacterSelect = e => {
      e.preventDefault()

      setSelectedCharacters({
        ...selectedCharacters,
        [e.currentTarget.dataset.idx]: e.currentTarget.value
      })
    }
    
    return (
      <select 
        value={character}
        onChange={e => handleCharacterSelect(e)}
        data-idx={idx}
      >
        <option>Select Character</option>
        {characters.map(character => (
          <option key={character.name}>{character.name}</option>
        ))}
      </select>
    )
  }

  const addCharacterDropdown = () => {
    if (numCharacterDropdowns >= characters.length) return

    setNumCharacterDropdowns(numCharacterDropdowns + 1)
  }

  const removeCharacterDropdown = () => {
    if (numCharacterDropdowns <= 0) return
    
    const newSelected = selectedCharacters
    delete newSelected[numCharacterDropdowns]
    setSelectedCharacters(newSelected)

    setNumCharacterDropdowns(numCharacterDropdowns - 1)
  }

  useEffect(() => {
    // get episodes
    fetch("https://www.breakingbadapi.com/api/episodes?series=Breaking+Bad")
      .then(response => response.ok && response.json())
      .then(episodes => {
        console.warn(episodes);
        setEpisodes(episodes);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    // get all characters, filter for main characters
    const isMainChar = char => {
      // given a character,
      // returns true if the character is a main character in ANY episode
      return episodes.some(ep => ep.characters.includes(char.name))
    }

    fetch("https://www.breakingbadapi.com/api/characters?category=Breaking+Bad")
      .then(response => response.ok && response.json())
      .then(characters => {
        setCharacters(
          characters
            .filter(char => isMainChar(char))
            .sort((a, b) => a.name.localeCompare(b.name))
        );
      })
      .catch(console.error);
  }, [JSON.stringify(episodes)]);

  const charArr = Array.from(Object.values(selectedCharacters))
  return (
    <div className="data-vis">
      <h1>Breaking Bad Timeline</h1>
      <BreakingBadTimeline 
        episodes={episodes} 
        selectedCharacters={charArr}
      />
      <br />
      <br />
      <br />
      <h2>Select character(s)</h2>
      <div className="breaking-buttons">
        <button onClick={e => addCharacterDropdown(e)}>
          +
        </button>
        <button onClick={e => removeCharacterDropdown(e)}>
          -
        </button>
      </div>
      <div className="data-dropdown">
        {
          Array(numCharacterDropdowns)
            .fill()
            .map((x, idx) => {
            return (
              <MySelect 
                key={idx+1} 
                idx={idx+1}
                character={selectedCharacters[idx+1]} 
              />
            )
          })
        }
      </div>
    </div>
  );
}

export default BreakingBadTimelineWrapper

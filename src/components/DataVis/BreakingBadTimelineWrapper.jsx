import React, { useEffect, useState } from 'react'
import BreakingBadTimeline from './BreakingBadTimeline'

const BreakingBadTimelineWrapper = () => {
  const [episodes, setEpisodes] = useState([]);
  const [characters, setCharacters] = useState([]);
  const [selectedCharacters, setSelectedCharacters] = useState({})
  const [numSelectedCharacters, setNumSelectedCharacters] = useState(0)

  const MySelect = ({ idx }) => {
    const handleCharacterSelect = e => {
      e.preventDefault()

      const newVal = (e.target.value === "Select Character") ? undefined : e.currentTarget.value

      setSelectedCharacters(prevState => {
        const newState =({ ...prevState })
        newState[e.target.dataset["charIdx"]] = newVal
        return newState
      })
    }

    return (
      <select 
        value={selectedCharacters[idx]}
        onChange={e => handleCharacterSelect(e)}
        data-char-idx={idx}
      >
        <option>Select Character</option>
        {characters.map(character => (
          <option key={character.name}>{character.name}</option>
        ))}
      </select>
    )
  }

  const addCharacter = () => {
    if (numSelectedCharacters >= characters.length) return

    setNumSelectedCharacters(numSelectedCharacters + 1)

    setSelectedCharacters({
      ...selectedCharacters,
      [numSelectedCharacters]: undefined
    })
  }

  const removeCharacter = () => {
    if (numSelectedCharacters <= 0) return

    setSelectedCharacters({
      ...selectedCharacters,
      numSelectedCharacters: undefined
    })

    setNumSelectedCharacters(numSelectedCharacters - 1)
  }

  useEffect(() => {
    fetch("https://www.breakingbadapi.com/api/episodes?series=Breaking+Bad")
      .then(response => response.ok && response.json())
      .then(episodes => {
        console.warn(episodes);
        setEpisodes(episodes);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
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
  }, [episodes]);

  return (
    <div className="data-vis">
      <h1>Breaking Bad Timeline</h1>
      <BreakingBadTimeline 
        episodes={episodes} 
        selectedCharacters={Array.from(Object.values(selectedCharacters))}
      />

      <div className="data-dropdown">
        <h2>Select character(s)</h2>
        {
          [...Array(numSelectedCharacters).keys()].map(idx => {
            return <MySelect key={idx} idx={idx} />
          })
        }
        <button onClick={e => addCharacter(e)}>
          +
        </button>
        <button onClick={e => removeCharacter(e)}>
          -
        </button>
      </div>
    </div>
  );
}

export default BreakingBadTimelineWrapper

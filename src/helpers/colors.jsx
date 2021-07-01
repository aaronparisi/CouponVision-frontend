export const randColor = () => {
  return '#'+Math.floor(Math.random()*16777215).toString(16)
}

export const randColors = (length) => {
  return Array.from(
    { length: length },
    () => randColor()
  )
}

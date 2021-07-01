import { useEffect, useRef  } from "react";

const useInterval = (callback, delay) => {
  const savedCallback = useRef()

  // remember the latest callback
  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  // set up interval
  useEffect(() => {
    const tick = () => {
      savedCallback.current()  // ! actually CALL the current callback
    }

    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id)
    }
  }, [delay])
}

export default useInterval
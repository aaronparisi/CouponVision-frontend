import { useState, useEffect } from 'react'

const useResizeObserver = ref => {
  // the ref will be for the wrapper div
  const [contentRect, setContentRect] = useState(null);

  useEffect(() => {
    const observeTarget = ref.current
    const resizeObserver = new ResizeObserver(entries => {
      entries.forEach(entry => {
        setContentRect(entry.contentRect)
      })
    })
    
    resizeObserver.observe(observeTarget)
    return () => {
      resizeObserver.unobserve(observeTarget);
    }
  }, [ref])
  
  return contentRect;
}

export default useResizeObserver
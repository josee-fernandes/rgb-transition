import './styles/global.css'

import { useCallback, useEffect, useRef, useState } from 'react'

import { hexToRGBString, rgbColorByPercentage } from './utils/color'

// Sample rgb string colors
const START_COLOR = 'rgb(255, 123, 202)'
const CENTER_COLOR = 'rgb(85, 70, 255)'
const END_COLOR = 'rgb(191, 255, 0)'

export const App: React.FC = () => {
  const [currentColor, setCurrentColor] = useState(CENTER_COLOR)

  const colorDisplayRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (!colorDisplayRef.current) return

    const screenCenterX = window.innerWidth / 2
    const cursorPositionX = event.clientX

    if (cursorPositionX > screenCenterX) {
      // Right / End
      const cursorXPercentage = (100 * cursorPositionX) / screenCenterX - 100
      const colorString = rgbColorByPercentage({
        start: CENTER_COLOR,
        end: END_COLOR,
        percentage: cursorXPercentage,
      })

      setCurrentColor(colorString)

      colorDisplayRef.current.style.background = colorString
    } else {
      // Left / Start
      const cursorXPercentage = Math.abs(
        (100 * cursorPositionX) / screenCenterX - 100,
      )
      const colorString = rgbColorByPercentage({
        start: CENTER_COLOR,
        end: START_COLOR,
        percentage: cursorXPercentage,
      })

      setCurrentColor(colorString)

      colorDisplayRef.current.style.background = colorString
    }
  }, [])

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove)

    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [handleMouseMove])

  return (
    <main className="wrapper container">
      <h1>RGB Transition</h1>
      <div className="colors-info">
        <div>
          <h2>Start</h2>
          <p>{START_COLOR}</p>
        </div>
        <div>
          <h2>Center</h2>
          <p>{CENTER_COLOR}</p>
        </div>
        <div>
          <h2>End</h2>
          <p>{END_COLOR}</p>
        </div>
      </div>
      <div ref={colorDisplayRef} className="color-display" />
      {hexToRGBString(currentColor)}
    </main>
  )
}

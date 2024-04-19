import './styles/global.css'

import { parseToRgb } from 'polished'
import { RgbColor } from 'polished/lib/types/color'
import { useCallback, useEffect, useRef, useState } from 'react'

import { rgbColorByPercentage } from './utils/color'

// Sample rgb string colors
const START_COLOR = 'rgb(255, 123, 202)'
const CENTER_COLOR = 'rgb(85, 70, 255)'
const END_COLOR = 'rgb(191, 255, 0)'

// Parse to RGB Object
const startColor = parseToRgb(START_COLOR)
const centerColor = parseToRgb(START_COLOR)
const endColor = parseToRgb(END_COLOR)

export const App: React.FC = () => {
  const [currentColor, setCurrentColor] = useState<RgbColor>({
    red: 0,
    green: 0,
    blue: 0,
  })

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

      colorDisplayRef.current.style.background = colorString
    }
  }, [])

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove)

    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [handleMouseMove])

  return (
    <div className="container">
      <div ref={colorDisplayRef} className="color-display" />
    </div>
  )
}

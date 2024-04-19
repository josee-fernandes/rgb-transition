import './styles/global.css'

import { parseToRgb, rgbToColorString } from 'polished'
import { RgbColor } from 'polished/lib/types/color'
import { useCallback, useEffect, useRef, useState } from 'react'

const getColorValue = (percentage: number, from: number, to: number) => {
  if (from < to) {
    return Math.max(Math.round((to * percentage) / 100), from)
  } else {
    const totalDifference = from - to

    const differenceToAdd = Math.round((totalDifference * percentage) / 100)

    return from - differenceToAdd
  }
}

const MAX_COLOR = 'rgb(191, 255, 0)'
const CENTER_COLOR = 'rgb(85, 70, 255)'
const MIN_COLOR = 'rgb(255, 123, 202)'

const defaultState: RgbColor = {
  red: 0,
  green: 0,
  blue: 0,
}

export const App: React.FC = () => {
  const [currentColor, setCurrentColor] = useState<RgbColor>(defaultState)
  const [centerColor, setCenterColor] = useState<RgbColor>(defaultState)
  const [maxColor, setMaxColor] = useState<RgbColor>(defaultState)

  const container = useRef<HTMLDivElement>(null)

  const getNewRGBColor = (from: string, to: string, percentage: number) => {
    // parsing to rgb object
    const minRGB = parseToRgb(from)
    const toRGB = parseToRgb(to)

    // merging to a single object
    const colors = {
      red: {
        from: minRGB.red,
        to: toRGB.red,
      },
      green: {
        from: minRGB.green,
        to: toRGB.green,
      },
      blue: {
        from: minRGB.blue,
        to: toRGB.blue,
      },
    }

    // new color
    const newRGB = {
      red: getColorValue(percentage, colors.red.from, colors.red.to),
      green: getColorValue(percentage, colors.green.from, colors.green.to),
      blue: getColorValue(percentage, colors.blue.from, colors.blue.to),
    }

    const colorString = rgbToColorString(newRGB)

    setCurrentColor(newRGB)
    setCenterColor(minRGB)
    setMaxColor(toRGB)

    return colorString
  }

  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (!container.current) return

    const center = window.innerWidth / 2
    const cursorX = event.clientX

    if (cursorX > center) {
      const cursorXPercentage = (100 * cursorX) / center - 100
      const colorString = getNewRGBColor(
        CENTER_COLOR,
        MAX_COLOR,
        cursorXPercentage,
      )

      container.current.style.background = colorString
    } else {
      const cursorXPercentage = Math.abs((100 * cursorX) / center - 100)
      const colorString = getNewRGBColor(
        CENTER_COLOR,
        MIN_COLOR,
        cursorXPercentage,
      )

      container.current.style.background = colorString
    }
  }, [])

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove)

    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [handleMouseMove])

  return (
    <div ref={container} className="container">
      <p>Center: {JSON.stringify(centerColor)}</p>
      <p>Max: {JSON.stringify(maxColor)}</p>
      <p>Current: {JSON.stringify(currentColor)}</p>
    </div>
  )
}

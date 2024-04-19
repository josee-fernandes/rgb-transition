import './styles/global.css'

import { parseToRgb, rgbToColorString } from 'polished'
import { RgbColor } from 'polished/lib/types/color'
import { useCallback, useEffect, useRef, useState } from 'react'

const getColorValue = (percentage: number, from: number, to: number) => {
  if (from < to) {
    const newValue = Math.round((to * percentage) / 100)

    return newValue < from ? from : newValue
  } else {
    const newValue = Math.round((from * percentage) / 100)

    return from - (newValue < to ? to : newValue)
  }
}

const MAX_COLOR = 'rgb(191, 255, 0)'
const CENTER_COLOR = 'rgb(85, 70, 255)'
const MIN_COLOR = '#ff7bca'

export const App: React.FC = () => {
  const [currentColor, setCurrentColor] = useState<RgbColor>({
    red: 0,
    green: 0,
    blue: 0,
  })
  const [centerColor, setCenterColor] = useState<RgbColor>({
    red: 0,
    green: 0,
    blue: 0,
  })
  const [maxColor, setMaxColor] = useState<RgbColor>({
    red: 0,
    green: 0,
    blue: 0,
  })

  const container = useRef<HTMLDivElement>(null)

  const getNewRGBColor = (from: string, to: string, percentage: number) => {
    const minRGB = parseToRgb(from)
    const toRGB = parseToRgb(to)

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
      container.current.style.background = MIN_COLOR
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

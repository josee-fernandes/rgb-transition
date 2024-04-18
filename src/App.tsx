import './styles/global.css'

import { useEffect, useRef, useState } from 'react'

const getColorValue = (percentage: number, maxValue: number) => {
  return (maxValue * percentage) / 100
}

const MAX_COLOR = 'rgb(255, 0, 0)'
const MIN_COLOR = 'rgb(0, 0, 255)'

export const App: React.FC = () => {
  const [percentage, setPercentage] = useState(0)
  const [maxColorValue, setMaxColorValue] = useState(0)

  const container = useRef<HTMLDivElement>(null)

  const handleMouseMove = (event: MouseEvent) => {
    if (!container.current) return
    // console.log('window innerWidth', window.innerWidth)
    // console.log('event clientX', event.clientX)

    const center = window.innerWidth / 2

    const cursorX = event.clientX

    if (cursorX > center) {
      container.current.style.background = MAX_COLOR
      console.log('direita')
    } else {
      container.current.style.background = MIN_COLOR
      console.log('esquerda')
    }
  }

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove)

    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div ref={container} className="container">
      <label>
        Percentage
        <input
          type="number"
          min={0}
          max={100}
          value={percentage}
          onChange={(event) => setPercentage(Number(event.target.value))}
        />
        %
      </label>
      <label>
        Max color value
        <input
          type="number"
          min={0}
          max={255}
          value={maxColorValue}
          onChange={(event) => setMaxColorValue(Number(event.target.value))}
        />
      </label>
      Calculated value: {getColorValue(percentage, maxColorValue)}
    </div>
  )
}

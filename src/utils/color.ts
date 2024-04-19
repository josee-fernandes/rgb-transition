import { parseToRgb, rgbToColorString } from 'polished'

interface ColorValueParams {
  percentage: number
  start: number
  end: number
}

type ColorValueFn = (params: ColorValueParams) => number

export const colorValue: ColorValueFn = ({ start, end, percentage }) => {
  if (start < end) {
    return Math.max(Math.round((end * percentage) / 100), start)
  } else {
    const totalDifference = start - end

    const differenceToAdd = Math.round((totalDifference * percentage) / 100)

    return start - differenceToAdd
  }
}

interface RgbColorByPercentageParams {
  start: string
  end: string
  percentage: number
}

type RgbColorByPercentageFn = (params: RgbColorByPercentageParams) => string

export const rgbColorByPercentage: RgbColorByPercentageFn = ({
  start,
  end,
  percentage,
}) => {
  // parsing to rgb object
  const startRGB = parseToRgb(start)
  const endRGB = parseToRgb(end)

  // merging to a single object
  const colors = {
    red: {
      start: startRGB.red,
      end: endRGB.red,
    },
    green: {
      start: startRGB.green,
      end: endRGB.green,
    },
    blue: {
      start: startRGB.blue,
      end: endRGB.blue,
    },
  }

  // new color
  const newRGB = {
    red: colorValue({
      start: colors.red.start,
      end: colors.red.end,
      percentage,
    }),
    green: colorValue({
      start: colors.green.start,
      end: colors.green.end,
      percentage,
    }),
    blue: colorValue({
      start: colors.blue.start,
      end: colors.blue.end,
      percentage,
    }),
  }

  return rgbToColorString(newRGB)
}

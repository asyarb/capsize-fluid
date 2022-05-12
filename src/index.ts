import { precomputeValues, type FontMetrics } from '@capsizecss/core'

function v(min: FluidFontSize, max: FluidFontSize) {
  const numerator = 100 * (max.fontSize - min.fontSize)
  const denominator = max.screenSize - min.screenSize

  return numerator / denominator
}

function r(min: FluidFontSize, max: FluidFontSize) {
  const numerator =
    min.screenSize * max.fontSize - max.screenSize * min.fontSize
  const denominator = min.screenSize - max.screenSize

  return numerator / denominator
}

export interface FluidFontSize {
  fontSize: number
  screenSize: number
}

export interface FluidCapsizeOptions {
  min: FluidFontSize
  max: FluidFontSize
  lineHeight: number
  rootFontSize: number
  fontMetrics: FontMetrics
}

export function precomputeFluidValues({
  max,
  min,
  lineHeight,
  rootFontSize,
  fontMetrics,
}: FluidCapsizeOptions) {
  const { baselineTrim, capHeightTrim } = precomputeValues({
    fontMetrics,
    fontSize: min.fontSize,
    leading: lineHeight * min.fontSize,
  })

  const vw = v(min, max)
  const rem = r(min, max)

  return {
    minFontSize: min.fontSize / rootFontSize + 'rem',
    maxFontSize: max.fontSize / rootFontSize + 'rem',
    baselineTrim,
    capHeightTrim,
    vw: Number.parseFloat(vw.toFixed(4)) + 'vw',
    rem: rem / rootFontSize + 'rem',
  }
}

export function createFluidStyleObject(arg: FluidCapsizeOptions) {
  const values = precomputeFluidValues(arg)

  return {
    fontSize: `clamp(${values.minFontSize}, ${values.vw} + ${values.rem}, ${values.maxFontSize})`,
    lineHeight: arg.lineHeight.toString(),

    '::before': {
      content: '""',
      display: 'table',
      marginBottom: values.capHeightTrim,
    },

    '::after': {
      content: '""',
      display: 'table',
      marginTop: values.baselineTrim,
    },
  }
}

export function createFluidStyleString(
  ruleName: string,
  arg: FluidCapsizeOptions
) {
  const {
    '::after': afterPseudo,
    '::before': beforePseudo,
    ...rootStyles
  } = createFluidStyleObject(arg)

  const objToCSSRules = <Property extends string>(
    stylesObj: Record<Property, string>,
    psuedoName?: string
  ) => `
.${ruleName}${psuedoName ? `::${psuedoName}` : ''} {
${Object.keys(stylesObj)
  .map(
    (property) =>
      `  ${property.replace(/[A-Z]/g, '-$&').toLowerCase()}: ${stylesObj[
        property as keyof typeof stylesObj
      ].replace(/'/g, '"')}`
  )
  .join(';\n')};
}`

  return [
    objToCSSRules(rootStyles),
    objToCSSRules(beforePseudo, 'before'),
    objToCSSRules(afterPseudo, 'after'),
  ].join('\n')
}

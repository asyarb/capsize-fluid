import { precomputeValues, type FontMetrics } from '@capsizecss/core'

function v(min: FluidFontSizeOptions, max: FluidFontSizeOptions) {
  const numerator = 100 * (max.fontSize - min.fontSize)
  const denominator = max.screenSize - min.screenSize

  return numerator / denominator
}

function r(min: FluidFontSizeOptions, max: FluidFontSizeOptions) {
  const numerator =
    min.screenSize * max.fontSize - max.screenSize * min.fontSize
  const denominator = min.screenSize - max.screenSize

  return numerator / denominator
}

export interface FluidFontSizeOptions {
  fontSize: number
  screenSize: number
}

export interface FluidCapsizeOptions {
  min: FluidFontSizeOptions
  max: FluidFontSizeOptions
  lineHeight: number
  rootFontSize: number
  fontMetrics: FontMetrics
}

export interface ComputedFluidValues {
  minFontSize: string
  maxFontSize: string
  baselineTrim: string
  capHeightTrim: string
  vw: string
  rem: string
}

export function precomputeFluidValues({
  max,
  min,
  lineHeight,
  rootFontSize,
  fontMetrics,
}: FluidCapsizeOptions): ComputedFluidValues {
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

interface PseudoStyles {
  content: string
  display: 'table'
}

export interface FluidStyleObject {
  fontSize: string
  lineHeight: string
  '::before': PseudoStyles & { marginBottom: string }
  '::after': PseudoStyles & { marginTop: string }
}

export function createFluidStyleObject(
  arg: FluidCapsizeOptions
): FluidStyleObject {
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
): string {
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

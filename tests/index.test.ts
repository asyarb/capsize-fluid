import { test, expect } from 'vitest'
import interFontMetrics from '@capsizecss/metrics/inter'

import {
  precomputeFluidValues,
  createFluidStyleObject,
  createFluidStyleString,
} from '../src'

const args = {
  max: { fontSize: 36, screenSize: 1440 },
  min: { fontSize: 24, screenSize: 360 },
  fontMetrics: interFontMetrics,
  lineHeight: 1.25,
  rootFontSize: 16,
}

test('precomputeFluidValues', () => {
  const result = precomputeFluidValues(args)

  expect(result).toMatchInlineSnapshot(`
    {
      "baselineTrim": "-0.2614em",
      "capHeightTrim": "-0.2614em",
      "maxFontSize": "2.25rem",
      "minFontSize": "1.5rem",
      "rem": "1.25rem",
      "vw": "1.1111vw",
    }
  `)
})

test('createFluidStyleObject', () => {
  const result = createFluidStyleObject(args)

  expect(result).toMatchInlineSnapshot(`
    {
      "::after": {
        "content": "\\"\\"",
        "display": "table",
        "marginTop": "-0.2614em",
      },
      "::before": {
        "content": "\\"\\"",
        "display": "table",
        "marginBottom": "-0.2614em",
      },
      "fontSize": "clamp(1.5rem, 1.1111vw + 1.25rem, 2.25rem)",
      "lineHeight": "1.25",
    }
  `)
})

test('createFluidStyleString', () => {
  const result = createFluidStyleString('fluid-capsize', args)

  expect(result).toMatchInlineSnapshot(`
    "
    .fluid-capsize {
      font-size: clamp(1.5rem, 1.1111vw + 1.25rem, 2.25rem);
      line-height: 1.25;
    }
    
    .fluid-capsize::before {
      content: \\"\\";
      display: table;
      margin-bottom: -0.2614em;
    }
    
    .fluid-capsize::after {
      content: \\"\\";
      display: table;
      margin-top: -0.2614em;
    }"
  `)
})

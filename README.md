# Capsize Fluid <!-- omit in toc -->

A small abstraction over
[`@capsizecss/core`](https://github.com/seek-oss/capsize) to create fluid
"capsized" typographic CSS styles.

Based on the fluid typography detailed in
[Smashing Magazine](https://www.smashingmagazine.com/2022/01/modern-fluid-typography-css-clamp/).

- [Installation](#installation)
- [Usage](#usage)
  - [`createFluidStyleObject`](#createfluidstyleobject)
    - [Example Output](#example-output)
  - [`createFluidStyleString`](#createfluidstylestring)
    - [Example Output](#example-output-1)
  - [`precomputeFluidValues`](#precomputefluidvalues)
- [CSS Variable Version](#css-variable-version)
- [License](#license)

## Installation

```bash
# npm
npm i --save-dev @asyarb/capsize-fluid
```

## Usage

### `createFluidStyleObject`

Returns a CSS-in-JS style object.

```tsx
import { createFluidStyleObject } from '@asyarb/capsize-fluid'
import metrics from '@capsizecss/metrics/inter'

const styles = createFluidStyleObject({
  max: { fontSize: 36, screenSize: 1440 },
  min: { fontSize: 24, screenSize: 360 },
  fontMetrics: metrics,
  lineHeight: 1.25,
  rootFontSize: 16,
})

const Example = () => <div css={styles} />
```

#### Example Output

```ts
const values = {
  fontSize: "clamp(1.5rem, 1.1111vw + 1.25rem, 2.25rem)",
  lineHeight: "1.25",
  "::after": {
    content: "\\"\\"",
    display: "table",
    marginTop: "-0.2614em",
  },
  "::before": {
    content: "\\"\\"",
    display: "table",
    marginBottom: "-0.2614em",
  }
}
```

### `createFluidStyleString`

Returns a CSS string that can be inserted into a style tag or appended to a
stylesheet.

```ts
import { createFluidStyleString } from '@asyarb/capsize-fluid'
import metrics from '@capsizecss/metrics/inter'

const styleRule = createFluidStyleString('fluid-capsize', {
  max: { fontSize: 36, screenSize: 1440 },
  min: { fontSize: 24, screenSize: 360 },
  fontMetrics: metrics,
  lineHeight: 1.25,
  rootFontSize: 16,
})

document.write(`
  <style type="text/css">
    ${styleRule}
  </style>
  <div class="fluid-capsize">
    My capsized text 🛶
  </div>
`)
```

#### Example Output

```css
.fluid-capsize {
  font-size: clamp(1.5rem, 1.1111vw + 1.25rem, 2.25rem);
  line-height: 1.25;
}

.fluid-capsize::before {
  content: \\'\\';
  display: table;
  margin-bottom: -0.2614em;
}

.fluid-capsize::after {
  content: \\'\\';
  display: table;
  margin-top: -0.2614em;
}
```

### `precomputeFluidValues`

Returns all the information required to create styles for a specific fluid font
size with the provided options.

```ts
import { precomputeFluidValues } from '@asyarb/capsize-fluid'
import metrics from '@capsizecss/metrics/inter'

const values = precomputeFluidValues({
  max: { fontSize: 36, screenSize: 1440 },
  min: { fontSize: 24, screenSize: 360 },
  fontMetrics: interFontMetrics,
  lineHeight: 1.25,
  rootFontSize: 16,
})

// `precomputeFluidValues` returns the following:
interface ComputedFluidValues {
  minFontSize: string
  maxFontSize: string
  baselineTrim: string
  capHeightTrim: string
  vw: string
  rem: string
}
```

## CSS Variable Version

If you are looking for a "plain" CSS version of this plugin, checkout this
[Gist](https://gist.github.com/asyarb/162bf0a8b5d238de01bd2832094727ad).

## License

MIT.

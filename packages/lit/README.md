# @dynamic-middle-ellipsis/lit

[![NPM](https://img.shields.io/npm/v/@dynamic-middle-ellipsis/lit)](https://www.npmjs.com/package/@dynamic-middle-ellipsis/lit)
[![GitHub Repo stars](https://img.shields.io/github/stars/LalitSinghRana/dynamic-middle-ellipsis)](https://github.com/LalitSinghRana/dynamic-middle-ellipsis.git)

Lit web component to dynamically truncate long text in the middle. Preserves the most important parts of your text with smart, responsive, and pixel-perfect text truncation.

### 🔗 [Live Demo](https://dynamic-middle-ellipsis-react.vercel.app/)

![demo](../../media/demo-high-frame-rate.gif)

## Features

- 🚀 **Smart Truncation**: Truncates in the middle, preserving important start/end content
- 📱 **Responsive**: Automatically adapts to container width changes
- 🎯 **Precise**: Font-aware calculations prevent over/under truncation  
- 🔧 **Complex Layouts**: Handles nested containers, parent element without width, shared siblings, padding, margins, etc.
- 📝 **Multi-line Support**: Wraps to multiple lines before truncating
- ⚡ **Performance**: O(log(n)) width calculations with efficient DOM updates
- 🎨 **Customizable**: Custom ellipsis symbols and line limits
- 🏗️ **TypeScript**: Full TypeScript support with proper types
- 🌐 **Web Component**: Framework-agnostic, works with any framework or vanilla JS
- 💡 **Lit-based**: Built with Lit for optimal performance and developer experience

## Installation

```bash
npm install @dynamic-middle-ellipsis/lit
```

## Quick Start

```html
<script type="module">
  import '@dynamic-middle-ellipsis/lit';
</script>

<middle-ellipsis>
  This text will truncate in the middle when space is limited
</middle-ellipsis>
```

### With Lit

```typescript
import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import '@dynamic-middle-ellipsis/lit';

@customElement('my-app')
class MyApp extends LitElement {
  render() {
    return html`
      <middle-ellipsis>
        Very long file name that needs truncation.pdf
      </middle-ellipsis>
    `;
  }
}
```

### With React

```tsx
import '@dynamic-middle-ellipsis/lit';

function App() {
  return (
    <middle-ellipsis>
      Very long file name that needs truncation.pdf
    </middle-ellipsis>
  );
}
```

### With Vue

```vue
<template>
  <middle-ellipsis>
    Very long file name that needs truncation.pdf
  </middle-ellipsis>
</template>

<script>
import '@dynamic-middle-ellipsis/lit';
</script>
```

## Examples

### Basic Usage
```html
<middle-ellipsis>
  Very long file name that needs truncation.pdf
</middle-ellipsis>
<!-- Result: "Very long file na...cation.pdf" -->
```

### Custom Ellipsis Symbol
```html
<middle-ellipsis ellipsis-symbol="[---]">
  Very long file name that needs truncation.pdf
</middle-ellipsis>
<!-- Result: "Very long file n[---]tion.pdf" -->
```

### Multi-line Support
```html
<middle-ellipsis line-limit="2">
  This text will wrap to 2 lines before truncating in the middle. 
  You can customize however you like.
</middle-ellipsis>
<!-- Result: 
  This text will wrap to 2 
  lines bef...dle. You can 
  customize however you like.
-->
```

## API Reference

### Attributes

- **`ellipsis-symbol`** (optional): Custom ellipsis symbol to display in the middle of truncated text
  - Type: `string`
  - Default: `"..."`

- **`line-limit`** (optional): Number of lines to allow before truncating
  - Type: `number`
  - Default: `1`

### Methods

#### `createMiddleEllipsis(config?)`

Creates a custom MiddleEllipsis component class with optional configuration.

**Parameters:**
- `config.customFontWidthMap?: FontWidthMap` - Custom font family mapping for precise calculations.

**Returns:** Custom `MiddleEllipsis` class

**Example:**
```typescript
import createMiddleEllipsis from '@dynamic-middle-ellipsis/lit';
import { customFontWidthMap } from './custom-font-width-map';

const CustomMiddleEllipsis = createMiddleEllipsis({
  customFontWidthMap,
});

// Register with a custom name
customElements.define('custom-middle-ellipsis', CustomMiddleEllipsis);
```

## Advanced Usage

### Precise Font Width Mapping

For pixel-perfect truncation across different browsers and fonts, you need to generate **font width mapping** for all the font-family in your website. 

1. Create `custom-font-family-map.ts` file:
  ```typescript
  import type { FontWidthMap } from "@dynamic-middle-ellipsis/lit";

  const chromeFontWidthMap: FontWidthMap = {};
  const firefoxFontWidthMap: FontWidthMap = {};

  export const customFontWidthMap: FontWidthMap = {
    ...chromeFontWidthMap,
    ...firefoxFontWidthMap,
  };
  ```
2. Open your website in Chrome.
3. Copy everything from [generate-font-width-mapping](https://github.com/LalitSinghRana/dynamic-middle-ellipsis/blob/main/tools/generate-font-width-mapping.js) and paste it in the browser console.
   - This'll generate character widths mapping for all font-families in your project.
4. Copy the return object from the console and paste it against `chromeFontWidthMap` in `custom-font-family-map.ts`.
5. Repeat for Firefox.
6. Use the custom font width map:
  ```typescript
  import createMiddleEllipsis from '@dynamic-middle-ellipsis/lit';
  import { customFontWidthMap } from './custom-font-width-map';

  const CustomMiddleEllipsis = createMiddleEllipsis({
    customFontWidthMap,
  });

  customElements.define('custom-middle-ellipsis', CustomMiddleEllipsis);
  ```

### Using in Plain JavaScript

```html
<!DOCTYPE html>
<html>
<head>
  <script type="module">
    import '@dynamic-middle-ellipsis/lit';
  </script>
</head>
<body>
  <middle-ellipsis ellipsis-symbol="..." line-limit="1">
    Very long text that will be truncated in the middle
  </middle-ellipsis>

  <script>
    // Dynamically create elements
    const ellipsis = document.createElement('middle-ellipsis');
    ellipsis.setAttribute('ellipsis-symbol', '[...]');
    ellipsis.setAttribute('line-limit', '2');
    ellipsis.textContent = 'Another long text to truncate';
    document.body.appendChild(ellipsis);
  </script>
</body>
</html>
```

## Performance Considerations

- Uses ResizeObserver for efficient resize detection
- Direct DOM updates for optimal performance
- O(log(n)) complexity for parent/ancestor div width calculations where n is number of nodes in subtree
- Automatic cleanup on component disconnect
- Minimal re-renders

## Browser Support

- Modern browsers with:
  - Web Components support
  - ResizeObserver API
  - ES2022+ features

For older browser support, use appropriate polyfills:
- [@webcomponents/webcomponentsjs](https://github.com/webcomponents/polyfills/tree/master/packages/webcomponentsjs)
- [resize-observer-polyfill](https://github.com/que-etc/resize-observer-polyfill)

## Related Packages

- [`@dynamic-middle-ellipsis/core`](https://www.npmjs.com/package/@dynamic-middle-ellipsis/core) - Framework-agnostic core utilities
- [`@dynamic-middle-ellipsis/react`](https://www.npmjs.com/package/@dynamic-middle-ellipsis/react) - React components

## License

MIT © [Lalit Rana](https://github.com/LalitSinghRana)

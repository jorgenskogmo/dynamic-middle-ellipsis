# Lit Web Component Demo

This is a standalone demo showcasing the `@dynamic-middle-ellipsis/lit` web component.

## Running the Demo

### Development Server (Recommended)

Uses Vite for fast development with hot module replacement:

```bash
# From the repository root
cd websites/lit
pnpm install
pnpm dev
```

Then open your browser to the URL shown in the terminal (usually `http://localhost:5173`)

### Building for Production

```bash
pnpm build
pnpm preview
```

### Alternative: Using Any Static Server

You can also use any static HTTP server:

```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve .

# Using PHP
php -S localhost:8000
```

Note: When using a static server, you may need to adjust the import paths in `index.html`.

## What's Demonstrated

The demo page showcases:

- ✅ Basic text truncation with default ellipsis (...)
- ✅ Custom ellipsis symbols
- ✅ Multi-line support (2 and 3 lines)
- ✅ Short text (no truncation needed)
- ✅ File path truncation examples
- ✅ Interactive resizable container demo
- ✅ Combined features (custom symbol + multi-line)

## Component Usage

```html
<!-- Basic usage -->
<middle-ellipsis>
  Very long text that will be truncated in the middle
</middle-ellipsis>

<!-- With custom ellipsis symbol -->
<middle-ellipsis ellipsis-symbol="[...]">
  Long text here
</middle-ellipsis>

<!-- With multi-line support -->
<middle-ellipsis line-limit="2">
  Text that wraps to 2 lines before truncating
</middle-ellipsis>

<!-- Combined -->
<middle-ellipsis ellipsis-symbol="(...)" line-limit="3">
  Text with custom symbol and 3-line wrapping
</middle-ellipsis>
```

## Learn More

- [Package README](../../packages/lit/README.md)
- [NPM Package](https://www.npmjs.com/package/@dynamic-middle-ellipsis/lit)
- [GitHub Repository](https://github.com/LalitSinghRana/dynamic-middle-ellipsis)

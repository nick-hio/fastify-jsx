# fastify-jsx

[![NPM version](https://img.shields.io/npm/v/fastify-jsx.svg?style=flat)](https://www.npmjs.com/package/fastify-jsx)

Fastify plugin for sending JSX as HTML responses.

## Install

```bash
pnpm install fastify-jsx
npm install fastify-jsx
bun add fastify-jsx
yarn add fastify-jsx
```

### Compatibility

| Plugin Version | Fastify Version |
|----------------|-----------------|
| `^0.1.x`       | `^5.x`          |

## Usage

```jsx
// ESM
import Fastify from 'fastify'
import fastifyJsx from 'fastify-jsx'

const fastify = Fastify({ logger: true })
fastify.register(fastifyJsx)

fastify.get('/', () => (
    <div>JSX Payload</div>
))
fastify.get('/send', (request, reply) => {
    reply.send(<div>JSX Payload</div>)
})
```

```js
// CJS
const fastify = require('fastify')({ logger: true })
fastify.register(require('fastify-jsx'))

fastify.get('/', () => (
    <div>JSX Payload</div>
))
fastify.get('/send', (request, reply) => {
    reply.send(<div>JSX Payload</div>)
})
```

## Options

### `render`

Chooses the JSX rendering function from `react-dom/server`. Defaults to `'static'`.

- `'static'`: Uses the `renderToStaticMarkup` function. Renders static HTML without React attributes.
- `'string'`: Uses the `renderToString` function. Renders HTML with React attributes for client-side hydration.

```jsx
// ESM
fastify.register(fastifyJsx) // Render to static HTML
fastify.register(fastifyJsx, { render: 'string' }) // Render to HTML with hydration
```

```jsx
// CJS
fastify.register(require('fastify-jsx')) // Render to static HTML
fastify.register(require('fastify-jsx'), { render: 'string' }) // Render to HTML with hydration
```

## License

Licensed under [MIT](./LICENSE).

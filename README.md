# fastify-jsx

Fastify plugin for sending JSX as HTML responses.

## Install

Install using your preferred package manager:

```bash
pnpm install fastify-jsx
npm install fastify-jsx
bun add fastify-jsx
yarn add fastify-jsx
```

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

Chooses the JSX rendering method (Defaults to `'static'`).

| Value      | Description                                                                                                                    |
|------------|--------------------------------------------------------------------------------------------------------------------------------|
| `'static'` | Uses the `renderToStaticMarkup` function from `react-dom/server`. Outputs static HTML without React data attributes.           |
| `'string'` | Uses the `renderToString` function from `react-dom/server`. Outputs HTML with React data attributes for client-side hydration. |

```jsx
// ESM
fastify.register(fastifyJsx) // Render to static HTML
fastify.register(fastifyJsx, { render: 'string' }) // Render to HTML with hydration support
```

```jsx
// CJS
fastify.register(require('fastify-jsx')) // Render to static HTML
fastify.register(require('fastify-jsx'), { render: 'string' }) // Render to HTML with hydration support
```

## License

Licensed under [MIT](./LICENSE)

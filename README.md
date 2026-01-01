# fastify-jsx

Render JSX payloads from Fastify routes.

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
| `>=0.1.x`      | `^5.x`          |

## Usage

```jsx
// ESM
import Fastify from 'fastify'
import fastifyJsx from 'fastify-jsx'

const fastify = Fastify({ logger: true })
fastify.register(fastifyJsx)

fastify.get('/', (request, reply) => (
    <div>JSX Payload</div>
))
```

```js
// CJS
const fastify = require('fastify')({ logger: true })

fastify.register(require('fastify-jsx'))

fastify.get('/', (request, reply) => (
    <div>JSX Payload</div>
))
```

## License

Licensed under [MIT](./LICENSE).

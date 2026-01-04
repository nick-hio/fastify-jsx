# fastify-jsx

Send JSX from Fastify routes.

## Install

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
fastify.get('/', (request, reply) => {
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
fastify.get('/', (request, reply) => {
    reply.send(<div>JSX Payload</div>)
})
```

## License

Licensed under [MIT](./LICENSE).

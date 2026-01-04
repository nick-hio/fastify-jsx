import { describe, it } from 'bun:test';
import { buildServer, expectResponse } from './helpers';

describe('[fastifyJsx] Non-JSX', () => {
    it('should pass through object payloads', async () => {
        const fastify = buildServer();

        const nested = {
            level1: {
                level2: {
                    level3: {
                        value: 'deep',
                    },
                },
            },
        };

        fastify.get('/', () => nested);

        const res = await fastify.inject({ method: 'GET', url: '/' });
        expectResponse(res, nested, { type: 'application/json; charset=utf-8' });
    });

    it('should pass through empty object payloads', async () => {
        const fastify = buildServer();

        fastify.get('/', () => ({}));

        const res = await fastify.inject({ method: 'GET', url: '/' });
        expectResponse(res, {}, { type: 'application/json; charset=utf-8' });
    });

    it('should pass through array payloads', async () => {
        const fastify = buildServer();

        fastify.get('/', () => [1, 2, 3]);

        const res = await fastify.inject({ method: 'GET', url: '/' });
        expectResponse(res, [1, 2, 3], { type: 'application/json; charset=utf-8' });
    });

    it('should pass through string payloads', async () => {
        const fastify = buildServer();

        fastify.get('/', (_req, reply) => {
            reply.send('Plain text response');
        });

        const res = await fastify.inject({ method: 'GET', url: '/' });
        expectResponse(res, 'Plain text response', { type: 'text/plain; charset=utf-8' });
    });

    it('should pass through null payloads', async () => {
        const fastify = buildServer();

        fastify.get('/', () => null);

        const res = await fastify.inject({ method: 'GET', url: '/' });
        expectResponse(res, 'null', { type: 'application/json; charset=utf-8' });
    });

    it('should pass through boolean payloads', async () => {
        const fastify = buildServer();

        fastify.get('/true', () => true);
        fastify.get('/false', () => false);

        const trueRes = await fastify.inject({ method: 'GET', url: '/true' });
        const falseRes = await fastify.inject({ method: 'GET', url: '/false' });

        expectResponse(trueRes, 'true', { type: 'application/json; charset=utf-8' });
        expectResponse(falseRes, 'false', { type: 'application/json; charset=utf-8' });
    });
});

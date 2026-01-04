import { describe, expect, it } from 'bun:test';
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

        expect(res.headers['content-type']).toBe('application/json; charset=utf-8');
        expect(res.statusCode).toBe(200);
        expect(JSON.parse(res.body)).toEqual(nested);
    });

    it('should pass through empty object payloads', async () => {
        const fastify = buildServer();

        fastify.get('/', () => ({}));

        const res = await fastify.inject({ method: 'GET', url: '/' });

        expect(res.statusCode).toBe(200);
        expect(JSON.parse(res.body)).toEqual({});
    });

    it('should pass through array payloads', async () => {
        const fastify = buildServer();

        fastify.get('/', () => [1, 2, 3]);

        const res = await fastify.inject({ method: 'GET', url: '/' });

        expect(res.statusCode).toBe(200);
        expect(JSON.parse(res.body)).toEqual([1, 2, 3]);
    });

    it('should pass through string payloads', async () => {
        const fastify = buildServer();

        fastify.get('/', (_req, reply) => {
            reply.send('Plain text response');
        });

        const res = await fastify.inject({ method: 'GET', url: '/' });

        expect(res.statusCode).toBe(200);
        expect(res.body).toBe('Plain text response');
    });

    it('should pass through numeric payloads', async () => {
        const fastify = buildServer();

        fastify.get('/', () => 123);

        const res = await fastify.inject({ method: 'GET', url: '/' });

        expect(res.statusCode).toBe(200);
        expect(res.body).toBe('123');
    });

    it('should pass through null payloads', async () => {
        const fastify = buildServer();

        fastify.get('/', () => null);

        const res = await fastify.inject({ method: 'GET', url: '/' });

        expect(res.statusCode).toBe(200);
        expect(res.body).toBe('null');
    });

    it('should pass through boolean payloads', async () => {
        const fastify = buildServer();

        fastify.get('/true', () => true);
        fastify.get('/false', () => false);

        const trueRes = await fastify.inject({ method: 'GET', url: '/true' });
        const falseRes = await fastify.inject({ method: 'GET', url: '/false' });

        expect(trueRes.body).toBe('true');
        expect(falseRes.body).toBe('false');
    });
});

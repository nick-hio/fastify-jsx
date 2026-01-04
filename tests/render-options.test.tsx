import { describe, it } from 'bun:test';
import { buildServer, expectResponse } from './helpers';

describe('[fastifyJsx] Render Options', () => {
    it(`should default to 'static' rendering`, async () => {
        const fastify = buildServer();

        fastify.get('/', () => <div>{'Hello'} {'World'}</div>);

        const res = await fastify.inject({ method: 'GET', url: '/' });
        expectResponse(res, '<div>Hello World</div>');
    });

    it(`should handle 'static' rendering`, async () => {
        const fastify = buildServer({
            render: 'static',
        });

        fastify.get('/', () => <div>{'Hello'} {'World'}</div>);

        const res = await fastify.inject({ method: 'GET', url: '/' });
        expectResponse(res, '<div>Hello World</div>');
    });

    it(`should handle 'string' rendering`, async () => {
        const fastify = buildServer({
            render: 'string',
        });

        fastify.get('/', () => <div>{'Hello'} {'World'}</div>);

        const res = await fastify.inject({ method: 'GET', url: '/' });
        expectResponse(res, '<div>Hello<!-- --> <!-- -->World</div>');
    });
});

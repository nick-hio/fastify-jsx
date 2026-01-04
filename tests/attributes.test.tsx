import { describe, it } from 'bun:test';
import { buildServer, expectResponse } from './helpers';

describe('[fastifyJsx] HTML Attributes', () => {
    it(`should handle 'style' attribute`, async () => {
        const fastify = buildServer();

        fastify.get('/', () => (
            <div style={{ color: 'red', fontSize: '16px' }}>Styled</div>
        ));

        const res = await fastify.inject({ method: 'GET', url: '/' });
        expectResponse(res, '<div style="color:red;font-size:16px">Styled</div>');
    });

    it(`should handle 'data-' attributes`, async () => {
        const fastify = buildServer();

        fastify.get('/', () => (
            <div data-testid="main" data-value="123">Content</div>
        ));

        const res = await fastify.inject({ method: 'GET', url: '/' });
        expectResponse(res, '<div data-testid="main" data-value="123">Content</div>');
    });

    it(`should handle 'aria-' attributes`, async () => {
        const fastify = buildServer();

        fastify.get('/', () => (
            <button aria-label="Close" aria-hidden={false}>×</button>
        ));

        const res = await fastify.inject({ method: 'GET', url: '/' });
        expectResponse(res, '<button aria-label="Close" aria-hidden="false">×</button>');
    });

    it(`should handle 'htmlFor' attribute`, async () => {
        const fastify = buildServer();

        fastify.get('/', () => (
            <label htmlFor="email">Email</label>
        ));

        const res = await fastify.inject({ method: 'GET', url: '/' });
        expectResponse(res, '<label for="email">Email</label>');
    });

    it(`should handle boolean attributes`, async () => {
        const fastify = buildServer();

        fastify.get('/', () => (
            <div>
                <input type="checkbox" checked readOnly />
                <button disabled>Disabled</button>
            </div>
        ));

        const res = await fastify.inject({ method: 'GET', url: '/' });
        expectResponse(res, '<div><input type="checkbox" readOnly="" checked=""/><button disabled="">Disabled</button></div>');
    });

    it(`should handle quotes in attribute values`, async () => {
        const fastify = buildServer();

        fastify.get('/', () => (
            <div title='He said "Hello"'>Content</div>
        ));

        const res = await fastify.inject({ method: 'GET', url: '/' });
        expectResponse(res, '<div title="He said &quot;Hello&quot;">Content</div>');
    });
});

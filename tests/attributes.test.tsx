import { describe, expect, it } from 'bun:test';
import { buildServer, expectResponse } from './helpers';

describe('[fastifyJsx] HTML Attributes', () => {
    it(`should handle 'style' attribute`, async () => {
        const fastify = buildServer();

        fastify.get('/', () => (
            <div style={{ color: 'red', fontSize: '16px' }}>Styled</div>
        ));

        const res = await fastify.inject({ method: 'GET', url: '/' });

        expect(res.statusCode).toBe(200);
        expect(res.body).toContain('style="');
        expect(res.body).toContain('color:red');
    });

    it(`should handle 'data-' attributes`, async () => {
        const fastify = buildServer();

        fastify.get('/', () => (
            <div data-testid="main" data-value="123">Content</div>
        ));

        const res = await fastify.inject({ method: 'GET', url: '/' });

        expect(res.statusCode).toBe(200);
        expect(res.body).toContain('data-testid="main"');
        expect(res.body).toContain('data-value="123"');
    });

    it(`should handle 'aria-' attributes`, async () => {
        const fastify = buildServer();

        fastify.get('/', () => (
            <button aria-label="Close" aria-hidden={false}>×</button>
        ));

        const res = await fastify.inject({ method: 'GET', url: '/' });

        expect(res.statusCode).toBe(200);
        expect(res.body).toContain('aria-label="Close"');
    });

    it(`should handle 'htmlFor' attribute`, async () => {
        const fastify = buildServer();

        fastify.get('/', () => (
            <label htmlFor="email">Email</label>
        ));

        const res = await fastify.inject({ method: 'GET', url: '/' });

        expect(res.statusCode).toBe(200);
        expect(res.body).toBe('<label for="email">Email</label>');
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

        expect(res.statusCode).toBe(200);
        expect(res.body).toContain('checked=""');
        expect(res.body).toContain('disabled=""');
    });

    it(`should handle quotes in attribute values`, async () => {
        const fastify = buildServer();

        fastify.get('/', () => (
            <div title='He said "Hello"'>Content</div>
        ));

        const res = await fastify.inject({ method: 'GET', url: '/' });

        expect(res.statusCode).toBe(200);
        expect(res.body).toContain('title="He said \\"Hello\\""');
    });
});

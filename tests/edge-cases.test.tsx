import { describe, expect, it } from 'bun:test';
import { buildServer, expectResponse } from './helpers';

describe('[fastifyJsx] Edge Cases', () => {
    it('should render fragments', async () => {
        const fastify = buildServer();

        fastify.get('/', () => (
            <>
                <>
                    <span>A</span>
                    <span>B</span>
                </>
                <span>C</span>
            </>
        ));

        const res = await fastify.inject({ method: 'GET', url: '/' });

        expect(res.statusCode).toBe(200);
        expect(res.body).toBe('<span>A</span><span>B</span><span>C</span>');
    });

    it('should handle empty elements', async () => {
        const fastify = buildServer();

        fastify.get('/', () => <div></div>);

        const res = await fastify.inject({ method: 'GET', url: '/' });

        expect(res.statusCode).toBe(200);
        expect(res.body).toBe('<div></div>');
    });

    it('should handle whitespace', async () => {
        const fastify = buildServer();

        fastify.get('/', () => <div>   Spaced   </div>);

        const res = await fastify.inject({ method: 'GET', url: '/' });

        expect(res.statusCode).toBe(200);
        expect(res.body).toBe('<div>   Spaced   </div>');
    });

    it('should handle multiple text nodes', async () => {
        const fastify = buildServer();

        const prefix = 'Hello';
        const suffix = 'World';

        fastify.get('/', () => <div>{prefix} {suffix}</div>);

        const res = await fastify.inject({ method: 'GET', url: '/' });

        expect(res.statusCode).toBe(200);
        expect(res.body).toBe('<div>Hello World</div>');
    });

    it('should handle falsy values', async () => {
        const fastify = buildServer();

        fastify.get('/', () => (
            <div>
                {false}
                {null}
                {undefined}
                {0}
                {''}
            </div>
        ));

        const res = await fastify.inject({ method: 'GET', url: '/' });

        expect(res.statusCode).toBe(200);
        expect(res.body).toBe('<div>0</div>');
    });
});

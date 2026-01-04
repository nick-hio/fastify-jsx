import { describe, it } from 'bun:test';
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
        expectResponse(res, '<span>A</span><span>B</span><span>C</span>');
    });

    it('should handle empty elements', async () => {
        const fastify = buildServer();

        fastify.get('/', () => <div></div>);

        const res = await fastify.inject({ method: 'GET', url: '/' });
        expectResponse(res, '<div></div>');
    });

    it('should handle whitespace', async () => {
        const fastify = buildServer();

        fastify.get('/', () => <div>   Spaced   </div>);

        const res = await fastify.inject({ method: 'GET', url: '/' });
        expectResponse(res, '<div>   Spaced   </div>');
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
        expectResponse(res, '<div>0</div>');
    });
});

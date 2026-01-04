import { describe, it } from 'bun:test';
import { buildServer, expectResponse } from './helpers';

describe('[fastifyJsx] Special Characters & Escaping', () => {
    it('should escape special characters', async () => {
        const fastify = buildServer();

        fastify.get('/', () => <div>{'<script>alert("xss")</script>'}</div>);

        const res = await fastify.inject({ method: 'GET', url: '/' });
        expectResponse(res, '<div>&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;</div>');
    });

    it('should handle ampersand character', async () => {
        const fastify = buildServer();

        fastify.get('/', () => <div>Tom &amp; Jerry</div>);

        const res = await fastify.inject({ method: 'GET', url: '/' });
        expectResponse(res, '<div>Tom &amp; Jerry</div>');
    });

    it('should handle unicode characters', async () => {
        const fastify = buildServer();

        fastify.get('/', () => <div>こんにちは 🎉</div>);

        const res = await fastify.inject({ method: 'GET', url: '/' });
        expectResponse(res, '<div>こんにちは 🎉</div>');
    });
});

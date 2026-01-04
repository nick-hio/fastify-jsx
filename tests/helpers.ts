import Fastify from 'fastify';
import { fastifyJsx } from '../src';
import type { FastifyJsxOptions } from '../src';
import { expect } from 'bun:test';
import type { FastifyInstance } from 'fastify';

/**
 * Builds and returns a Fastify server instance with the fastify-jsx plugin registered.
 */
export const buildServer = (opts?: FastifyJsxOptions) => {
    const fastify = Fastify();
    fastify.register(fastifyJsx, opts ?? {});

    fastify.ready((e) => {
        if (e) {
            console.error('FASTIFY ERROR');
            console.error(JSON.stringify(e, null, 2));
            throw e;
        }
    });

    return fastify;
};

type FastifyInjectResponse = Awaited<ReturnType<FastifyInstance['inject']>>;

/** Helper to test injected Fastify responses. */
export function expectResponse(
    res: FastifyInjectResponse,
    expectedBody: string | object,
    expectedData?: {
        status?: number,
        type?: string,
        headers?: Record<string, string>,
    },
): void;
export function expectResponse(
    res: FastifyInjectResponse,
    expectedBody: string | object,
    expectedData?: never,
): void;
export function expectResponse(
    res: FastifyInjectResponse,
    expectedBody: string | object,
    expectedData?: {
        status?: number,
        type?: string,
        headers?: Record<string, string>,
    }
): void {
    if (typeof expectedBody === 'object') {
        expect(res.json<object>()).toEqual(expectedBody);
    } else {
        expect(res.body).toBe(expectedBody);
    }

    const capitalizedContentType = res.headers['Content-Type'];
    const lowercasedContentType = res.headers['content-type'];
    expect(!(capitalizedContentType && lowercasedContentType)).toBe(true);
    expect(capitalizedContentType ?? lowercasedContentType).toBe(expectedData?.type ?? 'text/html; charset=utf-8');

    expect(res.statusCode).toBe(expectedData?.status ? expectedData.status : 200);

    if (expectedData?.headers) {
        for (const [key, value] of Object.entries(expectedData.headers)) {
            const lowerKey = key.toLowerCase();
            if (lowerKey === 'content-type') continue;
            expect(res.headers[lowerKey]).toBe(value);
        }
    }
}

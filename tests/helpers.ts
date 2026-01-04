import Fastify from 'fastify';
import { fastifyJsx } from '../src';
import { expect } from 'bun:test';
import http from 'node:http';
import type { Readable } from 'node:stream';

export const buildServer = () => {
    const fastify = Fastify();
    fastify.register(fastifyJsx);

    fastify.ready((e) => {
        if (e) {
            console.error('FASTIFY ERROR');
            console.error(JSON.stringify(e, null, 2));
            throw e;
        }
    });

    return fastify;
};

type FastifyInjectResponse = {
    raw: {
        res: http.ServerResponse,
        req: http.IncomingMessage
    }
    rawPayload: Buffer
    headers: http.OutgoingHttpHeaders
    statusCode: number
    statusMessage: string
    trailers: { [key: string]: string }
    payload: string
    body: string
    json: <T = any>() => T
    stream: () => Readable
    cookies: Array<{
        name: string
        value: string
        expires?: Date
        maxAge?: number
        secure?: boolean
        httpOnly?: boolean
        sameSite?: string
        [p: string]: unknown
    }>
}

export const expectResponseOld = (
    res: FastifyInjectResponse,
    expectedStatus: number,
    expectedContentType: string,
    expectedBody: string | object,
    expectedHeaders?: Record<string, string>,
) => {
    if (typeof expectedBody === 'object') {
        expect(res.json<object>()).toEqual(expectedBody);
    } else {
        expect(res.body).toBe(expectedBody);
    }

    // if (expectedContentType || expectedContentType === null) {
        const capitalizedContentType = res.headers['Content-Type'];
        const lowercasedContentType = res.headers['content-type'];
        expect(!(capitalizedContentType && lowercasedContentType)).toBe(true);
        expect(capitalizedContentType ?? lowercasedContentType).toBe(expectedContentType ?? undefined);
    // }

    expect(res.statusCode).toBe(expectedStatus);

    if (expectedHeaders) {
        for (const [key, value] of Object.entries(expectedHeaders)) {
            const lowerKey = key.toLowerCase();
            if (lowerKey === 'content-type') continue;
            expect(res.headers[lowerKey]).toBe(value);
        }
    }
}

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

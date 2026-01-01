import fp from "fastify-plugin";
import { isValidElement } from "react";
import { renderToString } from "react-dom/server";

export const fastifyJsx = fp((fastify, _opts, done) => {
    fastify.addHook('preSerialization', async (_req, res, payload) => {
        try {
            if (payload && typeof payload === 'object' && isValidElement(payload)) {
                res.type('text/html; charset=utf-8');
                return renderToString(payload);
            }
            return payload;
        } catch (e) {
            fastify.log.error(`[fastify-jsx] preSerialization Error: ${JSON.stringify(e, null, 2)}`);
            return payload;
        }
    });

    fastify.addHook('onSend', async (_req, _res, payload) => {
        if (typeof payload === 'string' && payload.length >= 4 && payload.startsWith('"<') && payload.endsWith('>"')) {
            return payload.slice(1, -1).replaceAll('\\"', '"'); // Unescaping quotes from the Fastify's serialization
        }
        return payload;
    });

    done();
});

export default fastifyJsx;
